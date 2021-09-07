//const { ethers } = require("hardhat");
const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
const { ethers,upgrades } = require("hardhat");

const {
    writeConfig,
    readConfig,
    sleep, 
} = require('./utils/helper')

const main = async () => {

    [deployer] = await ethers.getSigners();
    admin = deployer;
    console.log("admin address is :" + admin.address);

    
    const ShumConfig = await ethers.getContractFactory('ShumConfig',deployer)
    /**
     * A contract for storing configuration values
     */
     const shumConfig = await upgrades.deployProxy(
        ShumConfig,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumConfig_init",
        }
    );
    console.log("✓ 04 ShumConfig contract deployed ")
    console.log(shumConfig.address);
    console.log(""); 


    await writeConfig("3config","4config","ShumConfig",shumConfig.address);
    await sleep(2000);

}

main();
