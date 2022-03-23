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

    let safeDecimalMath = await readConfig("2config","SafeDecimalMath");
    const ShumBuildBurnSystem = await ethers.getContractFactory('ShumBuildBurnSystem', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath,
        },
    })

    //const ShumBuildBurnSystem = await ethers.getContractFactory('ShumBuildBurnSystem',deployer)

    let ShumBuildBurnSystemAddress = await readConfig("3config","ShumBuildBurnSystem");

    console.log("xxl ShumBuildBurnSystem : " + ShumBuildBurnSystemAddress);

    await upgrades.upgradeProxy(ShumBuildBurnSystemAddress, ShumBuildBurnSystem,
        {from: admin.address, admin, unsafeAllowLinkedLibraries: true });
    console.log('ShumBuildBurnSystem upgraded');

}

main();
