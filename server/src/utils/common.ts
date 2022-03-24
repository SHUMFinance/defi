import { toHexString } from '@eth-optimism/core-utils'
import {
  CROSS_TYPE,
  CHAIN_IDS
} from './constants'
var crypto = require('crypto');

import { BigNumber, Wallet } from "ethers";
import Big, { RoundingMode } from "big.js";


export const zeroAddress: string = "0x0000000000000000000000000000000000000000";
export const uint256Max: string =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export function expandTo18Decimals(num: number): BigNumber {
  return expandToNDecimals(num, 18);
}

export function expandToNDecimals(num: number, n: number): BigNumber {
  let bigNum = new Big(num);

  while (!bigNum.round(0, RoundingMode.RoundDown).eq(bigNum)) {
    bigNum = bigNum.mul(10);
    if (--n < 0) return BigNumber.from(0);
  }

  return BigNumber.from(bigNum.toString()).mul(BigNumber.from(10).pow(n));
}


/**
 * Basic timeout-based async sleep function.
 * @param ms Number of milliseconds to sleep.
 */
export const sleep = async (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const assert = (condition: () => boolean, reason?: string) => {
  try {
    if (condition() === false) {
      throw new Error(`Assertion failed: ${reason}`)
    }
  } catch (err) {
    throw new Error(`Assertion failed: ${reason}\n${err}`)
  }
}

export const toRpcHexString = (n: number): string => {
  if (n === 0) {
    return '0x0'
  } else {
    return '0x' + toHexString(n).slice(2).replace(/^0+/, '')
  }
}

export const padHexString = (str: string, length: number): string => {
  if (str.length === 2 + length * 2) {
    return str
  } else {
    return '0x' + str.slice(2).padStart(length * 2, '0')
  }
}


export const randomStr = (length: number): string => {
  let random = '';
  let lexicon = 'abcdefghijklmnopqrstuvwxyz'
  for (let i=0; i<length; i++) {
    let randomIndex = Math.floor(Math.random()*1000)%lexicon.length;
    random += lexicon.substr(randomIndex,1);
  }
  return random;

}

// old nftid iris to evm 
// export const  NFTIDIris2Evm = (irisNFDID) :string =>{

//   let lIrisNFDID = irisNFDID.toLowerCase();
//   let nLen = lIrisNFDID.length;
//   let HEXString = "0123456789abcdef";
//   let ret = "";
//   for(var i = 0 ; i < nLen ; i ++){
//       let eachData = lIrisNFDID[i];
//       let isExist = HEXString.includes(eachData);
//       if(isExist){
//           ret += eachData;
//       }else{
//           ret += eachData.charCodeAt(0).toString(16)
//       }
//   }

//   if(ret.length % 2 != 0){
//     ret = ret + "0"
//   }
//   ret = "0x" + ret;

//   return ret;
// }

export const  NFTIDIris2Evm = (irisNFDID,denomID) :string =>{

  let orgKey = denomID + irisNFDID ;
  let md5 = crypto.createHash('md5');
  let result = md5.update(orgKey).digest('hex').substr(8,16);

  return "0x" + result
}

export const NFTIDEvm2Iris = (evmNFDID) :string =>{
 
  return parseInt(evmNFDID).toString(16);
}


 //for not have problem of ios and android
//type 0: iris => bsc 1: bsc=>iris 
export const serializeVrfData = (json :any) :string =>{

  let sData = json.fromRange + json.toRange;
  return sData;

}

export const getCrossType = (fromChainID,toChainID) :number=>{

  if(
    (fromChainID == CHAIN_IDS.IRIS_MAINNET ||  fromChainID == CHAIN_IDS.IRIS_TETNET)
    &&
    (toChainID == CHAIN_IDS.BSC_MAINNET ||  toChainID == CHAIN_IDS.BSC_TETNET)
  ){

    return CROSS_TYPE.IRIS2BSC
  
  }else if(
    (fromChainID == CHAIN_IDS.BSC_MAINNET ||  fromChainID == CHAIN_IDS.BSC_TETNET)
    &&
    (toChainID == CHAIN_IDS.IRIS_MAINNET ||  toChainID == CHAIN_IDS.IRIS_TETNET)
  ){
  
    return CROSS_TYPE.BSC2IRIS

  }else{
  
    return CROSS_TYPE.NO_CROSS

  }
}

export const isNull = (exp) :boolean =>{

  return !exp && typeof(exp) != 'undefined' && exp!=0;
} 



export const getContractTx = async(abi,addresss,funcName,params,eth) : Promise<any> =>{

  const callContract = new eth.Contract(
    abi,
    addresss
  );

  const tx = await callContract.methods[funcName](
    ...params
  );

  return tx;
}



export const getUnsignTx = async(tx,from,to,value,chainID,gasLime,eth) : Promise<any> =>{

  let gasPrice  = 0;
  let data ;
  let nonce ;
  try{

      gasPrice = await eth.getGasPrice();

  }catch(e){
     gasPrice = 1000000000;
    console.log("xxl service getUnsignTx  getGasPrice exception");
  }

  try{

      data = tx.encodeABI();
      nonce = await eth.getTransactionCount(from);
      //TODO
      const unsignedTx = {
        from:from,
        to:to, 
        value:value,
        data:data,
        gasPrice:gasPrice,
        gasLimit:gasLime,
        nonce:nonce, 
        chainId:chainID
    };

    return unsignedTx;

  }catch(e){
    
    console.log("xxl service getUnsignTx exception ...");
    console.log(e);

    return null;
  }



}

export const  stringToHex = (str):string =>{

  let bufStr = Buffer.from(str, 'utf8');
  return bufStr.toString('hex');

}

/**
 * bsc网络
 */
 export const BINANCE_NETWORKS = {
  56: "BSCMAINNET",
  97: "BSCTESTNET",
  //10056: "BSCDEV"
};
export const isBinanceNetwork = walletNetworkId =>
    BINANCE_NETWORKS.hasOwnProperty(walletNetworkId);


export const dec2hex = (str):string => { 
  var dec = str.toString().split(''), sum = [], hex = [], i, s
  while(dec.length){
      s = 1 * dec.shift()
      for(i = 0; s || i < sum.length; i++){
          s += (sum[i] || 0) * 10
          sum[i] = s % 16
          s = (s - sum[i]) / 16
      }
  }
  while(sum.length){
      hex.push(sum.pop().toString(16))
  }
  return hex.join('')
}

export const cSReward = async (
  signer: Wallet,
  periodId: BigNumber,
  recipient: string,
  stakingReward: BigNumber,
  feeReward: BigNumber,
  chainID:number,
  shumRewardSystemAddress:string

): Promise<string> => {

  const domain = {
    name: "Shum",
    //name: "Linear",
    version: "1",
    chainId: chainID,
    verifyingContract: shumRewardSystemAddress,
  };

  const types = {
    Reward: [
      { name: "periodId", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "stakingReward", type: "uint256" },
      { name: "feeReward", type: "uint256" },
    ],
  };

  const value = {
    periodId,
    recipient,
    stakingReward,
    feeReward,
  };

  const signatureHex = await signer._signTypedData(domain, types, value);
  return signatureHex;
};


export const cSWithdraw = async (
  signer: Wallet,
  srcChainId: number,
  destChainId: number,
  depositId: BigNumber,
  depositor: string,
  recipient: string,
  currency: string,
  amount: BigNumber,
  shumErc20BridgeAddress:string

): Promise<string> => {

  const domain = {
    name: "Shum",
    version: "1",
    chainId: destChainId,
    verifyingContract: shumErc20BridgeAddress,
  };

  const types = {
    Deposit: [
      { name: "srcChainId", type: "uint256" },
      { name: "destChainId", type: "uint256" },
      { name: "depositId", type: "uint256" },
      { name: "depositor", type: "bytes32" },
      { name: "recipient", type: "bytes32" },
      { name: "currency", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
  };

  const value = {
    srcChainId,
    destChainId,
    depositId,
    depositor,
    recipient,
    currency,
    amount,
  };

  const signatureHex = await signer._signTypedData(domain, types, value);

  return signatureHex;


};