
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/ShumRewardLocker';
  
      function ShumRewardLocker(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['ShumRewardLocker'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.__LnAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__ShumRewardLocker_init = async (_linaTokenAddr, _accessCtrl, _admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__ShumRewardLocker_init(_linaTokenAddr, _accessCtrl, _admin, txParams);
      };
    
      this.accessCtrl = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.accessCtrl(txParams);
      };
    
      this.addReward = async (user, amount, unlockTime, txParams) => {
        txParams = txParams || {};
        return await this.contract.addReward(user, amount, unlockTime, txParams);
      };
    
      this.admin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.admin(txParams);
      };
    
      this.balanceOf = async (user, txParams) => {
        txParams = txParams || {};
        return await this.contract.balanceOf(user, txParams);
      };
    
      this.becomeAdmin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.becomeAdmin(txParams);
      };
    
      this.candidate = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.candidate(txParams);
      };
    
      this.lastRewardEntryId = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lastRewardEntryId(txParams);
      };
    
      this.linaTokenAddr = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.linaTokenAddr(txParams);
      };
    
      this.lockedAmountByAddresses = async (address_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.lockedAmountByAddresses(address_1, txParams);
      };
    
      this.migrateRewards = async (users, amounts, unlockTimes, txParams) => {
        txParams = txParams || {};
        return await this.contract.migrateRewards(users, amounts, unlockTimes, txParams);
      };
    
      this.moveReward = async (from, recipient, amount, rewardEntryIds, txParams) => {
        txParams = txParams || {};
        return await this.contract.moveReward(from, recipient, amount, rewardEntryIds, txParams);
      };
    
      this.moveRewardProRata = async (from, recipient1, amount1, recipient2, amount2, rewardEntryIds, txParams) => {
        txParams = txParams || {};
        return await this.contract.moveRewardProRata(from, recipient1, amount1, recipient2, amount2, rewardEntryIds, txParams);
      };
    
      this.rewardEntries = async (uint256_1, address_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.rewardEntries(uint256_1, address_1, txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.totalLockedAmount = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.totalLockedAmount(txParams);
      };
    
      }
  
      export default ShumRewardLocker;
    