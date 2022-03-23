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

    const ShumAssetUpgradeable = await ethers.getContractFactory('ShumAssetUpgradeable',deployer)

    /**
     * Create synthetic asset sUNI
     */
    const sUNIToken = await upgrades.deployProxy(
        ShumAssetUpgradeable,
        [
            ethers.utils.formatBytes32String("sUNI"), // bytes32 _key,
            "sUNI", // _name,
            "sUNI", // _symbol
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetUpgradeable_init",
        }
    );
    console.log("✓ 15 ShumAssetUpgradeable sUNI deployed ")
    console.log(sUNIToken.address);
    console.log("");  

    await writeConfig("15config","15config","sUNI",sUNIToken.address);
    await sleep(2000);

}

main();
