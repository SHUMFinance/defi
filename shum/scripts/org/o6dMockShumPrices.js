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

    let safeDecimalMath = await readConfig("2config","SafeDecimalMath");
    const MockShumPrices = await ethers.getContractFactory('MockShumPrices', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath,
        },
    })

    /**
     * Oracle contract for price data access
     */
    const shumPrices = await MockShumPrices.deploy(
        Duration.fromObject({ hours: 12 }).as("seconds") // _stalePeriod
    );
    console.log("✓ 06 MockShumPrices contract deployed ")
    console.log(shumPrices.address);
    console.log(""); 

    await writeConfig("5config","6config","MockShumPrices",shumPrices.address);
    await sleep(2000);

}

main();
