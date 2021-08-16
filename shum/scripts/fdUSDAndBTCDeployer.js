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
     * Create the base synthetic asset sUSD
     */
    const susdToken = await upgrades.deployProxy(
        ShumAssetUpgradeable,
        [
            ethers.utils.formatBytes32String("sUSD"), // bytes32 _key,
            "sUSD", // _name,
            "sUSD", // _symbol
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetUpgradeable_init",
        }
    );
    console.log("✓ 12 ShumAssetUpgradeable sUSD deployed ")
    console.log(susdToken.address);
    console.log("");  
    await writeConfig("bconfig","cconfig","sUSD",susdToken.address);
    await sleep(2000);

    /**
     * Create synthetic asset sBTC
     */
    const sBTCToken = await upgrades.deployProxy(
        ShumAssetUpgradeable,
        [
            ethers.utils.formatBytes32String("sBTC"), // bytes32 _key,
            "sBTC", // _name,
            "sBTC", // _symbol
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetUpgradeable_init",
        }
    );
    console.log("✓ 13 ShumAssetUpgradeable sBTC deployed ")
    console.log(sBTCToken.address);
    console.log("");  

    await writeConfig("cconfig","dconfig","sBTC",sBTCToken.address);
    await sleep(2000);

}

main();
