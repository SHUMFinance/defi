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
    expandTo18Decimals
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


    let ShumPricesAddress = await readConfig("econfig","MockShumPrices");    
    /**
     * Oracle contract for price data access
     */
    const shumPrices = await MockShumPrices.connect(admin).attach(
        ShumPricesAddress
    );

    // Set SHUM price to $0.01
    await shumPrices.connect(admin).setPrice(
        ethers.utils.formatBytes32String("SHUM"), // currencyKey
        expandTo18Decimals(0.01) // price
    );


}

main();
