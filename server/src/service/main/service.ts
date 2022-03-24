/* Imports: External */
import { BaseService } from '@eth-optimism/service-base';
import express, { json, Request, Response } from 'express'
import cors from 'cors'
import { handler } from '../evm/handler';
import { BigNumber,Wallet,utils } from 'ethers'
import { JsonRpcProvider, UrlJsonRpcProvider } from '@ethersproject/providers'
import { UserModel } from '../../model/userModel';
import { BridgeModel } from '../../model/bridgeModel';
import { ExchangeModel } from '../../model/exchangeModel';
import { TransactionModel } from '../../model/transactionModel';
import MySQL from '../../db/mysql';
var axios = require('axios')

import {
  formatBytes32String,
  hexlify,
  zeroPad,
} from "ethers/lib/utils";

let Web3 = require('web3');

import {
  errResphonse,
  okResphonse,
  ERR_MSG,
  serializeVrfData,
  cSReward,
  cSWithdraw,
  expandTo18Decimals,
  isBinanceNetwork
} from '../../utils'

import { RewardsModel } from '../../model/rewardsModel';

interface DBConf{
  host:     string
  user:     string
  password: string
  name:     string
  port:     number
}

interface ContractInfo{

  pRadio:             number

  ethCollateralSystem:   string
  ethRewardSystem:       string
  ethDebtSystem:         string
  ethSafeDecimalMath:    string

  bscCollateralSystem:   string
  bscRewardSystem:       string
  bscDebtSystem:         string
  bscSafeDecimalMath:    string

  adminPriv:          string
  bscChainId:         number
  ethChainId:         number

  bscSafeAddress:     string
  bscBridgeAddress:   string
  bscExchangeAddress:   string

  ethSafeAddress:     string
  ethBridgeAddress:   string
  ethExchangeAddress:   string

}

export interface DataTransportServiceOptions {

    //DB
    dbConf:           DBConf

    //host
    serverHost:        string
    serverPort:        number
    bscRPC:            string
    bscPriv:           string
    
    ethRPC:            string
    ethPriv:           string

    callFrequency:     number
    contractInfo:      ContractInfo

}

export class DataTransportService extends BaseService<DataTransportServiceOptions> {
    
    protected name = 'Data Transport Service'
    protected cross_id_random_length = 3
    public repeatNum = 0;
    public lastRandom = "0";
    private baseURL = "https://api.binance.com/"
  
    private state: {
        bscWeb3:any,
        ethWeb3:any,
        db:any,
        dbConf:DBConf,
        app: express.Express,
        server: any,
        bscWalllet: Wallet,
        ethWalllet:Wallet,
        adminBscWalllet: Wallet,
        adminEthWalllet: Wallet,
        contractInfo:ContractInfo
    } = {} as any
  
