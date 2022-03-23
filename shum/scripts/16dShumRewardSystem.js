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


    const ShumRewardSystem = await ethers.getContractFactory('ShumRewardSystem',deployer)

    let sUSDAddress = await readConfig("12config","sUSD");
    let shumFinance = await readConfig("12config","ShumFinance");
    let ShumCollateralSystemAddress = await readConfig("12config","ShumCollateralSystem");
    let ShumRewardLockerAddress = await readConfig("12config","ShumRewardLocker");

  
    /**
    * A contract for distributing rewards calculated and signed off-chain.
    */
    const shumRewardSystem = await upgrades.deployProxy(
        ShumRewardSystem,
        [
            (await ethers.provider.getBlock("latest")).timestamp, // _firstPeriodStartTime
            admin.address,                                        // _rewardSigner
            sUSDAddress,                                          // _susdAddress
            shumFinance,                                          // _shumFinance
            ShumCollateralSystemAddress,                          // _collateralSystemAddress
            ShumRewardLockerAddress,                              // _rewardLockerAddress
            admin.address,                                        // _admin
        ],
        {
            initializer: "__ShumRewardSystem_init",
        }
    );
    console.log("✓ 13 ShumRewardSystem contract deployed ")
    console.log(shumRewardSystem.address);
    console.log("");  

    await writeConfig("12config","13config","ShumRewardSystem",shumRewardSystem.address);
    await sleep(2000);

}

main();
