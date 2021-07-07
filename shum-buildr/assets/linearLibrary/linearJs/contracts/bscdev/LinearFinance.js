
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/LinearFinance';
  
      function LinearFinance(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['LinearFinance'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.MAX_SUPPLY = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.MAX_SUPPLY(txParams);
      };
    
      this.__LinearFinance_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LinearFinance_init(_admin, txParams);
      };
    
      this.__LnAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnAdminUpgradeable_init(_admin, txParams);
      };
    
      this.admin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.admin(txParams);
      };
    
      this.allowance = async (owner, spender, txParams) => {
        txParams = txParams || {};
        return await this.contract.allowance(owner, spender, txParams);
      };
    
      this.approve = async (spender, amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.approve(spender, amount, txParams);
      };
    
      this.balanceOf = async (account, txParams) => {
        txParams = txParams || {};
        return await this.contract.balanceOf(account, txParams);
      };
    
      this.becomeAdmin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.becomeAdmin(txParams);
      };
    
      this.burn = async (account, amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.burn(account, amount, txParams);
      };
    
      this.candidate = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.candidate(txParams);
      };
    
      this.decimals = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.decimals(txParams);
      };
    
      this.decreaseAllowance = async (spender, subtractedValue, txParams) => {
        txParams = txParams || {};
        return await this.contract.decreaseAllowance(spender, subtractedValue, txParams);
      };
    
      this.increaseAllowance = async (spender, addedValue, txParams) => {
        txParams = txParams || {};
        return await this.contract.increaseAllowance(spender, addedValue, txParams);
      };
    
      this.mint = async (account, amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.mint(account, amount, txParams);
      };
    
      this.name = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.name(txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.symbol = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.symbol(txParams);
      };
    
      this.totalSupply = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.totalSupply(txParams);
      };
    
      this.transfer = async (recipient, amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.transfer(recipient, amount, txParams);
      };
    
      this.transferFrom = async (sender, recipient, amount, txParams) => {
        txParams = txParams || {};
        return await this.contract.transferFrom(sender, recipient, amount, txParams);
      };
    
      }
  
      export default LinearFinance;
    