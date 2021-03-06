// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/math/Math.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "./interfaces/IShumBuildBurnSystem.sol";
import "./interfaces/IShumCollateralSystem.sol";
import "./interfaces/IShumConfig.sol";
import "./interfaces/IShumDebtSystem.sol";
import "./interfaces/IShumPrices.sol";
import "./interfaces/IShumRewardLocker.sol";
import "./upgradeable/ShumAdminUpgradeable.sol";
import "./SafeDecimalMath.sol";

import "hardhat/console.sol";

contract ShumLiquidation is ShumAdminUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeDecimalMath for uint256;

    event PositionMarked(address user, address marker);
    event PositionUnmarked(address user);
    event PositionLiquidated(
        address user,
        address marker,
        address liquidator,
        uint256 debtBurnt,
        bytes32 collateralCurrency,
        uint256 collateralWithdrawnFromStaked,
        uint256 collateralWithdrawnFromLocked,
        uint256 markerReward,
        uint256 liquidatorReward
    );

    struct UndercollateralizationMark {
        address marker;
        uint64 timestamp;
    }
    struct EvalUserPositionResult {
        uint256 debtBalance;
        uint256 stakedCollateral;
        uint256 lockedCollateral;
        uint256 collateralPrice;
        uint256 collateralValue;
        uint256 collateralizationRatio;
    }
    struct FetchRatiosResult {
        uint256 issuanceRatio;
        uint256 markerRewardRatio;
        uint256 liquidatorRewardRatio;
    }
    struct LiquidationRewardCalculationResult {
        uint256 collateralWithdrawalAmount;
        uint256 markerReward;
        uint256 liquidatorReward;
        uint256 totalReward;
    }
    struct LiquidatePositionParams {
        address user;
        address liquidator;
        uint256 lusdToBurn;
    }
    struct WithdrawCollateralParams {
        address user;
        address liquidator;
        uint256 collateralWithdrawalAmount;
        uint256 stakedCollateral;
        uint256 lockedCollateral;
    }
    struct DistributeRewardsParams {
        address user;
        address marker;
        address liquidator;
        uint256 markerReward;
        uint256 liquidatorReward;
        uint256 stakedCollateral;
        uint256 lockedCollateral;
    }

    IShumBuildBurnSystem public shumBuildBurnSystem;
    IShumCollateralSystem public shumCollateralSystem;
    IShumConfig public shumConfig;
    IShumDebtSystem public shumDebtSystem;
    IShumPrices public shumPrices;
    IShumRewardLocker public shumRewardLocker;

    mapping(address => UndercollateralizationMark) public undercollateralizationMarks;

    bytes32 public constant LIQUIDATION_MARKER_REWARD_KEY = "LiquidationMarkerReward";
    bytes32 public constant LIQUIDATION_LIQUIDATOR_REWARD_KEY = "LiquidationLiquidatorReward";
    bytes32 public constant LIQUIDATION_RATIO_KEY = "LiquidationRatio";
    bytes32 public constant LIQUIDATION_DELAY_KEY = "LiquidationDelay";
    bytes32 public constant BUILD_RATIO_KEY = "BuildRatio";

    function isPositionMarkedAsUndercollateralized(address user) public view returns (bool) {
        return undercollateralizationMarks[user].timestamp > 0;
    }

    function getUndercollateralizationMarkMarker(address user) public view returns (address) {
        return undercollateralizationMarks[user].marker;
    }

    function getUndercollateralizationMarkTimestamp(address user) public view returns (uint256) {
        return uint256(undercollateralizationMarks[user].timestamp);
    }

    function __ShumLiquidation_init(
        IShumBuildBurnSystem _shumBuildBurnSystem,
        IShumCollateralSystem _shumCollateralSystem,
        IShumConfig _shumConfig,
        IShumDebtSystem _shumDebtSystem,
        IShumPrices _shumPrices,
        IShumRewardLocker _shumRewardLocker,
        address _admin
    ) public initializer {
        __ShumAdminUpgradeable_init(_admin);

        require(address(_shumBuildBurnSystem) != address(0), "ShumLiquidation: zero address");
        require(address(_shumCollateralSystem) != address(0), "ShumLiquidation: zero address");
        require(address(_shumConfig) != address(0), "ShumLiquidation: zero address");
        require(address(_shumDebtSystem) != address(0), "ShumLiquidation: zero address");
        require(address(_shumPrices) != address(0), "ShumLiquidation: zero address");
        require(address(_shumRewardLocker) != address(0), "ShumLiquidation: zero address");

        shumBuildBurnSystem = _shumBuildBurnSystem;
        shumCollateralSystem = _shumCollateralSystem;
        shumConfig = _shumConfig;
        shumDebtSystem = _shumDebtSystem;
        shumPrices = _shumPrices;
        shumRewardLocker = _shumRewardLocker;
    }

    function setShumPrices(IShumPrices newShumPrices) external onlyAdmin {
        require(address(newShumPrices) != address(0), "ShumLiquidation: zero address");
        shumPrices = newShumPrices;
    }

    function markPositionAsUndercollateralized(address user) external {
        require(!isPositionMarkedAsUndercollateralized(user), "ShumLiquidation: already marked");

        EvalUserPositionResult memory evalResult = evalUserPostion(user);
        uint256 liquidationRatio = shumConfig.getUint(LIQUIDATION_RATIO_KEY);

        require(evalResult.collateralizationRatio > liquidationRatio, "ShumLiquidation: not undercollateralized");

        undercollateralizationMarks[user] = UndercollateralizationMark({
            marker: msg.sender,
            timestamp: uint64(block.timestamp)
        });

        emit PositionMarked(user, msg.sender);
    }

    function removeUndercollateralizationMark(address user) external {
        require(isPositionMarkedAsUndercollateralized(user), "ShumLiquidation: not marked");

        // Can only remove mark if C ratio is restored to issuance ratio
        EvalUserPositionResult memory evalResult = evalUserPostion(user);
        uint256 issuanceRatio = shumConfig.getUint(BUILD_RATIO_KEY);
        require(evalResult.collateralizationRatio <= issuanceRatio, "ShumLiquidation: still undercollateralized");

        delete undercollateralizationMarks[user];

        emit PositionUnmarked(user);
    }

    function liquidatePosition(
        address user,
        uint256 lusdToBurn,
        uint256[] calldata rewardEntryIds
    ) external {
        require(lusdToBurn > 0, "ShumLiquidation: zero amount");

        _liquidatePosition(
            LiquidatePositionParams({user: user, liquidator: msg.sender, lusdToBurn: lusdToBurn}),
            rewardEntryIds
        );
    }

    function liquidatePositionMax(address user, uint256[] calldata rewardEntryIds) external {
        _liquidatePosition(LiquidatePositionParams({user: user, liquidator: msg.sender, lusdToBurn: 0}), rewardEntryIds);
    }

    function _liquidatePosition(LiquidatePositionParams memory params, uint256[] calldata rewardEntryIds) private {
        // Check mark and delay
        UndercollateralizationMark memory mark = undercollateralizationMarks[params.user];
        {
            uint256 liquidationDelay = shumConfig.getUint(LIQUIDATION_DELAY_KEY);
            require(mark.timestamp > 0, "ShumLiquidation: not marked for undercollateralized");
            require(block.timestamp > mark.timestamp + liquidationDelay, "ShumLiquidation: liquidation delay not passed");
        }

        // Confirm that the position is still undercollateralized
        FetchRatiosResult memory ratios = fetchRatios();
        EvalUserPositionResult memory evalResult = evalUserPostion(params.user);
        require(evalResult.collateralizationRatio > ratios.issuanceRatio, "ShumLiquidation: not undercollateralized");

        uint256 maxLusdToBurn =
            evalResult.debtBalance.sub(evalResult.collateralValue.multiplyDecimal(ratios.issuanceRatio)).divideDecimal(
                SafeDecimalMath.unit().sub(
                    SafeDecimalMath.unit().add(ratios.markerRewardRatio.add(ratios.liquidatorRewardRatio)).multiplyDecimal(
                        ratios.issuanceRatio
                    )
                )
            );
        if (params.lusdToBurn == 0) {
            // Liquidate max
            params.lusdToBurn = maxLusdToBurn;
        } else {
            // User specified amount to liquidate
            require(params.lusdToBurn <= maxLusdToBurn, "ShumLiquidation: burn amount too large");
        }

        // Burn lUSD and update debt
        shumBuildBurnSystem.burnForLiquidation(params.user, params.liquidator, params.lusdToBurn);

        LiquidationRewardCalculationResult memory rewards =
            calculateRewards(
                params.lusdToBurn,
                evalResult.collateralPrice,
                ratios.markerRewardRatio,
                ratios.liquidatorRewardRatio
            );

        {
            uint256 totalCollateralToMove = rewards.collateralWithdrawalAmount.add(rewards.totalReward);
            uint256 totalCollateralAmount = evalResult.stakedCollateral.add(evalResult.lockedCollateral);
            require(totalCollateralToMove > 0, "ShumLiquidation: no collateral withdrawal");
            require(totalCollateralToMove <= totalCollateralAmount, "ShumLiquidation: insufficient collateral"); // Insurance fund needed to resolve this
        }

        uint256 totalFromStaked;
        uint256 totalFromLocked;

        // Collateral withdrawal
        {
            (totalFromStaked, totalFromLocked) = withdrawCollateral(
                WithdrawCollateralParams({
                    user: params.user,
                    liquidator: params.liquidator,
                    collateralWithdrawalAmount: rewards.collateralWithdrawalAmount,
                    stakedCollateral: evalResult.stakedCollateral,
                    lockedCollateral: evalResult.lockedCollateral
                }),
                rewardEntryIds
            );

            // Track staked and locked amounts locally
            evalResult.stakedCollateral = evalResult.stakedCollateral.sub(totalFromStaked);
            evalResult.lockedCollateral = evalResult.lockedCollateral.sub(totalFromLocked);
        }

        // Rewards
        {
            (uint256 fromStaked, uint256 fromLocked) =
                distributeRewards(
                    DistributeRewardsParams({
                        user: params.user,
                        marker: mark.marker,
                        liquidator: params.liquidator,
                        markerReward: rewards.markerReward,
                        liquidatorReward: rewards.liquidatorReward,
                        stakedCollateral: evalResult.stakedCollateral,
                        lockedCollateral: evalResult.lockedCollateral
                    }),
                    rewardEntryIds
                );

            totalFromStaked = totalFromStaked.add(fromStaked);
            totalFromLocked = totalFromLocked.add(fromLocked);
        }

        emit PositionLiquidated(
            params.user,
            mark.marker,
            params.liquidator,
            params.lusdToBurn,
            "SHUM",
            totalFromStaked,
            totalFromLocked,
            rewards.markerReward,
            rewards.liquidatorReward
        );

        // If the position is completely liquidated, remove the marker
        if (params.lusdToBurn == maxLusdToBurn) {
            delete undercollateralizationMarks[params.user];
            emit PositionUnmarked(params.user);
        }
    }

    function evalUserPostion(address user) private view returns (EvalUserPositionResult memory) {
        (uint256 debtBalance, ) = shumDebtSystem.GetUserDebtBalanceInUsd(user);
        (uint256 stakedCollateral, uint256 lockedCollateral) = shumCollateralSystem.getUserShumCollateralBreakdown(user);

        uint256 collateralPrice = shumPrices.getPrice("SHUM");
        uint256 collateralValue = stakedCollateral.add(lockedCollateral).multiplyDecimal(collateralPrice);
       
        uint256 collateralizationRatio = collateralValue == 0 ? 0 : debtBalance.divideDecimal(collateralValue);
        return
            EvalUserPositionResult({
                debtBalance: debtBalance,
                stakedCollateral: stakedCollateral,
                lockedCollateral: lockedCollateral,
                collateralPrice: collateralPrice,
                collateralValue: collateralValue,
                collateralizationRatio: collateralizationRatio
            });
    }

    function fetchRatios() private view returns (FetchRatiosResult memory) {
        uint256 issuanceRatio = shumConfig.getUint(BUILD_RATIO_KEY);
        uint256 markerRewardRatio = shumConfig.getUint(LIQUIDATION_MARKER_REWARD_KEY);
        uint256 liquidatorRewardRatio = shumConfig.getUint(LIQUIDATION_LIQUIDATOR_REWARD_KEY);

        return
            FetchRatiosResult({
                issuanceRatio: issuanceRatio,
                markerRewardRatio: markerRewardRatio,
                liquidatorRewardRatio: liquidatorRewardRatio
            });
    }

    function calculateRewards(
        uint256 lusdToBurn,
        uint256 collateralPrice,
        uint256 markerRewardRatio,
        uint256 liquidatorRewardRatio
    ) private pure returns (LiquidationRewardCalculationResult memory) {
        // Amount of collateral with the same value as the debt burnt (without taking into account rewards)
        uint256 collateralWithdrawalAmount = lusdToBurn.divideDecimal(collateralPrice);

        // Reward amounts
        uint256 markerReward = collateralWithdrawalAmount.multiplyDecimal(markerRewardRatio);
        uint256 liquidatorReward = collateralWithdrawalAmount.multiplyDecimal(liquidatorRewardRatio);
        uint256 totalReward = markerReward.add(liquidatorReward);

        return
            LiquidationRewardCalculationResult({
                collateralWithdrawalAmount: collateralWithdrawalAmount,
                markerReward: markerReward,
                liquidatorReward: liquidatorReward,
                totalReward: totalReward
            });
    }

    function withdrawCollateral(WithdrawCollateralParams memory params, uint256[] calldata rewardEntryIds)
        private
        returns (uint256 amountFromStaked, uint256 amountFromLocked)
    {
        amountFromStaked = Math.min(params.collateralWithdrawalAmount, params.stakedCollateral);
        amountFromLocked = params.collateralWithdrawalAmount.sub(amountFromStaked);

        require(amountFromLocked <= params.lockedCollateral, "ShumLiquidation: insufficient locked collateral");

        if (amountFromStaked > 0) {
            shumCollateralSystem.moveCollateral(params.user, params.liquidator, "SHUM", amountFromStaked);
        }

        if (amountFromLocked > 0) {
            shumRewardLocker.moveReward(params.user, params.liquidator, amountFromLocked, rewardEntryIds);
        }
    }

    function distributeRewards(DistributeRewardsParams memory params, uint256[] calldata rewardEntryIds)
        private
        returns (uint256 amountFromStaked, uint256 amountFromLocked)
    {
        uint256 totalReward = params.markerReward.add(params.liquidatorReward);

        amountFromStaked = Math.min(totalReward, params.stakedCollateral);
        amountFromLocked = totalReward.sub(amountFromStaked);

        require(amountFromLocked <= params.lockedCollateral, "ShumLiquidation: insufficient locked collateral");

        uint256 markerRewardFromLocked = params.markerReward;
        uint256 liquidatorRewardFromLocked = params.liquidatorReward;

        if (amountFromStaked > 0) {
            uint256 markerRewardFromStaked = amountFromStaked.mul(params.markerReward).div(totalReward);
            uint256 liquidatorRewardFromStaked = amountFromStaked.sub(markerRewardFromStaked);

            markerRewardFromLocked = markerRewardFromLocked.sub(markerRewardFromStaked);
            liquidatorRewardFromLocked = liquidatorRewardFromLocked.sub(liquidatorRewardFromStaked);

            shumCollateralSystem.moveCollateral(params.user, params.marker, "SHUM", markerRewardFromStaked);
            shumCollateralSystem.moveCollateral(params.user, params.liquidator, "SHUM", liquidatorRewardFromStaked);
        }

        if (amountFromLocked > 0) {
            shumRewardLocker.moveRewardProRata(
                params.user,
                params.marker,
                markerRewardFromLocked,
                params.liquidator,
                liquidatorRewardFromLocked,
                rewardEntryIds
            );
        }
    }
}
