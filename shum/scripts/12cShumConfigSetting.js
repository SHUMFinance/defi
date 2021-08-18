//const { ethers } = require("hardhat");
const { Duration } = require("luxon");

const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const { Contract,BigNumber} = require("ethers");
const { Big } = require("big.js");

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


    let shumConfigAddress = await readConfig("aconfig","ShumConfig");
    const ShumConfig = await ethers.getContractFactory('ShumConfig',deployer)
    shumConfig = await ShumConfig.connect(admin).attach(
        shumConfigAddress
        //"0x2ba233B9345165E7b374B13bCc4991C4fCD8B351"
    );


    /**
     * Set config items:
     *
     * - BuildRatio: 0.2
     * - LiquidationRatio: 0.5
     * - LiquidationMarkerReward: 0.05
     * - LiquidationLiquidatorReward: 0.1
     * - LiquidationDelay: 3 days
     */
    for (const config of [
    {
        key: "BuildRatio",
        value: expandTo18Decimals(0.2),
    },
    {
        key: "LiquidationRatio",
        value: expandTo18Decimals(0.5),
    },
    {
        key: "LiquidationMarkerReward",
        value: expandTo18Decimals(0.05),
    },
    {
        key: "LiquidationLiquidatorReward",
        value: expandTo18Decimals(0.1),
    },
    {
        key: "LiquidationDelay",
        value: Duration.fromObject({ days: 3 }).as("seconds"),
    },
    ])
    await shumConfig.connect(admin).setUint(
        ethers.utils.formatBytes32String(config.key), // key
        config.value // value
    );
    console.log("shumConfig setUint :");
    console.log(" * - BuildRatio: 0.2 ");
    console.log(" * - LiquidationRatio: 0.5 ");
    console.log(" * - LiquidationMarkerReward: 0.05 ");
    console.log(" * - LiquidationLiquidatorReward: 0.1");
    console.log(" * - LiquidationDelay: 3 days");
    console.log("");

    await sleep(2000);

}

function expandTo18Decimals(num){

    return expandToNDecimals(num, 18);
}

function expandToNDecimals(num, n){
    let bigNum = new Big(num);

    while (!bigNum.round(0, Big.RoundDown).eq(bigNum)) {
        bigNum = bigNum.mul(10);
        if (--n < 0) return BigNumber.from(0);
    }

    return BigNumber.from(bigNum.toString()).mul(BigNumber.from(10).pow(n));
}
  
  

main();
