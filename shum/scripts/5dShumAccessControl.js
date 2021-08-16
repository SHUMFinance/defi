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

    
    const ShumAccessControl = await ethers.getContractFactory('ShumAccessControl',deployer)
    /**
     * A contract for role-based access control
     */
     const shumAccessControl = await upgrades.deployProxy(
        ShumAccessControl,
        [
            admin.address, // admin
        ],
        {
            initializer: "__ShumAccessControl_init",
        }
    );
    console.log("✓ 05 ShumAccessControl contract deployed ")
    console.log(shumAccessControl.address);
    console.log(""); 

    await writeConfig("4config","5config","ShumAccessControl",shumAccessControl.address);
    await sleep(2000);

}

main();
