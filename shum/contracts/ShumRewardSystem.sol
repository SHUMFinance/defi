// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts-upgradeable/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./interfaces/IShumCollateralSystem.sol";
import "./interfaces/IShumRewardLocker.sol";
import "./upgradeable/ShumAdminUpgradeable.sol";

/**
 * @title ShumRewardSystem
 *
 * @dev A contract for distributing staking rewards and exchange fees based on
 * amounts calculated and signed off-chain.
 *
 * This contract only performs basic signature validation and re-entrance prevention
 * to minimize the cost of claming rewards.
 *
 * Period ID starts from 1, not zero.
 */
contract ShumRewardSystem is ShumAdminUpgradeable {
    using ECDSAUpgradeable for bytes32;
    using SafeMathUpgradeable for uint256;

    event RewardSignerChanged(address oldSigner, address newSigner);
    event RewardLockerAddressChanged(address oldAddress, address newAddress);
    event RewardClaimed(address recipient, uint256 periodId, uint256 stakingReward, uint256 feeReward);

    uint256 public firstPeriodStartTime;
    address public rewardSigner;
    mapping(address => uint256) public userLastClaimPeriodIds;

    IERC20Upgradeable public lusd;
    IERC20Upgradeable public shum;
    IShumCollateralSystem public collateralSystem;
    IShumRewardLocker public rewardLocker;

    bytes32 public DOMAIN_SEPARATOR; // For EIP-712

    /* EIP-712 type hashes */
    bytes32 public constant REWARD_TYPEHASH =
        keccak256("Reward(uint256 periodId,address recipient,uint256 stakingReward,uint256 feeReward)");

    uint256 public constant PERIOD_LENGTH = 1 weeks;
    uint256 public constant CLAIM_WINDOW_PERIOD_COUNT = 2;
    uint256 public constant STAKING_REWARD_LOCK_PERIOD = 52 weeks;

    function getCurrentPeriodId() public view returns (uint256) {
        require(block.timestamp >= firstPeriodStartTime, "ShumRewardSystem: first period not started");
        return (block.timestamp - firstPeriodStartTime) / PERIOD_LENGTH + 1; // No SafeMath needed
    }

    function getPeriodStartTime(uint256 periodId) public view returns (uint256) {
        require(periodId > 0, "ShumRewardSystem: period ID must be positive");
        return firstPeriodStartTime.add(periodId.sub(1).mul(PERIOD_LENGTH));
    }

    function getPeriodEndTime(uint256 periodId) public view returns (uint256) {
        require(periodId > 0, "ShumRewardSystem: period ID must be positive");
        return firstPeriodStartTime.add(periodId.mul(PERIOD_LENGTH));
    }

    function __ShumRewardSystem_init(
        uint256 _firstPeriodStartTime,
        address _rewardSigner,
        address _lusdAddress,
        address _shumAddress,
        address _collateralSystemAddress,
        address _rewardLockerAddress,
        address _admin
    ) public initializer {
        __ShumAdminUpgradeable_init(_admin);

        /**
         * The next line is commented out to make migration from Ethereum to Binance Smart
         * chain possible.
         */
        // require(block.timestamp < _firstPeriodStartTime + PERIOD_LENGTH, "ShumRewardSystem: first period already ended");
        firstPeriodStartTime = _firstPeriodStartTime;
        _setRewardSigner(_rewardSigner);

        require(
            _lusdAddress != address(0) && _collateralSystemAddress != address(0) && _rewardLockerAddress != address(0),
            "ShumRewardSystem: zero address"
        );
        lusd = IERC20Upgradeable(_lusdAddress);
        shum = IERC20Upgradeable(_shumAddress);
        collateralSystem = IShumCollateralSystem(_collateralSystemAddress);
        rewardLocker = IShumRewardLocker(_rewardLockerAddress);

        // While we could in-theory calculate the EIP-712 domain separator off-chain, doing
        // it on-chain simplifies deployment and the cost here is one-off and acceptable.
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("Shum")),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    function setRewardSigner(address _rewardSigner) external onlyAdmin {
        _setRewardSigner(_rewardSigner);
    }

    function setRewardLockerAddress(address _rewardLockerAddress) external onlyAdmin {
        _setRewardLockerAddress(_rewardLockerAddress);
    }

    function claimReward(
        uint256 periodId,
        uint256 stakingReward,
        uint256 feeReward,
        bytes calldata signature
    ) external {
        _claimReward(periodId, msg.sender, stakingReward, feeReward, signature);
    }

    function claimRewardFor(
        uint256 periodId,
        address recipient,
        uint256 stakingReward,
        uint256 feeReward,
        bytes calldata signature
    ) external {
        _claimReward(periodId, recipient, stakingReward, feeReward, signature);
    }

    function _setRewardSigner(address _rewardSigner) private {
        require(_rewardSigner != address(0), "ShumRewardSystem: zero address");
        require(_rewardSigner != rewardSigner, "ShumRewardSystem: signer not changed");

        address oldSigner = rewardSigner;
        rewardSigner = _rewardSigner;

        emit RewardSignerChanged(oldSigner, rewardSigner);
    }

    function _setRewardLockerAddress(address _rewardLockerAddress) private {
        require(_rewardLockerAddress != address(0), "ShumRewardSystem: zero address");
        require(_rewardLockerAddress != address(rewardLocker), "ShumRewardSystem: address not changed");

        address oldAddress = address(rewardLocker);
        rewardLocker = IShumRewardLocker(_rewardLockerAddress);

        emit RewardLockerAddressChanged(oldAddress, address(rewardLocker));
    }

    function _claimReward(
        uint256 periodId,
        address recipient,
        uint256 stakingReward,
        uint256 feeReward,
        bytes calldata signature
    ) private {
        require(periodId > 0, "ShumRewardSystem: period ID must be positive");
        require(stakingReward > 0 || feeReward > 0, "ShumRewardSystem: nothing to claim");

        // Re-entrance prevention
        userLastClaimPeriodIds[recipient] = periodId;

        // Users can only claim rewards if target ratio is satisfied
        // Verify EIP-712 signature
        bytes32 digest =
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR,
                    keccak256(abi.encode(REWARD_TYPEHASH, periodId, recipient, stakingReward, feeReward))
                )
            );
        address recoveredAddress = digest.recover(signature);
        require(recoveredAddress == rewardSigner, "ShumRewardSystem: invalid signature");

        if (stakingReward > 0) {
            shum.transfer(recipient,stakingReward);
        }

        if (feeReward > 0) {
            lusd.transfer(recipient, feeReward);
        }

        emit RewardClaimed(recipient, periodId, stakingReward, feeReward);
    }

    // Reserved storage space to allow for layout changes in the future.
    uint256[43] private __gap;
}
