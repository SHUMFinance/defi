
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/ShumAssetSystem';
  
      function ShumAssetSystem(contractSettings) {
        this.contractSettings = contractSettings || new ContractSettings();
  
        this.contract = new Contract(
          this.contractSettings.addressList['ShumAssetSystem'],
          abi,
          this.contractSettings.signer || this.contractSettings.provider
        );
  
        
      this.__ShumAddressStorage_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__ShumAddressStorage_init(_admin, txParams);
      };
    
      this.__ShumAdminUpgradeable_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__ShumAdminUpgradeable_init(_admin, txParams);
      };
    
      this.__ShumAssetSystem_init = async (_admin, txParams) => {
        txParams = txParams || {};
        return await this.contract.__ShumAssetSystem_init(_admin, txParams);
      };
    
      this.addAsset = async (asset, txParams) => {
        txParams = txParams || {};
        return await this.contract.addAsset(asset, txParams);
      };
    
      this.admin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.admin(txParams);
      };
    
      this.assetNumber = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.assetNumber(txParams);
      };
    
      this.becomeAdmin = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.becomeAdmin(txParams);
      };
    
      this.candidate = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.candidate(txParams);
      };
    
      this.getAddress = async (name, txParams) => {
        txParams = txParams || {};
        return await this.contract.getAddress(name, txParams);
      };
    
      this.getAddressWithRequire = async (name, reason, txParams) => {
        txParams = txParams || {};
        return await this.contract.getAddressWithRequire(name, reason, txParams);
      };
    
      this.getAssetAddresses = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.getAssetAddresses(txParams);
      };
    
      this.mAddress2Names = async (address_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.mAddress2Names(address_1, txParams);
      };
    
      this.mAddrs = async (bytes32_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.mAddrs(bytes32_1, txParams);
      };
    
      this.mAssetList = async (uint256_1, txParams) => {
        txParams = txParams || {};
        return await this.contract.mAssetList(uint256_1, txParams);
      };
    
      this.removeAsset = async (name, txParams) => {
        txParams = txParams || {};
        return await this.contract.removeAsset(name, txParams);
      };
    
      this.setCandidate = async (_candidate, txParams) => {
        txParams = txParams || {};
        return await this.contract.setCandidate(_candidate, txParams);
      };
    
      this.totalAssetsInUsd = async (txParams) => {
        txParams = txParams || {};
        return await this.contract.totalAssetsInUsd(txParams);
      };
    
      this.update = async (name, dest, txParams) => {
        txParams = txParams || {};
        return await this.contract.update(name, dest, txParams);
      };
    
      this.updateAll = async (names, destinations, txParams) => {
        txParams = txParams || {};
        return await this.contract.updateAll(names, destinations, txParams);
      };
    
      }
  
      export default ShumAssetSystem;
    