    protected async _init(): Promise<void> {

      //init db
      this.state.dbConf = this.options.dbConf
      MySQL.createPool(
        this.state.dbConf.host,
        this.state.dbConf.user,
        this.state.dbConf.password,
        this.state.dbConf.name,
        this.state.dbConf.port
      );
      await MySQL.getConnection();
      this.state.db = MySQL;

      //init contractInfo
      this.state.contractInfo = this.options.contractInfo;
            
      //bscWalllet
      const bscRpcProvider :JsonRpcProvider =
        typeof this.options.bscRPC === 'string'
          ? new JsonRpcProvider(this.options.bscRPC)
          : this.options.bscRPC

      this.state.bscWalllet =  new Wallet(this.options.bscPriv,bscRpcProvider);
      
      this.state.adminBscWalllet =  new Wallet(this.options.contractInfo.adminPriv,bscRpcProvider);
      this.state.bscWeb3 = new Web3(new Web3.providers.HttpProvider(this.options.bscRPC));


      //ethWallet
      const ethRpcProvider :JsonRpcProvider =
      typeof this.options.ethRPC === 'string'
         ? new JsonRpcProvider(this.options.ethRPC)
         : this.options.ethRPC

      this.state.ethWalllet =  new Wallet(this.options.contractInfo.adminPriv,ethRpcProvider);
      
      this.state.adminEthWalllet =  new Wallet(this.options.contractInfo.adminPriv,ethRpcProvider);
      this.state.ethWeb3 = new Web3(new Web3.providers.HttpProvider(this.options.ethRPC));

      //initialize App
      this._initializeApp()
      
      
      // xxl TODO need to reset
      // add fee call timer
      let callFrequency = this.options.callFrequency * 1000
      setInterval(async function(){ 
        console.log("xxl 111 ....");
        await this.setRewards(
          this.state.bscWalllet,
          this.state.contractInfo.bscChainId,
          this.state.contractInfo.bscCollateralSystem,
          this.state.contractInfo.bscRewardSystem,
          this.state.contractInfo.bscDebtSystem
        );

        await this.setRewards(
          this.state.ethWalllet,
          this.state.contractInfo.ethChainId,
          this.state.contractInfo.ethCollateralSystem,
          this.state.contractInfo.ethRewardSystem,
          this.state.contractInfo.ethDebtSystem
        );

      }.bind(this), callFrequency);//run this thang every 2 seconds

    }

    //
    private async setRewards(
      wallet:any,
      chainID:number,
      collateralSystem:string,
      rewardSystem:string,
      debtSystem:string
      ) {

      console.log("*** xxl come setRewards ....");

      //1.0 get address list
      let userModel = new UserModel(this.state.db); 
      let rewardModel = new RewardsModel(this.state.db); 
      let addressList =  await userModel.getUserAddressList(chainID); 
      //2.0 get calc current  
      console.log("xxl addresslist : " );
      console.log(addressList);
      
      let len = addressList.length;

      console.log("xxl len : " + len);

      for(var i = 0 ;i < len ;i ++){
        //2.1 get each stakingReward and feeReward
        let re = await handler.getRewardFromAddress(
          this.state.contractInfo.pRadio,
          collateralSystem,
          rewardSystem,
          debtSystem,
          wallet,
          addressList[i]
        );

        //2.2 save to the reward db
        await rewardModel.setRewards(
          chainID,
          addressList[i],
          re[0].toString(),
          re[1].toString()
        );
       
      }

    }

  
    protected async _start(): Promise<void> {
      console.log("dts come to _start");

      this.state.server = this.state.app.listen(
        this.options.serverPort,
        this.options.serverHost
      )

      this.logger.info('Server started and listening', {
        port: this.options.serverPort,
        host: this.options.serverHost
      })

    }
    
    protected async _stop(): Promise<void> {

      console.log("dts come to _stop");
      //data backup

    }

    /**
     * Initializes the server application.
     * Do any sort of initialization here that you want. Mostly just important that
     * `_registerAllRoutes` is called at the end.
     */
     private _initializeApp() {
      // TODO: Maybe pass this in as a parameter instead of creating it here?
      this.state.app = express()
      this.state.app.use(cors())
      this.state.app.use(json())
      this._registerAllRoutes()
    }


  /**
   * Registers a route on the server.
   * @param method Http method type.
   * @param route Route to register.
   * @param handler Handler called and is expected to return a JSON response.
   */
     private _registerRoute(
      method: string, // Just handle GET for now, but could extend this with whatever.
      route: string,
      handler: (req?: Request, res?: Response) => Promise<any>
    ): void {
     
      this.state.app[method](route, async (req, res) => {
        const start = Date.now()
        try {

          const json = await handler(req, res)
          const elapsed = Date.now() - start

          this.logger.info('Served HTTP Request', {
            method: req.method,
            url: req.url,
            elapsed,
          })

          return res.json(json)
        } catch (e) {
          const elapsed = Date.now() - start
          this.logger.info('Failed HTTP Request', {
            method: req.method,
            url: req.url,
            elapsed,
            msg: e.toString(),
          })
          return res.status(400).json({
            error: e.toString(),
          })
        }
      })
    }

