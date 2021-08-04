
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/mainnet/ShumRewardLocker';
  
      function ShumRewardLocker(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['ShumRewardLocker'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.Claim = async (_amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.Claim(_amount, txParams);
      };
    
      this.ClaimMaxable = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.ClaimMaxable(txParams);
      };
    
      this.Init = async (_feeSysAddr, txParams) => {
        txParams = txParams || {};
        return await this.contract.Init(_feeSysAddr, txParams);
      };
    
      this.Slimming = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.Slimming(_user, txParams);
      };
    
      this.__ShumAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__ShumAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__ShumRewardLocker_init = async (_admin, linaAddress, txParams) => {
        txParams = txParams || {};
        return await this.contract.__ShumRewardLocker_init(_admin, linaAddress, txParams);
      };
    
      this.admin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.admin(txParams);
      };
    
      this.appendReward = async (_user, _amount, _lockTo, txParams) => {
        txParams = txParams || {};
        return await this.contract.appendReward(_user, _amount, _lockTo, txParams);
      };
    
      this.balanceOf = async (address_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.balanceOf(address_1, txParams);
      };
    
      this.becomeAdmin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.becomeAdmin(txParams);
      };
    
      this.candidate = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.candidate(txParams);
      };
    
      this.linaToken = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.linaToken(txParams);
      };
    
      this.maxRewardArrayLen = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.maxRewardArrayLen(txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.setLinaAddress = async (_token, txParams) => {
        txParams = txParams || {};
        return await this.contract.setLinaAddress(_token, txParams);
      };
    
      this.totalNeedToReward = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.totalNeedToReward(txParams);
      };
    
      this.userRewards = async (address_1, uint256_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.userRewards(address_1, uint256_1, txParams);
      };
    
      }
  
      export default ShumRewardLocker;
    