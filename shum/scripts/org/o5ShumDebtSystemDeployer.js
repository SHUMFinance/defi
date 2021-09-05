const { ethers } = require("hardhat");

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    console.log("xxl ShumDebtSystem Deployer ...");
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    let admin = accounts[1];
  
    const SafeDecimalMath = await ethers.getContractFactory("SafeDecimalMath");
    const safeDecimalMath = await SafeDecimalMath.deploy();
    
    const ShumDebtSystem = await ethers.getContractFactory(
      "ShumDebtSystem",
      {
      signer: deployer,
      libraries: {
        "contracts/SafeDecimalMath.sol:SafeDecimalMath":
          safeDecimalMath.address,
      },
    });

    let ShumDebtSystemContract = await ShumDebtSystem.deploy();
    await ShumDebtSystemContract.connect(deployer).__ShumDebtSystem_init(
      admin.address // _admin
    );
     
    console.log("✓ ShumDebtSystem contract deployed")
    console.log("ShumDebtSystem deployer : " + deployer.address);
    console.log("ShumDebtSystem contract : " + ShumDebtSystemContract.address + " hash  : " + ShumDebtSystemContract.deployTransaction.hash);

    // ✓ ShumDebtSystem contract deployed
    // ShumDebtSystem deployer : 0x9438b689613eDD00c09F21F5e82103eb9FfA7b56
    // ShumDebtSystem contract : 0x152B52e00AF9d7313dA4976020883A458F934A2F hash  : 0xee552e3ae0eb1c2c32226b2b2844739c76ab7b7720860c0fb6977b9ba0ce2a6f

}

main();
