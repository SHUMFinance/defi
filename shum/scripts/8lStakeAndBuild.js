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
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }

    //01 ShumFinance
    const ShumFinance = await ethers.getContractFactory('ShumFinance',deployer)
    const shumToken = await upgrades.deployProxy(
        ShumFinance,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumFinance_init",
        }
    );

    //console.log("ShumFinance deploy");   
    console.log("✓ 01 ShumFinance contract deployed ")
    console.log(shumToken.address);
    console.log("");













    // //02 ShumCollateralSystem
    // let ShumCollateralSystemAddress = await readConfig("dconfig","ShumCollateralSystem");
    // const ShumCollateralSystem = await ethers.getContractFactory('ShumCollateralSystem',deployer)
    // let shumCollateralSystem = await ShumCollateralSystem.connect(admin).attach(
    //   ShumCollateralSystemAddress
    // );

    // //03 sUSD
    // let SUSDTokenAddress = await readConfig("dconfig","sUSD");
    // const ShumAssetUpgradeable = await ethers.getContractFactory('ShumAssetUpgradeable',deployer)
    // let susdToken = await ShumAssetUpgradeable.connect(admin).attach(
    //     SUSDTokenAddress
    // );

    ///
    await shumFinance.connect(alice).approve(
        ShumCollateralSystemAddress,                // spender
        expandTo18Decimals(10),                     // amount
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    await shumCollateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("SHUM"),   // stakeCurrency
        expandTo18Decimals(1),                      // stakeAmount
        expandTo18Decimals(1),                      // buildAmount
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );


    let sum = await shumFinance.balanceOf(alice.address)    
    console.log(sum);

    let susd = await susdToken.balanceOf(alice.address)    
    console.log(susd);
}

main();
