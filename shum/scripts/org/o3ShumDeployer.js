const { ethers } = require("hardhat");

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    console.log("xxl ShumToken Deployer ...");
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    let admin = accounts[1];

    //
    const Factory__MockERC20 = await ethers.getContractFactory('MockERC20',deployer)
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200
    }

    MockERC20 = await Factory__MockERC20.connect(deployer).deploy(
        "Shum Token", // _name
        "Shum", // _symbol
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    
    console.log("✓ ShumToken contract deployed")
    console.log("ShumToken deployer : " + deployer.address );
    console.log("ShumToken contract : " + MockERC20.address + " hash  : " + MockERC20.deployTransaction.hash);
   
    // ✓ ShumToken contract deployed
    // ShumToken deployer : 0x9438b689613eDD00c09F21F5e82103eb9FfA7b56
    // ShumToken contract : 0x50D1B9bD0D1643d3d983C25E5a341536a9770350 hash  : 0xdcd52a556cb8dc13ab454ba7e71cc70a12dae757aa2677aa820443cd686eb00d

}

main();
