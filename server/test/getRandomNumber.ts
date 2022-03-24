var assert = require('assert');
var axios = require('axios')

import {
  serializeVrfData
} from '../src/utils'
var Web3 = require('web3')

//account 6
let privKey = "0x6b4f643e8d5f03536aec429a6375f3e40c47cfccd0e6a3dc1e0716c1d3a51fdc";
let address = "0x5583AE36FbBd066599b7972a0f265BBBba4d1aB5";

describe('getRandomResult', function() {


    //let baseURL = "http://13.213.149.227:7789/";    
    //let baseURL = "http://localhost:7789/";
    let baseURL = "http://18.140.203.223:7789/";  

    it('getRandomResult', function() {


      let fullURL = baseURL + "vrf/getRandomResult/0x585ef4d80d25fb332b2dd02cb147afb60dbbb50f0249ee173a47554bcf5433e1"


      axios
      .get(fullURL)
      .then( async res => {

        console.log(res.data);

      })
      
    }).timeout(20000);


  

});


