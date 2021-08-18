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

    let safeDecimalMath = await readConfig("aconfig","SafeDecimalMath");
    let ShumBuildBurnSystem = await readConfig("aconfig","ShumBuildBurnSystem");
    let ShumCollateralSystem = await readConfig("aconfig","ShumCollateralSystem");
    let ShumConfig = await readConfig("aconfig","ShumConfig");
    let ShumDebtSystem = await readConfig("aconfig","ShumDebtSystem");

    //let MockShumPrices = await readConfig("aconfig","MockShumPrices"); //xxl 01
    let ShumOracleRouter = await readConfig("gconfig","ShumOracleRouter");
    
    let ShumRewardLocker = await readConfig("aconfig","ShumRewardLocker");
  
    const ShumLiquidation = await ethers.getContractFactory('ShumLiquidation', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath,
        },
    })


    console.log(ShumOracleRouter);


    const shumLiquidation = await upgrades.deployProxy(
        ShumLiquidation,
        [
            ShumBuildBurnSystem,        // _shumBuildBurnSystem
            ShumCollateralSystem,       // _shumCollateralSystem
            ShumConfig,                 // _shumConfig
            ShumDebtSystem,             // _shumDebtSystem
            ShumOracleRouter,           // ShumOracleRouter
            ShumRewardLocker,           // _shumRewardLocker
            admin.address,              // _admin
        ],
        {
            initializer: "__ShumLiquidation_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 11 ShumLiquidation contract deployed ")
    console.log(shumLiquidation.address);
    console.log("");  

    await writeConfig("aconfig","bconfig","ShumLiquidation",shumLiquidation.address);
    await sleep(2000);

}

main();
