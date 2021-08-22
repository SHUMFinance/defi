
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/ShumErc20Bridge';
  
      function ShumErc20Bridge(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['ShumErc20Bridge'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.DEPOSIT_TYPEHASH = async (txParams) => {
        console.log("xxl0 come DEPOSIT_TYPEHASH");
        txParams = txParams || {};
        return await this.contract.DEPOSIT_TYPEHASH(txParams);
      };
    
      this.DOMAIN_SEPARATOR = async (txParams) => {

        console.log("xxl0 come DOMAIN_SEPARATOR");
        txParams = txParams || {};
        return await this.contract.DOMAIN_SEPARATOR(txParams);
      };
    
      this.TOKEN_LOCK_TYPE_MINT_BURN = async (txParams) => {

        console.log("xxl0 come TOKEN_LOCK_TYPE_MINT_BURN");
        txParams = txParams || {};
        return await this.contract.TOKEN_LOCK_TYPE_MINT_BURN(txParams);
      };
    
      this.TOKEN_LOCK_TYPE_TRANSFER = async (txParams) => {

        console.log("xxl0 come TOKEN_LOCK_TYPE_TRANSFER");
        txParams = txParams || {};
        return await this.contract.TOKEN_LOCK_TYPE_TRANSFER(txParams);
      };
    
      this.__ShumAdminUpgradeable_init = async (_admin, txParams) => {

        console.log("xxl0 come __ShumAdminUpgradeable_init");
        txParams = txParams || {};
        return await this.contract.__ShumAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__ShumErc20Bridge_init = async (_relayer, _admin, txParams) => {

        console.log("xxl0 come __ShumErc20Bridge_init");
        txParams = txParams || {};
        return await this.contract.__ShumErc20Bridge_init(_relayer, _admin, txParams);
      };
    
      this.addChainSupportForToken = async (tokenKey, chainId, txParams) => {

        console.log("xxl0 come addChainSupportForToken");
        txParams = txParams || {};
        return await this.contract.addChainSupportForToken(tokenKey, chainId, txParams);
      };
    
      this.addToken = async (tokenKey, tokenAddress, lockType, txParams) => {

        console.log("xxl0 come addToken");
        txParams = txParams || {};
        return await this.contract.addToken(tokenKey, tokenAddress, lockType, txParams);
      };
    
      this.admin = async (txParams) => {

        console.log("xxl0 come admin");
        txParams = txParams || {};
        return await this.contract.admin(txParams);
      };
    
      this.becomeAdmin = async (txParams) => {

        console.log("xxl0 come becomeAdmin");
        txParams = txParams || {};
        return await this.contract.becomeAdmin(txParams);
      };
    
      this.candidate = async (txParams) => {

        console.log("xxl0 come candidate");
        txParams = txParams || {};
        return await this.contract.candidate(txParams);
      };
    
      this.currentChainId = async (txParams) => {

        console.log("xxl0 come currentChainId");
        txParams = txParams || {};
        return await this.contract.currentChainId(txParams);
      };
    
      this.deposit = async (token, amount, destChainId, recipient, txParams) => {

        console.log("xxl0 come deposit");
        txParams = txParams || {};
        return await this.contract.deposit(token, amount, destChainId, recipient, txParams);
      };
    
      this.depositCount = async (txParams) => {

        console.log("xxl0 come depositCount");
        txParams = txParams || {};
        return await this.contract.depositCount(txParams);
      };
    
      this.dropChainSupportForToken = async (tokenKey, chainId, txParams) => {

        console.log("xxl0 come dropChainSupportForToken");
        txParams = txParams || {};
        return await this.contract.dropChainSupportForToken(tokenKey, chainId, txParams);
      };
    
      this.getTokenAddress = async (tokenKey, txParams) => {

        console.log("xxl0 come getTokenAddress");
        txParams = txParams || {};
        return await this.contract.getTokenAddress(tokenKey, txParams);
      };
    
      this.getTokenLockType = async (tokenKey, txParams) => {

        console.log("xxl0 come getTokenLockType");
        txParams = txParams || {};
        return await this.contract.getTokenLockType(tokenKey, txParams);
      };
    
      this.isTokenSupportedOnChain = async (tokenKey, chainId, txParams) => {

        console.log("xxl0 come isTokenSupportedOnChain");
        txParams = txParams || {};
        return await this.contract.isTokenSupportedOnChain(tokenKey, chainId, txParams);
      };
    
      this.relayer = async (txParams) => {

        console.log("xxl0 come isTokenSupportedOnChain");
        txParams = txParams || {};
        return await this.contract.relayer(txParams);
      };
    
      this.removeToken = async (tokenKey, txParams) => {

        console.log("xxl0 come removeToken");
        txParams = txParams || {};
        return await this.contract.removeToken(tokenKey, txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {

        console.log("xxl0 come setCandidate");
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.setRelayer = async (_relayer, txParams) => {

        console.log("xxl0 come setRelayer");
        txParams = txParams || {};
        return await this.contract.setRelayer(_relayer, txParams);
      };
    
      this.tokenInfos = async (bytes32_1, txParams) => {

        console.log("xxl0 come tokenInfos");

        txParams = txParams || {};
        return await this.contract.tokenInfos(bytes32_1, txParams);
      };
    
      this.tokenSupportedOnChain = async (bytes32_1, uint256_1, txParams) => {

        console.log("xxl0 come tokenSupportedOnChain");

        txParams = txParams || {};
        return await this.contract.tokenSupportedOnChain(bytes32_1, uint256_1, txParams);
      };
    
      this.withdraw = async (srcChainId, destChainId, depositId, depositor, recipient, currency, amount, signature, txParams) => {

        console.log("xxl0 come withdraw");

        txParams = txParams || {};
        return await this.contract.withdraw(srcChainId, destChainId, depositId, depositor, recipient, currency, amount, signature, txParams);
      };
    
      this.withdrawnDeposits = async (uint256_1, uint256_2, txParams) => {

        console.log("xxl0 come withdrawnDeposits");

        txParams = txParams || {};
        return await this.contract.withdrawnDeposits(uint256_1, uint256_2, txParams);
      };
    
      }
  
      export default ShumErc20Bridge;
    