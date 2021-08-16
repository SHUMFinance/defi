const { ethers } = require("hardhat");

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    mockShumAddress = "0x50D1B9bD0D1643d3d983C25E5a341536a9770350";
    console.log("xxl ShumRewardLocker Deployer ...");
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    let admin = accounts[1];
  
    const ShumAccessControl = await ethers.getContractFactory("ShumAccessControl");
    const ShumRewardLocker = await ethers.getContractFactory("ShumRewardLocker");

    let shumAccessControl = await ShumAccessControl.deploy();
    await shumAccessControl.connect(deployer).__ShumAccessControl_init(
      admin.address // admin
    );

    let shumRewardLocker = await ShumRewardLocker.deploy();
    await shumRewardLocker.connect(deployer).__ShumRewardLocker_init(
      mockShumAddress, // _shumTokenAddr
      shumAccessControl.address, // _accessCtrl
      admin.address // _admin
    );

    console.log("✓ ShumRewardLocker contract deployed")
    console.log("ShumRewardLocker deployer : " + deployer.address    +      " admin : " + admin.address);
    console.log("ShumRewardLocker contract : " + shumRewardLocker.address + " hash  : " + shumRewardLocker.deployTransaction.hash);


    // ✓ ShumRewardLocker contract deployed
    // ShumRewardLocker deployer : 0x9438b689613eDD00c09F21F5e82103eb9FfA7b56 admin : 0x5583AE36FbBd066599b7972a0f265BBBba4d1aB5
    // ShumRewardLocker contract : 0x4cAAD928325C441f9ff19869aBdaa74466BDF0ca hash  : 0x631a9ed12686e35e9dce843c3e98229c5f7df257da49c78c7913537a6bc196be
}

main();