  /** 
   * Registers all of the server routes we want to expose.
   * TODO: Link to our API spec.
   */
  private _registerAllRoutes(): void {
    // TODO: Maybe add doc-like comments to each of these routes?
    this._registerRoute(
        'get',
        '/user/:chainID/:address',
        async (req): Promise<any> => {
        
        //xxl user register  
        console.log("xxl user register !");
        console.log(req.params);  

        let address = req.params.address;
        let chainID = req.params.chainID;

        let userModel = new UserModel(this.state.db); 
        await userModel.writeUserAddress(address,chainID); 
        let resp = {}

        return okResphonse(resp);

    }),

    this._registerRoute(
      'get',
      '/rewards/:chainId/:address',
      async (req): Promise<any> => {

        //console.log("/rewards/:address ");
        //console.log(req.body);  
        //1.get params
        const params = req.params
        console.log("xxl /rewards/:address ");
        console.log(params);

        let chainId = params.chainId;
        let address = params.address;

        //xxl 2
        let rewardModel = new RewardsModel(this.state.db); 
        let transactionModel = new TransactionModel(this.state.db); 

        console.log([chainId,address]);

        let dbRet =  await rewardModel.getRewards(chainId,address);
        let dbTrans = await transactionModel.getTransactionRecord(dbRet.address);
        console.log("xxl rewards :");          
        console.log(dbRet);
        console.log(dbTrans);

        let endTime  = Date.now()/1000;
        let spanTime = Math.floor((endTime - Number(dbRet.lastStart))/24/3600);
        console.log("1111 : " + spanTime);
        console.log(dbRet.total);

        let tranVal = 0;
        dbTrans.forEach(dr => {
          if(dr.txType==0) {
            // build 要累加
            let sp = dr.txValue.split(/SHUM|->|USDT/);
            let tt = Date.now()-Date.parse(dr.createdAt);
            let days = Math.floor(tt/1000/24/3600);            
            let val = sp[0] * days /365 * 0.2;
            tranVal = tranVal + val;
          } else if(dr.txType==1) {
            // burn 要累减
            let sp = dr.txValue.split(/USDT|->|SHUM/);
            let tt = Date.now()-Date.parse(dr.createdAt);
            let days = Math.floor(tt/1000/24/3600);
            let val = sp[2] * days / 365 * 0.2;
            tranVal = tranVal - val;
          }else if(dr.txType==3) {
            // claim 要累减
            let sp = dr.txValue.split("SHUM");
            tranVal = tranVal - sp[0];
          }
        });

        console.log("xxl tranVal is " + tranVal);
        tranVal = Math.floor(tranVal * 10000)/10000 ;
        //tranVal = tranVal * 1000000000000000000;
        tranVal = this.state.ethWeb3.utils.toWei(tranVal.toString(),'ether');
        console.log("1========", tranVal);

        // // let reward =  Math.floor(Number(ethTotal.toString()) / 365 / 5 * spanTime * 100) / 100
        // console.log(ethTotal.toString());
        const isBinance = isBinanceNetwork(params.sourceNetworkId);
        if(!isBinance){

          //ETH sign
          let periodId = 1;

          console.log("xxl signature start ...  ");
          console.log([
            this.state.adminEthWalllet,
            BigNumber.from(periodId),
            address,
            BigNumber.from(tranVal + ""),
            BigNumber.from(0),
            parseInt(chainId,10),
            this.state.contractInfo.ethRewardSystem
          ]);

          let signature = await cSReward(
              this.state.adminEthWalllet,
              BigNumber.from(periodId),
              address,
              BigNumber.from(tranVal + ""),
              BigNumber.from(0),
              parseInt(chainId,10),
              this.state.contractInfo.ethRewardSystem
          );
          
          console.log(signature);
          console.log("xxl signature end  ");
  
          let allRewardEntries = [{
              "periodId":periodId,
              "stakingReward":tranVal.toString(),
              "feeReward":0,
              "signatures": [
                {
                  "signer": address,
                  "signature": signature
                }
              ]
          }]

          return okResphonse(allRewardEntries);

        }

    })

    //
    this._registerRoute(
      'get',
      '/deposit/:txid/:currency/:value/:sourceNetworkId/:sourceWalletAddress/:targetNetworkId/:targetWalletAddress',
      async (req): Promise<any> => {

        //1.get params
        const params = req.params;
        console.log(params);

        const isBinance = isBinanceNetwork(params.sourceNetworkId);
        let depoistCount = 0;
        let signature = "";
        if(isBinance ){

          depoistCount  = await handler.getDepoistCount(
              this.state.adminBscWalllet,
              this.state.contractInfo.bscBridgeAddress
          );

          //ETH sign
          signature = await cSWithdraw(
            this.state.adminEthWalllet,
            this.state.contractInfo.bscChainId,
            this.state.contractInfo.ethChainId,
            BigNumber.from(depoistCount + 1),                       // depositId
            hexlify(zeroPad(params.sourceWalletAddress, 32)),       // depositor
            hexlify(zeroPad(params.targetWalletAddress, 32)),       // recipient
            formatBytes32String(params.currency),                   // currency
            BigNumber.from(params.value),                           // amount
            this.state.contractInfo.ethBridgeAddress
          );

        }else{

          depoistCount  = await handler.getDepoistCount(
              this.state.adminEthWalllet,
              this.state.contractInfo.ethBridgeAddress
          );

          //BSC sign
          signature = await cSWithdraw(
            this.state.adminBscWalllet,
            this.state.contractInfo.ethChainId,
            this.state.contractInfo.bscChainId,
            BigNumber.from(depoistCount + 1),                       // depositId
            hexlify(zeroPad(params.sourceWalletAddress, 32)),       // depositor
            hexlify(zeroPad(params.targetWalletAddress, 32)),       // recipient
            formatBytes32String(params.currency),                   // currency
            BigNumber.from(params.value),                           // amount
            this.state.contractInfo.bscBridgeAddress
          );
          
        }

        let bridgeModel = new BridgeModel(this.state.db); 

        console.log(depoistCount + 1);
        console.log(signature);

        await bridgeModel.writeDeposit( params, depoistCount + 1,signature); 
        let resp = {}

        return okResphonse(resp);


    })

    this._registerRoute(
      'post',
      '/depositRec',
      async (req): Promise<any> => {

        const params = req.body.data
        console.log("xxl depositRec ");
        console.log(params);

        let bridgeModel = new BridgeModel(this.state.db); 
        let record = await bridgeModel.getDepositRec(
                        params.sourceWalletAddress,
                        params.targetWalletAddress,
                        params.sourceNetworkId,
                        params.currency,
                        params.status
                    );
        let resp = {record}
        return okResphonse(resp);

    })

    this._registerRoute(
      'post',
      '/crossSet',
      async (req): Promise<any> => {

        const params = req.body.data
        console.log("xxl crossSet ");
        console.log(params);

        let bridgeModel = new BridgeModel(this.state.db); 
        await bridgeModel.setCrossResult(
                params.txid,
                params.targetTxid
              );

        let resp = {}
        return okResphonse(resp);

    })



    this._registerRoute(
      'post',
      '/setExchangeApprove',
      async (req): Promise<any> => {

        const params = req.body.data
        console.log("xxl setExchangeApprove ");
        console.log(params);

        let exchangeModel = new ExchangeModel(this.state.db); 
        await exchangeModel.setExchangeApprove(
                        params.txid,
                        params.address
                    );


        let resp = {}
        return okResphonse(resp);

    })


    this._registerRoute(
      'get',
      '/isExchangeApprove/:address',
      async (req): Promise<any> => {

        const params = req.params;
        console.log("xxl getExchangeApprove ");
        console.log(params);

        let exchangeModel = new ExchangeModel(this.state.db); 
        let bRet = await exchangeModel.isApproveExist(
                        params.address);

        return okResphonse(bRet);

    })

    this._registerRoute(
      'post',
      '/setExchangeRecord',
      async (req): Promise<any> => {

        const params = req.body.data
        console.log("xxl setExchangeRecord ");
        console.log(params);

        let exchangeModel = new ExchangeModel(this.state.db); 
        await exchangeModel.setExchangeRecord(
              params.chainID,
              params.txid,
              params.sourceKey,
              params.sourceAmount,
              params.destAddr,
              params.destKey
        )

        const isBinance = isBinanceNetwork(parseInt(params.chainID));
        if(isBinance){
          console.log("xxl come to bsc ...");
          await handler.settle(
            this.state.bscWalllet,
            this.state.contractInfo.bscExchangeAddress,
            this.state.contractInfo.bscSafeAddress
          );
        }else{
          await handler.settle(
            this.state.adminEthWalllet,
            this.state.contractInfo.ethExchangeAddress,
            this.state.contractInfo.ethSafeAddress
          );
        }

        let resp = {}
        return okResphonse(resp);

    })

    this._registerRoute(
      'post',
      '/setTransactionRecord',
      async (req): Promise<any> => {

        const params = req.body.data
        console.log("xxl setTransactionRecord ");
        console.log(params);

        let transactionModel = new TransactionModel(this.state.db); 
        await transactionModel.setTransactionRecord(
              params.txid,
              params.from,
              params.to,
              params.value,
              params.chainType,
              params.chain
        )

        let resp = {}
        return okResphonse(resp);

    })

    this._registerRoute(
      'get',
      '/getTransaction/:address',
      async (req): Promise<any> => {

        const params = req.params;
        console.log("xxl getTransaction ");
        console.log(params);

        let transactionModel = new TransactionModel(this.state.db); 
        let bRet = await transactionModel.getTransactionRecord(
                        params.address);

        return okResphonse(bRet);

    })


    this._registerRoute(
      'get',
      '/getExchangeRecord/:address',
      async (req): Promise<any> => {

        const params = req.params;
        console.log("xxl getExchangeApprove ");
        console.log(params);

        let exchangeModel = new ExchangeModel(this.state.db); 
        let ret = await exchangeModel.getExchangeRecord(
              params.address
        )
        let resp = {ret}
        return okResphonse(resp);

    })


    //api
    this._registerRoute(
      'get',
      '/24hr/:symbol',
      async (req): Promise<any> => {

        const params = req.params;
        console.log(params);

        let callUrl = this.baseURL + "api/v3/ticker/24hr?symbol=";

        console.log("xxl call url ...");
        console.log(callUrl + params.symbol + "USDT");
        let ret = await axios.get(callUrl + params.symbol + "USDT");

        console.log(ret.data);
        
        return okResphonse(ret.data);

    })

    this._registerRoute(
      'get',
      '/api/v3/klines',
      async (req): Promise<any> => {

        const params = req.query;
        console.log(params);

        let callUrl = this.baseURL + "api/v3/klines?"
                      + "symbol=" + params.symbol  + "&"
                      + "interval=" + params.interval  + "&"
                      + "startTime=" + params.startTime  + "&"
                      + "endTime=" + params.endTime 

        console.log("xxl call url ...");
        console.log(callUrl);
        
        //console.log(callUrl + params.symbol + "USDT");
        let ret = await axios.get(callUrl)
        // .then(res => {
        //   return Promise.resolve(res);
        // })
        console.log(ret.data);

        return okResphonse(ret.data);
       
    })


  }


}
  