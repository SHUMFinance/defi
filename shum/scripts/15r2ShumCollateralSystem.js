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


    let ShumCollateralSystemAddress = await readConfig("12config","ShumCollateralSystem");
    let ShumFinanceAddress = await readConfig("12config","ShumFinance");
    
    const ShumCollateralSystem = await ethers.getContractFactory('ShumCollateralSystem',deployer)
    let shumCollateralSystem = await ShumCollateralSystem.connect(admin).attach(
      ShumCollateralSystemAddress
    );

    /**
    * Register SHUM on `ShumCollateralSystem`
    */
    await shumCollateralSystem.connect(admin).UpdateTokenInfo(
        ethers.utils.formatBytes32String("SHUM"), // _currency
        ShumFinanceAddress,                       // _tokenAddr
        expandTo18Decimals(1),                    // _minCollateral
        false                                     // _close
    );
    console.log("shumCollateralSystem SHUM UpdateTokenInfo");
    console.log("");

}

main();
