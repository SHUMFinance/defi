const { ethers } = require("hardhat");

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    console.log("xxl ShumCollateralSystem Deployer ...");
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    let admin = accounts[1];

    //
    const Factory__ShumCollateralSystem = await ethers.getContractFactory('ShumCollateralSystem',deployer)
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200
    }
    ShumCollateralSystem = await Factory__ShumCollateralSystem.connect(deployer).deploy(
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    await ShumCollateralSystem.connect(deployer).__ShumCollateralSystem_init(
        admin.address
    );
    
    console.log("✓ ShumCollateralSystem contract deployed")
    console.log("ShumCollateralSystem deployer : " + deployer.address    + " admin : " + admin.address);
    console.log("ShumCollateralSystem contract : " + ShumCollateralSystem.address + " hash  : " + ShumCollateralSystem.deployTransaction.hash);
   
    // ✓ ShumCollateralSystem contract deployed
    // ShumCollateralSystem deployer : 0x9438b689613eDD00c09F21F5e82103eb9FfA7b56 admin : 0x5583AE36FbBd066599b7972a0f265BBBba4d1aB5
    // ShumCollateralSystem contract : 0x8127686b826BaB198D81c631F7d9C260101D7779 hash  : 0xdd98798126a2646d67ab5a7774b813060f29a44b87044c415c930bde4b61623e
}

main();
