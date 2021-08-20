
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/mainnet/ShumChainLinkPrices';
  
      function ShumChainLinkPrices(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['ShumChainLinkPrices'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.LINA = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.LINA(txParams);
      };
    
      this.sUSD = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.sUSD(txParams);
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
    
      this.deletePrice = async (currencyName, txParams) => {
        txParams = txParams || {};
        return await this.contract.deletePrice(currencyName, txParams);
      };
    
      this.exchange = async (sourceName, sourceAmount, destName, txParams) => {
        txParams = txParams || {};
        return await this.contract.exchange(sourceName, sourceAmount, destName, txParams);
      };
    
      this.exchangeAndPrices = async (sourceName, sourceAmount, destName, txParams) => {
        txParams = txParams || {};
        return await this.contract.exchangeAndPrices(sourceName, sourceAmount, destName, txParams);
      };
    
      this.getCurrentRoundId = async (currencyName, txParams) => {
        txParams = txParams || {};
        return await this.contract.getCurrentRoundId(currencyName, txParams);
      };
    
      this.getPrice = async (currencyName, txParams) => {
        txParams = txParams || {};
        return await this.contract.getPrice(currencyName, txParams);
      };
    
      this.getPriceAndUpdatedTime = async (currencyName, txParams) => {
        txParams = txParams || {};
        return await this.contract.getPriceAndUpdatedTime(currencyName, txParams);
      };
    
      this.isStale = async (currencyName, txParams) => {
        txParams = txParams || {};
        return await this.contract.isStale(currencyName, txParams);
      };
    
      this.mOracleArray = async (uint256_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.mOracleArray(uint256_1, txParams);
      };
    
      this.mOracles = async (bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.mOracles(bytes32_1, txParams);
      };
    
      this.mPricesLastRound = async (bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.mPricesLastRound(bytes32_1, txParams);
      };
    
      this.oracle = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.oracle(txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.setOracle = async (_oracle, txParams) => {
        txParams = txParams || {};
        return await this.contract.setOracle(_oracle, txParams);
      };
    
      this.setStalePeriod = async (_time, txParams) => {
        txParams = txParams || {};
        return await this.contract.setStalePeriod(_time, txParams);
      };
    
      this.stalePeriod = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.stalePeriod(txParams);
      };
    
      this.updateAll = async (currencyNames, newPrices, timeSent, txParams) => {
        txParams = txParams || {};
        return await this.contract.updateAll(currencyNames, newPrices, timeSent, txParams);
      };
    
      this.addOracle = async (currencyKey, OracleAddress, txParams) => {
        txParams = txParams || {};
        return await this.contract.addOracle(currencyKey, OracleAddress, txParams);
      };
    
      this.removeOracle = async (currencyKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.removeOracle(currencyKey, txParams);
      };
    
      }
  
      export default ShumChainLinkPrices;
    