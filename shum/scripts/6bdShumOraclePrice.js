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

    const MockChainlinkAggregator = await ethers.getContractFactory(
        "MockChainlinkAggregator"
    );
    chainlinkAggregator = await MockChainlinkAggregator.deploy();

    console.log("✓ 6.1 ChainlinkAggregator contract deployed ")
    console.log(chainlinkAggregator.address);
    console.log("");

    await writeConfig("6config","6config","ChainlinkAggregator",chainlinkAggregator.address);
    await sleep(2000);


}

main();
