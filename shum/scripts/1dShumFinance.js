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
    // Disable OpenZepplin upgrade warnings for test runs
    // upgrades.silenceWarnings();

    const ShumFinance = await ethers.getContractFactory('ShumFinance',deployer)
    /**
     * SHUM token contract
     */
     const shumToken = await upgrades.deployProxy(
        ShumFinance,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumFinance_init",
        }
    );

    //console.log("ShumFinance deploy");   
    console.log("✓ 01 ShumFinance contract deployed ")
    console.log(shumToken.address);
    console.log("");

    await writeConfig("0config","1config","ShumFinance",shumToken.address);
    await sleep(2000);

}

main();
