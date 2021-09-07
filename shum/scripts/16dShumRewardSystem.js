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

    let SUSDAddress = await readConfig("13config","sUSD");
    let ShumCollateralSystemAddress = await readConfig("13config","ShumCollateralSystem");
    let ShumRewardLockerAddress = await readConfig("13config","ShumRewardLocker");


    /**
    * A contract for distributing rewards calculated and signed off-chain.
    */
    const shumRewardSystem = await upgrades.deployProxy(
        ShumRewardSystem,
        [
            (await ethers.provider.getBlock("latest")).timestamp, // _firstPeriodStartTime
            admin.address,                                        // _rewardSigner
            SUSDAddress,                                          // _susdAddress
            ShumCollateralSystemAddress,                          // _collateralSystemAddress
            ShumRewardLockerAddress,                              // _rewardLockerAddress
            admin.address,                                        // _admin
        ],
        {
            initializer: "__ShumRewardSystem_init",
        }
    );
    console.log("✓ 14 ShumRewardSystem contract deployed ")
    console.log(shumRewardSystem.address);
    console.log("");  

    await writeConfig("13config","14config","ShumRewardSystem",shumRewardSystem.address);
    await sleep(2000);

}

main();
