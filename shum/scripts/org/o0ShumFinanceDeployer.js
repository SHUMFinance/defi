const { ethers } = require("hardhat");

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    console.log("xxl ShumFinance Deployer ...");
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    let admin = accounts[1];

    //
    const Factory__ShumFinance = await ethers.getContractFactory('ShumFinance',deployer)
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200
    }
    ShumFinance = await Factory__ShumFinance.connect(deployer).deploy(
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    await ShumFinance.connect(deployer).__ShumFinance_init(
        admin.address
    );
    
    console.log("✓ ShumFinance contract deployed")
    console.log("ShumFinance deployer : " + deployer.address    + " admin : " + admin.address);
    console.log("ShumFinance contract : " + ShumFinance.address + " hash  : " + ShumFinance.deployTransaction.hash);
   
    // ✓ ShumFinance contract deployed
    // ShumFinance deployer : 0x9438b689613eDD00c09F21F5e82103eb9FfA7b56 admin : 0x5583AE36FbBd066599b7972a0f265BBBba4d1aB5
    // ShumFinance contract : 0x2ba233B9345165E7b374B13bCc4991C4fCD8B351 hash  : 0x98618b269b62c94e7c6c72ef04b0f82ca6438d4c92120bab8885ccfa105bac5b
}

main();
