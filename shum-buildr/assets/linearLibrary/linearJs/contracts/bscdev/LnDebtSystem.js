
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/LnDebtSystem';
  
      function LnDebtSystem(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['LnDebtSystem'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.GetUserCurrentDebtProportion = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.GetUserCurrentDebtProportion(_user, txParams);
      };
    
      this.GetUserDebtBalanceInUsd = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.GetUserDebtBalanceInUsd(_user, txParams);
      };
    
      this.GetUserDebtData = async (_user, txParams) => {
        txParams = txParams || {};
        return await this.contract.GetUserDebtData(_user, txParams);
      };
    
      this.LastSystemDebtFactor = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.LastSystemDebtFactor(txParams);
      };
    
      this.MAX_DEL_PER_TIME = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.MAX_DEL_PER_TIME(txParams);
      };
    
      this.PushDebtFactor = async (_factor, txParams) => {
        txParams = txParams || {};
        return await this.contract.PushDebtFactor(_factor, txParams);
      };
    
      this.SetLastCloseFeePeriodAt = async (index, txParams) => {
        txParams = txParams || {};
        return await this.contract.SetLastCloseFeePeriodAt(index, txParams);
      };
    
      this.UpdateDebt = async (_user, _debtProportion, _factor, txParams) => {
        txParams = txParams || {};
        return await this.contract.UpdateDebt(_user, _debtProportion, _factor, txParams);
      };
    
      this.UpdateUserDebt = async (_user, _debtProportion, txParams) => {
        txParams = txParams || {};
        return await this.contract.UpdateUserDebt(_user, _debtProportion, txParams);
      };
    
      this.__LnAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__LnDebtSystem_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnDebtSystem_init(_admin, txParams);
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
    
      this.debtCurrentIndex = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.debtCurrentIndex(txParams);
      };
    
      this.importDebtData = async (users, debtProportions, debtFactors, timestamps, txParams) => {
        txParams = txParams || {};
        return await this.contract.importDebtData(users, debtProportions, debtFactors, timestamps, txParams);
      };
    
      this.lastCloseAt = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lastCloseAt(txParams);
      };
    
      this.lastDebtFactors = async (uint256_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.lastDebtFactors(uint256_1, txParams);
      };
    
      this.lastDeletTo = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.lastDeletTo(txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.updateAddressCache = async (_addressStorage, txParams) => {
        txParams = txParams || {};
        return await this.contract.updateAddressCache(_addressStorage, txParams);
      };
    
      this.userDebtState = async (address_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.userDebtState(address_1, txParams);
      };
    
      }
  
      export default LnDebtSystem;
    