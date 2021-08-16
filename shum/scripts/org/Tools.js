
const { Duration } = require("luxon");
const { ethers,upgrades } = require("hardhat");


const { Contract,BigNumber} = require("ethers");
const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/dist/src/signer-with-address");
const { Big } = require("big.js");

const { formatBytes32String }  = require("ethers/lib/utils");

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    [deployer, alice, bob] = await ethers.getSigners();
    admin = deployer;

    console.log("admin address is :" + admin.address);

    const Factory__MockShumPrices = await ethers.getContractFactory(
      'MockShumPrices',{
        admin,
        libraries: {
          "contracts/SafeDecimalMath.sol:SafeDecimalMath":
          "",
        }
      }
    )

    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }
    let shumPrices = await Factory__MockShumPrices.connect(admin).attach(
        "0xc39f85c4b1Ab31944d8f7d89cbE927DDb8535f17"
        //"0x2ba233B9345165E7b374B13bCc4991C4fCD8B351"
    );

      
    // // Set SHUM price to $0.01
    // await shumPrices.connect(admin).setPrice(
    //     ethers.utils.formatBytes32String("SHUM"), // currencyKey
    //     expandTo18Decimals(0.01) // price
    // );


    console.log("OK");
  
}



main();


function expandTo18Decimals(num){

  return expandToNDecimals(num, 18);
}

function expandToNDecimals(num, n){
  let bigNum = new Big(num);

  while (!bigNum.round(0, Big.RoundDown).eq(bigNum)) {
    bigNum = bigNum.mul(10);
    if (--n < 0) return BigNumber.from(0);
  }

  return BigNumber.from(bigNum.toString()).mul(BigNumber.from(10).pow(n));
}


