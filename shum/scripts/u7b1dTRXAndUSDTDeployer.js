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
     * Create synthetic asset sTRX
     */
    const sTRXToken = await upgrades.deployProxy(
        ShumAssetUpgradeable,
        [
            ethers.utils.formatBytes32String("sTRX"), // bytes32 _key,
            "sTRX", // _name,
            "sTRX", // _symbol
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetUpgradeable_init",
        }
    );
    console.log("✓ 15 ShumAssetUpgradeable sTRX deployed ")
    console.log(sTRXToken.address);
    console.log("");  

    await writeConfig("15config","15config","sTRX",sTRXToken.address);
    await sleep(2000);

}

main();
