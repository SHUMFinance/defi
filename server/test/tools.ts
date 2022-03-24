import { expect } from 'chai';
import { IrisBase } from "../src/services/iris/baseClient";
import * as dotenv from 'dotenv'
import Config from 'bcfg' 

var axios = require('axios')
var Web3 = require('web3')

const converter = require('hex2dec');

import {
    sleep,
    serializeCrossData,
    NFTIDIris2Evm
  } from '../src/utils'

import { Wallet } from 'ethers'
import { JsonRpcProvider} from '@ethersproject/providers'
const { ethers } = require('hardhat')


var crypto = require('crypto');

describe('Options tests', () => { // the tests container

    //let irisParam ={};
    let client : any;
    //let baseURL = "http://localhost:7788/";
    let baseURL = "http://13.213.149.227:7788/";  

    //account 6
    let privKey = "0x6b4f643e8d5f03536aec429a6375f3e40c47cfccd0e6a3dc1e0716c1d3a51fdc";
    let address = "0x5583AE36FbBd066599b7972a0f265BBBba4d1aB5";
    let bscRPC = "";
    let dstUptNFT = "";
    let dstHandle721 = "";

    let bscDeployerPrivKey = "";
    let bscDeployerAddress = "";
    let dscTokenT21 = ""
    
    interface Bcfg {
        load: (options: { env?: boolean; argv?: boolean }) => void
        str: (name: string, defaultValue?: string) => string
        uint: (name: string, defaultValue?: number) => number
        bool: (name: string, defaultValue?: boolean) => boolean
    }
    let irisParam : any;
    before( async function() {
        // runs once before the first test in this block
        dotenv.config()

        const config: Bcfg = new Config('uptick-service',null)
        config.load({
            env: true,
            argv: true,
          })

        irisParam = {
            node :      config.str('irisNode', ""),
            chainID:    config.str('irisChainID', ""),
            gas:        config.str('irisGas', ""),
            amount:     config.str('irisAmount', ""),
            denom:      config.str('irisDenom', ""),
            name:       config.str('irisName', ""),
            password:   config.str('irisPassword', ""),
            mnemonic:   config.str('irisMnemonic', ""),
            admin:      config.str('irisAdmin', "")
        }

        bscRPC  = config.str('bscRPC', "")
        dstUptNFT = config.str('dstUptNft', "")

        bscDeployerPrivKey = config.str('bscPriv', "")
        bscDeployerAddress = "0xebE2F80dFc5Eb9b84693089BC483064dca6F40c6"
        dstHandle721 = config.str('dstHandler721', "")
        dscTokenT21 = config.str('dstToken721', "")

        client = await IrisBase.getClient(

            irisParam.node,
            irisParam.chainID,
            irisParam.gas,
            irisParam.denom,
            irisParam.amount
          
        );

    });


    it('mint 721 token ', async () =>  { 
           

      console.log("....");
    //   await client.nft.queryNFT("uptickc82a14945d6a20a4e27e02a18b2e9186","uptick486d366b90394930bdc3555bd3e51710").then(res => {

    //     console.log("xxl getIrisNFT...111");

    //     console.log(res.nft.owner);

    // })
    // .catch(error => {
    //     console.log("iris nft not find ");
    //     //console.log(error);
    //     return null;
    // });



    

      // let nftID = "2381951505965491661886378760295761"
      // //let nftID = "9007199254740991873839"
      
      // console.log("....");
      // NFTIDIris2Evm("a","b");
      // console.log(nftID);

      // const hexOfHugeNumber = BigInt(nftID).toString(16);
      // console.log(hexOfHugeNumber)
      

      // const hex = converter.decToHex(nftID); // bigger than 9007199254740991
      // console.log(hex);

      // //const dec = converter.hexToDec(hex); // => "90071992547409919007199254740991"
      // let a1 = NFTIDIris2Evm("uptick1407615681946699936011723458");
      // console.log(a1);

      // let a2 = NFTIDIris2Evm("uptick1407615681946699936011723459");
      // console.log(a2);
      // let a1 = BigInt(nftID).toString(16)
      // console.log(a1);

      // let data = ethers.utils.hexZeroPad("0x" + BigInt(nftID).toString(16), 32)
      // console.log(data);


      // let postJson = {
      //   crossID:1,
      //   fromAddress:2,
      //   fromTxHash:3,
      //   toAddress:4,
      //   toTxHash:5
      // }


      // console.log("xxl _postCrossResult ");
      // axios
      // .post("http://localhost:7788/cross/result",postJson)
      // .then( async res => {
      //   console.log(res.data);
      //   if(res.data.result == 0){
      //     //nftModel.updateStatus(bridgeData.crossID,CROSS_STATUS.POST_SERVER_OK);
      //   }
      // })


    //   // the single test
    //   //1.minter from the owner
    //   const bscRpcProvider :JsonRpcProvider = new JsonRpcProvider(bscRPC)
    //   const bscWalllet =  new Wallet(bscDeployerPrivKey,bscRpcProvider); 
  
    //   const Factory__ERC721 = await ethers.getContractFactory('ERC721MinterBurnerPauser')
    //   const ERC721 = await Factory__ERC721.connect(bscWalllet).attach(dscTokenT21);
      
    //   let nftID = Date.now();

    //   //发个任何人
    //   await ERC721.mint(address,nftID,"urlabc")      
    //     .then(res => {
    //       console.log("721 mint OK");
    //       console.log(res.hash);
    //       //console.log(JSON.stringify(res));
    //     })
    //     .catch(error => {
    //       console.log("error ...");
    //       console.log(error);
    //   });
    //   console.log(nftID);
      
    //   //sleep(3000);
    //   //let nftID = 1624711088843;
    //   //console.log(nftID);

    
    }).timeout(20000);


    const  NFTIDIris2Evm = (irisNFDID,denomID) :string =>{


      let orgKey = denomID + irisNFDID ;
      let md5 = crypto.createHash('md5');
      let result = md5.update(orgKey).digest('hex').substr(8,16);

      return result
    }
    

});