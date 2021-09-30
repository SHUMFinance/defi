
      import {Contract} from 'ethers';
      import ContractSettings from '../../contractSettings';
      import abi from '../../lib/abis/bscdev/ShumExchangeSystem';
  
      function ShumExchangeSystem(contractSettings) {

          this.contractSettings = contractSettings || new ContractSettings();

          console.log("xxl come to ShumExchangeSystem ..." );
          
          this.contract = new Contract(
            this.contractSettings.addressList['ShumExchangeSystem'],
            abi,
            this.contractSettings.signer || this.contractSettings.provider
          );


          this.__ShumAdminUpgradeable_init = async (_admin, txParams) => {
              txParams = txParams || {};
              return await this.contract.__ShumAdminUpgradeable_init(_admin, txParams);
          };

          this.__ShumExchangeSystem_init = async (_admin, txParams) => {
              txParams = txParams || {};
              return await this.contract.__ShumExchangeSystem_init(_admin, txParams);
          };

          this.exchange = async (sourceKey, sourceAmount, destAddr,destKey,txParams) => {

            console.log("xxl11 come exchange");
            txParams = txParams || {};
            console.log(this.contract);

            return await this.contract.exchange(sourceKey, sourceAmount, destAddr,destKey);

          };


          this.lastPendingExchangeEntryId = async (txParams) => {

            console.log("xxl11 come lastPendingExchangeEntryId");
            txParams = txParams || {};
            return await this.contract.lastPendingExchangeEntryId();

          }

          this.settle = async (lastId,txParams) => {

            console.log("xxl11 come settle");
            txParams = txParams || {};
            return await this.contract.settle(lastId);

          }


          
      }
  
      export default ShumExchangeSystem;
    

