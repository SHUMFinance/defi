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

    
    const ShumAssetSystem = await ethers.getContractFactory('ShumAssetSystem',deployer)
    /**
     * This contract serves two purposes:
     * - An asset registry for recording all synthetic assets
     * - A contract address registry for service discovery
     */
    const shumAssetSystem = await upgrades.deployProxy(
        ShumAssetSystem,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetSystem_init",
        }
    );
    console.log("✓ 02 ShumAssetSystem contract deployed ")
    console.log(shumAssetSystem.address);
    console.log("");  


    await writeConfig("1config","2config","ShumAssetSystem",shumAssetSystem.address);
    await sleep(2000);

}

main();
