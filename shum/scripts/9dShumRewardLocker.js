//const { ethers } = require("hardhat");
const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
const { ethers,upgrades } = require("hardhat");
const { Duration } = require("luxon");

const {
    writeConfig,
    readConfig,
    sleep, 
} = require('./utils/helper')

const main = async () => {

    [deployer] = await ethers.getSigners();
    admin = deployer;
    console.log("admin address is :" + admin.address);


    let ShumFinance = await readConfig("8config","ShumFinance");
    let ShumAccessControl = await readConfig("8config","ShumAccessControl");
    
    const ShumRewardLocker = await ethers.getContractFactory('ShumRewardLocker',deployer)
    const shumRewardLocker = await upgrades.deployProxy(
        ShumRewardLocker,
        [
            ShumFinance,        // _shumTokenAddr
            ShumAccessControl,  // _accessCtrl
            admin.address,      // _admin
        ],
        {
            initializer: "__ShumRewardLocker_init",
        }
    );
    console.log("✓ 09 ShumRewardLocker contract deployed ")
    console.log(shumRewardLocker.address);
    console.log("");    

    await writeConfig("8config","9config","ShumRewardLocker",shumRewardLocker.address);
    await sleep(2000);

}

main();
