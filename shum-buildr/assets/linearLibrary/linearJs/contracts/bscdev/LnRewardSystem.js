
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/LnRewardSystem';
  
      function LnRewardSystem(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['LnRewardSystem'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.CLAIM_WINDOW_PERIOD_COUNT = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.CLAIM_WINDOW_PERIOD_COUNT(txParams);
      };
    
      this.DOMAIN_SEPARATOR = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.DOMAIN_SEPARATOR(txParams);
      };
    
      this.PERIOD_LENGTH = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.PERIOD_LENGTH(txParams);
      };
    
      this.REWARD_TYPEHASH = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.REWARD_TYPEHASH(txParams);
      };
    
      this.STAKING_REWARD_LOCK_PERIOD = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.STAKING_REWARD_LOCK_PERIOD(txParams);
      };
    
      this.__LnAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__LnRewardSystem_init = async (_firstPeriodStartTime, _rewardSigner, _lusdAddress, _collateralSystemAddress, _rewardLockerAddress, _admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnRewardSystem_init(_firstPeriodStartTime, _rewardSigner, _lusdAddress, _collateralSystemAddress, _rewardLockerAddress, _admin, txParams);
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
    
      this.claimReward = async (periodId, stakingReward, feeReward, signature, txParams) => {
        txParams = txParams || {};
        return await this.contract.claimReward(periodId, stakingReward, feeReward, signature, txParams);
      };
    
      this.claimRewardFor = async (periodId, recipient, stakingReward, feeReward, signature, txParams) => {
        txParams = txParams || {};
        return await this.contract.claimRewardFor(periodId, recipient, stakingReward, feeReward, signature, txParams);
      };
    
      this.collateralSystem = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.collateralSystem(txParams);
      };
    
      this.firstPeriodStartTime = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.firstPeriodStartTime(txParams);
      };
    
      this.getCurrentPeriodId = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.getCurrentPeriodId(txParams);
      };
    
      this.getPeriodEndTime = async (periodId, txParams) => {
        txParams = txParams || {};
        return await this.contract.getPeriodEndTime(periodId, txParams);
      };
    
      this.getPeriodStartTime = async (periodId, txParams) => {
        txParams = txParams || {};
        return await this.contract.getPeriodStartTime(periodId, txParams);
      };
    
      this.lusd = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lusd(txParams);
      };
    
      this.rewardLocker = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.rewardLocker(txParams);
      };
    
      this.rewardSigner = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.rewardSigner(txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.setRewardSigner = async (_rewardSigner, txParams) => {
        txParams = txParams || {};
        return await this.contract.setRewardSigner(_rewardSigner, txParams);
      };
    
      this.userLastClaimPeriodIds = async (address_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.userLastClaimPeriodIds(address_1, txParams);
      };
    
      }
  
      export default LnRewardSystem;
    