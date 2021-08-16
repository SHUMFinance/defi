const { ethers } = require("hardhat");
const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const {
    writeConfig,
    readConfig,
    sleep, 
} = require('./utils/helper')

const main = async () => {


    [deployer] = await ethers.getSigners();
    admin = deployer;

    console.log("admin address is :" + admin.address);
    // Disable OpenZepplin upgrade warnings for test runs
    // upgrades.silenceWarnings();

    /**
     * Reusable SafeDecimalMath library. Contracts that depend on it must link
     * to it first before being deployed.
     */
    const SafeDecimalMath = await ethers.getContractFactory(
        "SafeDecimalMath",
        deployer
    );
    const safeDecimalMath = await SafeDecimalMath.deploy();
    console.log("✓ 00 SafeDecimalMath lib deployed ")
    console.log(safeDecimalMath.address);
    console.log("");    

    await writeConfig("0config","0config","SafeDecimalMath",safeDecimalMath.address);
    await sleep(2000);

}

main();
