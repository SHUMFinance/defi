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
     * Create synthetic asset sBNB
     */
    const sBNBToken = await upgrades.deployProxy(
        ShumAssetUpgradeable,
        [
            ethers.utils.formatBytes32String("sBNB"), // bytes32 _key,
            "sBNB", // _name,
            "sBNB", // _symbol
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetUpgradeable_init",
        }
    );
    console.log("✓ 15 ShumAssetUpgradeable sBNB deployed ")
    console.log(sBNBToken.address);
    console.log("");  

    await writeConfig("15config","15config","sBNB",sBNBToken.address);
    await sleep(2000);

}

main();
