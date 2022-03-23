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

    const ShumCollateralSystem = await ethers.getContractFactory('ShumCollateralSystem',deployer)

    let shumCollateralSystemAddress = await readConfig("8config","ShumCollateralSystem");

    console.log("xxl shumCollateralSystemAddress : " + shumCollateralSystemAddress);

    await upgrades.upgradeProxy(shumCollateralSystemAddress, ShumCollateralSystem,
        {from: admin.address, admin, unsafeAllowCustomTypes: true });
    console.log('ShumCollateralSystem upgraded');


    // const shumCollateralSystem = await upgrades.deployProxy(
    //     ShumCollateralSystem,
    //     [
    //         admin.address, // admin
    //     ],
    //     {
    //         initializer: "__ShumCollateralSystem_init",
    //         unsafeAllowLinkedLibraries: true,
    //     }
    // );
    // console.log("✓ 08 ShumCollateralSystem contract deployed ")
    // console.log(shumCollateralSystem.address);
    // console.log("");    

    // await writeConfig("7config","8config","ShumCollateralSystem",shumCollateralSystem.address);
    // await sleep(2000);

}

main();
