var assert = require('assert');
var axios = require('axios')

import {
  serializeVrfData
} from '../src/utils'
var Web3 = require('web3')

//account 6
let privKey = "0x6b4f643e8d5f03536aec429a6375f3e40c47cfccd0e6a3dc1e0716c1d3a51fdc";
let address = "0x5583AE36FbBd066599b7972a0f265BBBba4d1aB5";

describe('callRandomNumber', function() {


    //let baseURL = "http://13.213.149.227:7789/";    
    //let baseURL = "http://localhost:7789/";
    let baseURL = "http://18.140.203.223:7789/";  

    it('callRandomNumber', function() {



      let fullURL = baseURL + "vrf/callRandomNumber"

      //参数
      let jsonRandom = {
        fromRange:200,
        toRange:200
      }
  
      //private -> public -> address
      let serializeData = serializeVrfData(jsonRandom);
      var web3 = new Web3(); 
      var sign = web3.eth.accounts.sign(serializeData, privKey);
      console.log(sign);

      //serializeData  msg
      //privKey 
      jsonRandom["sign"] = sign.signature;
      jsonRandom["signAddress"] = address;


      axios
      .post(fullURL,jsonRandom)
      .then( async res => {

        console.log(res.data);

      })
      
    }).timeout(20000);


  

});


