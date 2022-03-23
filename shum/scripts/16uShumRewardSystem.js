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
    expandTo18Decimals
} = require('./utils/helper')

const main = async () => {

    [deployer] = await ethers.getSigners();
    admin = deployer;
    console.log("admin address is :" + admin.address);

    let shumRewardSystemAddress = await readConfig("13config","ShumRewardSystem");
//    let shumFinanceAddress = await readConfig("13config","ShumFinance");
    const ShumRewardSystem = await ethers.getContractFactory('ShumRewardSystem',deployer)

    console.log("xxl shumRewardSystemAddress : " + shumRewardSystemAddress);
    await upgrades.upgradeProxy(shumRewardSystemAddress, ShumRewardSystem,
        {from: admin.address});
    console.log('ShumCollateralSystem upgraded');


    // let shumRewardSystemContract = await ShumRewardSystem.connect(admin).attach(
    //     shumRewardSystemAddress
    // );

    // await shumRewardSystemContract.setShumAddress(shumFinanceAddress);

}

main();
