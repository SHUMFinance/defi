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

    accounts = await ethers.getSigners();
    let admin = accounts[0]
    let deployer = accounts[0]
    let alice = accounts[2]
    console.log("admin address is :" + admin.address + " alice " + alice.address);

    let bigNum = "0x4275696c64526174696f00000000000000000000000000000000000000000000";
    let beforeEthBalace = await utils.formatEther(bigNum.toString());
    console.log(beforeEthBalace);


}

main();
