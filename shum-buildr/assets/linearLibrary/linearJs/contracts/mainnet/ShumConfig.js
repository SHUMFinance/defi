
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/mainnet/ShumConfig';
  
      function ShumConfig(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['ShumConfig'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.BUILD_RATIO = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.BUILD_RATIO(txParams);
      };
    
      this.admin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.admin(txParams);
      };
    
      this.batchSet = async (names, values, txParams) => {
        txParams = txParams || {};
        return await this.contract.batchSet(names, values, txParams);
      };
    
      this.becomeAdmin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.becomeAdmin(txParams);
      };
    
      this.candidate = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.candidate(txParams);
      };
    
      this.deleteUint = async (key, txParams) => {
        txParams = txParams || {};
        return await this.contract.deleteUint(key, txParams);
      };
    
      this.getUint = async (key, txParams) => {
        txParams = txParams || {};
        return await this.contract.getUint(key, txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.setUint = async (key, value, txParams) => {
        txParams = txParams || {};
        return await this.contract.setUint(key, value, txParams);
      };
    
      }
  
      export default ShumConfig;
    