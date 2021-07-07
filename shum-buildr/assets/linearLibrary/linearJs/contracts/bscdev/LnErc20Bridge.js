
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/LnErc20Bridge';
  
      function LnErc20Bridge(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['LnErc20Bridge'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.DEPOSIT_TYPEHASH = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.DEPOSIT_TYPEHASH(txParams);
      };
    
      this.DOMAIN_SEPARATOR = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.DOMAIN_SEPARATOR(txParams);
      };
    
      this.TOKEN_LOCK_TYPE_MINT_BURN = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.TOKEN_LOCK_TYPE_MINT_BURN(txParams);
      };
    
      this.TOKEN_LOCK_TYPE_TRANSFER = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.TOKEN_LOCK_TYPE_TRANSFER(txParams);
      };
    
      this.__LnAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__LnErc20Bridge_init = async (_relayer, _admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnErc20Bridge_init(_relayer, _admin, txParams);
      };
    
      this.addChainSupportForToken = async (tokenKey, chainId, txParams) => {
        txParams = txParams || {};
        return await this.contract.addChainSupportForToken(tokenKey, chainId, txParams);
      };
    
      this.addToken = async (tokenKey, tokenAddress, lockType, txParams) => {
        txParams = txParams || {};
        return await this.contract.addToken(tokenKey, tokenAddress, lockType, txParams);
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
    
      this.currentChainId = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.currentChainId(txParams);
      };
    
      this.deposit = async (token, amount, destChainId, recipient, txParams) => {
        txParams = txParams || {};
        return await this.contract.deposit(token, amount, destChainId, recipient, txParams);
      };
    
      this.depositCount = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.depositCount(txParams);
      };
    
      this.dropChainSupportForToken = async (tokenKey, chainId, txParams) => {
        txParams = txParams || {};
        return await this.contract.dropChainSupportForToken(tokenKey, chainId, txParams);
      };
    
      this.getTokenAddress = async (tokenKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.getTokenAddress(tokenKey, txParams);
      };
    
      this.getTokenLockType = async (tokenKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.getTokenLockType(tokenKey, txParams);
      };
    
      this.isTokenSupportedOnChain = async (tokenKey, chainId, txParams) => {
        txParams = txParams || {};
        return await this.contract.isTokenSupportedOnChain(tokenKey, chainId, txParams);
      };
    
      this.relayer = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.relayer(txParams);
      };
    
      this.removeToken = async (tokenKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.removeToken(tokenKey, txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.setRelayer = async (_relayer, txParams) => {
        txParams = txParams || {};
        return await this.contract.setRelayer(_relayer, txParams);
      };
    
      this.tokenInfos = async (bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.tokenInfos(bytes32_1, txParams);
      };
    
      this.tokenSupportedOnChain = async (bytes32_1, uint256_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.tokenSupportedOnChain(bytes32_1, uint256_1, txParams);
      };
    
      this.withdraw = async (srcChainId, destChainId, depositId, depositor, recipient, currency, amount, signature, txParams) => {
        txParams = txParams || {};
        return await this.contract.withdraw(srcChainId, destChainId, depositId, depositor, recipient, currency, amount, signature, txParams);
      };
    
      this.withdrawnDeposits = async (uint256_1, uint256_2, txParams) => {
        txParams = txParams || {};
        return await this.contract.withdrawnDeposits(uint256_1, uint256_2, txParams);
      };
    
      }
  
      export default LnErc20Bridge;
    