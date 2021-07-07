
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/LnLiquidation';
  
      function LnLiquidation(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['LnLiquidation'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.BUILD_RATIO_KEY = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.BUILD_RATIO_KEY(txParams);
      };
    
      this.LIQUIDATION_DELAY_KEY = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.LIQUIDATION_DELAY_KEY(txParams);
      };
    
      this.LIQUIDATION_LIQUIDATOR_REWARD_KEY = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.LIQUIDATION_LIQUIDATOR_REWARD_KEY(txParams);
      };
    
      this.LIQUIDATION_MARKER_REWARD_KEY = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.LIQUIDATION_MARKER_REWARD_KEY(txParams);
      };
    
      this.LIQUIDATION_RATIO_KEY = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.LIQUIDATION_RATIO_KEY(txParams);
      };
    
      this.__LnAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__LnLiquidation_init = async (_lnBuildBurnSystem, _lnCollateralSystem, _lnConfig, _lnDebtSystem, _lnPrices, _lnRewardLocker, _admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnLiquidation_init(_lnBuildBurnSystem, _lnCollateralSystem, _lnConfig, _lnDebtSystem, _lnPrices, _lnRewardLocker, _admin, txParams);
      };
    
      this.admin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.admin(txParams);
      };
    
      this.becomeAdmin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.becomeAdmin(txParams);
      };
    
      this.candidate = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.candidate(txParams);
      };
    
      this.getUndercollateralizationMarkMarker = async (user, txParams) => {
        txParams = txParams || {};
        return await this.contract.getUndercollateralizationMarkMarker(user, txParams);
      };
    
      this.getUndercollateralizationMarkTimestamp = async (user, txParams) => {
        txParams = txParams || {};
        return await this.contract.getUndercollateralizationMarkTimestamp(user, txParams);
      };
    
      this.isPositionMarkedAsUndercollateralized = async (user, txParams) => {
        txParams = txParams || {};
        return await this.contract.isPositionMarkedAsUndercollateralized(user, txParams);
      };
    
      this.liquidatePosition = async (user, lusdToBurn, rewardEntryIds, txParams) => {
        txParams = txParams || {};
        return await this.contract.liquidatePosition(user, lusdToBurn, rewardEntryIds, txParams);
      };
    
      this.lnBuildBurnSystem = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lnBuildBurnSystem(txParams);
      };
    
      this.lnCollateralSystem = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lnCollateralSystem(txParams);
      };
    
      this.lnConfig = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lnConfig(txParams);
      };
    
      this.lnDebtSystem = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lnDebtSystem(txParams);
      };
    
      this.lnPrices = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lnPrices(txParams);
      };
    
      this.lnRewardLocker = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lnRewardLocker(txParams);
      };
    
      this.markPositionAsUndercollateralized = async (user, txParams) => {
        txParams = txParams || {};
        return await this.contract.markPositionAsUndercollateralized(user, txParams);
      };
    
      this.removeUndercollateralizationMark = async (user, txParams) => {
        txParams = txParams || {};
        return await this.contract.removeUndercollateralizationMark(user, txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.undercollateralizationMarks = async (address_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.undercollateralizationMarks(address_1, txParams);
      };
    
      }
  
      export default LnLiquidation;
    