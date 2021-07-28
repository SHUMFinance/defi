
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/ShumOracleRouter';
  
      function ShumOracleRouter(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['ShumOracleRouter'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.LUSD = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.LUSD(txParams);
      };
    
      this.ORACLE_TYPE_BAND = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.ORACLE_TYPE_BAND(txParams);
      };
    
      this.ORACLE_TYPE_CHAINLINK = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.ORACLE_TYPE_CHAINLINK(txParams);
      };
    
      this.__LnAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__LnAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__ShumOracleRouter_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__ShumOracleRouter_init(_admin, txParams);
      };
    
      this.addBandOracle = async (currencyKey, bandCurrencyKey, oracleAddress, removeExisting, txParams) => {
        txParams = txParams || {};
        return await this.contract.addBandOracle(currencyKey, bandCurrencyKey, oracleAddress, removeExisting, txParams);
      };
    
      this.addBandOracles = async (currencyKeys, bandCurrencyKeys, oracleAddresses, removeExisting, txParams) => {
        txParams = txParams || {};
        return await this.contract.addBandOracles(currencyKeys, bandCurrencyKeys, oracleAddresses, removeExisting, txParams);
      };
    
      this.addChainlinkOracle = async (currencyKey, oracleAddress, removeExisting, txParams) => {
        txParams = txParams || {};
        return await this.contract.addChainlinkOracle(currencyKey, oracleAddress, removeExisting, txParams);
      };
    
      this.addChainlinkOracles = async (currencyKeys, oracleAddresses, removeExisting, txParams) => {
        txParams = txParams || {};
        return await this.contract.addChainlinkOracles(currencyKeys, oracleAddresses, removeExisting, txParams);
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
    
      this.exchange = async (sourceKey, sourceAmount, destKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.exchange(sourceKey, sourceAmount, destKey, txParams);
      };
    
      this.getPrice = async (currencyKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.getPrice(currencyKey, txParams);
      };
    
      this.getPriceAndUpdatedTime = async (currencyKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.getPriceAndUpdatedTime(currencyKey, txParams);
      };
    
      this.getStalePeriodForCurrency = async (currencyKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.getStalePeriodForCurrency(currencyKey, txParams);
      };
    
      this.globalStalePeriod = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.globalStalePeriod(txParams);
      };
    
      this.isPriceStaled = async (currencyKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.isPriceStaled(currencyKey, txParams);
      };
    
      this.linearCurrencyKeysToBandCurrencyKeys = async (bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.linearCurrencyKeysToBandCurrencyKeys(bytes32_1, txParams);
      };
    
      this.oracleSettings = async (bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.oracleSettings(bytes32_1, txParams);
      };
    
      this.removeOracle = async (currencyKey, txParams) => {
        txParams = txParams || {};
        return await this.contract.removeOracle(currencyKey, txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.setGlobalStalePeriod = async (newStalePeriod, txParams) => {
        txParams = txParams || {};
        return await this.contract.setGlobalStalePeriod(newStalePeriod, txParams);
      };
    
      this.setStalePeriodOverride = async (currencyKey, newStalePeriod, txParams) => {
        txParams = txParams || {};
        return await this.contract.setStalePeriodOverride(currencyKey, newStalePeriod, txParams);
      };
    
      this.stalePeriodOverrides = async (bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.stalePeriodOverrides(bytes32_1, txParams);
      };
    
      }
  
      export default ShumOracleRouter;
    