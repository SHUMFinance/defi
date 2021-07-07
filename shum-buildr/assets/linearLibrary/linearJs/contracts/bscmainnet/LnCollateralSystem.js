
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscmainnet/LnCollateralSystem';
  
      function LnCollateralSystem(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['LnCollateralSystem'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.Collateral = async (_currency, _amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.Collateral(_currency, _amount, txParams);
      };
    
      this.Currency_ETH = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.Currency_ETH(txParams);
      };
    
      this.Currency_LINA = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.Currency_LINA(txParams);
      };
    
      this.GetSystemTotalCollateralInUsd = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.GetSystemTotalCollateralInUsd(txParams);
      };
    
      this.GetUserCollateral = async (_user, _currency, txParams) => {
        txParams = txParams || {};
        return await this.contract.GetUserCollateral(_user, _currency, txParams);
      };
    
      this.GetUserCollaterals = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.GetUserCollaterals(_user, txParams);
      };
    
      this.GetUserTotalCollateralInUsd = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.GetUserTotalCollateralInUsd(_user, txParams);
      };
    
      this.IsSatisfyTargetRatio = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.IsSatisfyTargetRatio(_user, txParams);
      };
    
      this.MaxRedeemable = async (user, _currency, txParams) => {
        txParams = txParams || {};
        return await this.contract.MaxRedeemable(user, _currency, txParams);
      };
    
      this.MaxRedeemableInUsd = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.MaxRedeemableInUsd(_user, txParams);
      };
    
      this.Redeem = async (_currency, _amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.Redeem(_currency, _amount, txParams);
      };
    
      this.RedeemMax = async (_currency, txParams) => {
        txParams = txParams || {};
        return await this.contract.RedeemMax(_currency, txParams);
      };
    
      this.UpdateTokenInfo = async (_currency, _tokenAddr, _minCollateral, _close, txParams) => {
        txParams = txParams || {};
        return await this.contract.UpdateTokenInfo(_currency, _tokenAddr, _minCollateral, _close, txParams);
      };
    
      this.UpdateTokenInfos = async (_symbols, _tokenAddrs, _minCollateral, _closes, txParams) => {
        txParams = txParams || {};
        return await this.contract.UpdateTokenInfos(_symbols, _tokenAddrs, _minCollateral, _closes, txParams);
      };
    
      this.__LnAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__LnCollateralSystem_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnCollateralSystem_init(_admin, txParams);
      };
    
      this.admin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.admin(txParams);
      };
    
      this.becomeAdmin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.becomeAdmin(txParams);
      };
    
      this.buildBurnSystem = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.buildBurnSystem(txParams);
      };
    
      this.burnAndUnstake = async (burnAmount, unstakeCurrency, unstakeAmount, txParams) => {
        txParams = txParams || {};
        return await this.contract.burnAndUnstake(burnAmount, unstakeCurrency, unstakeAmount, txParams);
      };
    
      this.burnAndUnstakeMax = async (burnAmount, unstakeCurrency, txParams) => {
        txParams = txParams || {};
        return await this.contract.burnAndUnstakeMax(burnAmount, unstakeCurrency, txParams);
      };
    
      this.candidate = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.candidate(txParams);
      };
    
      this.debtSystem = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.debtSystem(txParams);
      };
    
      this.getUserLinaCollateralBreakdown = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.getUserLinaCollateralBreakdown(_user, txParams);
      };
    
      this.liquidation = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.liquidation(txParams);
      };
    
      this.mConfig = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.mConfig(txParams);
      };
    
      this.mRewardLocker = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.mRewardLocker(txParams);
      };
    
      this.migrateCollateral = async (_currency, _users, _amounts, txParams) => {
        txParams = txParams || {};
        return await this.contract.migrateCollateral(_currency, _users, _amounts, txParams);
      };
    
      this.moveCollateral = async (fromUser, toUser, currency, amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.moveCollateral(fromUser, toUser, currency, amount, txParams);
      };
    
      this.paused = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.paused(txParams);
      };
    
      this.priceGetter = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.priceGetter(txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.setPaused = async (_paused, txParams) => {
        txParams = txParams || {};
        return await this.contract.setPaused(_paused, txParams);
      };
    
      this.stakeAndBuild = async (stakeCurrency, stakeAmount, buildAmount, txParams) => {
        txParams = txParams || {};
        return await this.contract.stakeAndBuild(stakeCurrency, stakeAmount, buildAmount, txParams);
      };
    
      this.stakeAndBuildMax = async (stakeCurrency, stakeAmount, txParams) => {
        txParams = txParams || {};
        return await this.contract.stakeAndBuildMax(stakeCurrency, stakeAmount, txParams);
      };
    
      this.tokenInfos = async (bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.tokenInfos(bytes32_1, txParams);
      };
    
      this.tokenSymbol = async (uint256_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.tokenSymbol(uint256_1, txParams);
      };
    
      this.uniqueId = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.uniqueId(txParams);
      };
    
      this.updateAddressCache = async (_addressStorage, txParams) => {
        txParams = txParams || {};
        return await this.contract.updateAddressCache(_addressStorage, txParams);
      };
    
      this.userCollateralData = async (address_1, bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.userCollateralData(address_1, bytes32_1, txParams);
      };
    
      }
  
      export default LnCollateralSystem;
    