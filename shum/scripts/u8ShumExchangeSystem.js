//const { ethers } = require("hardhat");
const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const {
  expandTo18Decimals
} = require('./utils/helper')
const { ethers,upgrades } = require("hardhat");

const main = async () => {

    let accounts = await ethers.getSigners();
    admin = deployer = accounts[0];
    alice = accounts[2]
    console.log("admin address is :" + admin.address);

    let args = {
      "gasPrice":0x02540be400,
      "gasLimit":0x7a1200,
    }

    const SafeDecimalMath = await ethers.getContractFactory(
      "SafeDecimalMath",
      deployer
    );
    const safeDecimalMath = await SafeDecimalMath.deploy();

    const ShumExchangeSystem = await ethers.getContractFactory('ShumExchangeSystem', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath.address,
        },
    })

    const shumExchangeSystem = await upgrades.deployProxy(
        ShumExchangeSystem,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumExchangeSystem_init",
            unsafeAllowLinkedLibraries: true,
        }
    );

    console.log("✓ 10 ShumExchangeSystem contract deployed ")
    console.log(shumExchangeSystem.address);
    console.log("");   

  
    let tx = await shumExchangeSystem.connect(alice).exchange(

      ethers.utils.formatBytes32String("sUSD"),   // sourceKey
      expandTo18Decimals(500),                    // sourceAmount
      alice.address,                              // destAddr
      ethers.utils.formatBytes32String("sBTC"),   // destKey
      {gasLimit: args.gasLimit}
  
    );

    
}

main();
