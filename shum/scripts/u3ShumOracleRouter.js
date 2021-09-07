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

    let safeDecimalMath = await readConfig("2config","SafeDecimalMath");

    const ShumOracleRouter = await ethers.getContractFactory("ShumOracleRouter", {
        signer: deployer,
        libraries: {
          "contracts/SafeDecimalMath.sol:SafeDecimalMath":
          safeDecimalMath,
        },
      });

    let ShumOracleRouterAddress = await readConfig("14config","ShumOracleRouter");
    shumOracleRouter = await ShumOracleRouter.connect(admin).attach(
        ShumOracleRouterAddress
    );
    
    try{
        let result = await shumOracleRouter.getPrice(ethers.utils.formatBytes32String("sUSD"));
        console.log("result is ");
        console.log(result.toString());

    }catch(e){
        console.log("xxl shumOracleRouter getPrice");
        console.log(e);
    }



    // //01 ShumFinance
    // let ShumFinanceAddress = await readConfig("14config","ShumFinance");
    // const ShumFinance = await ethers.getContractFactory('ShumFinance',admin)
    // shumFinance = await ShumFinance.connect(admin).attach(
    //     ShumFinanceAddress
    // );

    // //02 ShumCollateralSystem
    // let ShumCollateralSystemAddress = await readConfig("14config","ShumCollateralSystem");
    // const ShumCollateralSystem = await ethers.getContractFactory('ShumCollateralSystem',deployer)
    // let shumCollateralSystem = await ShumCollateralSystem.connect(admin).attach(
    //   ShumCollateralSystemAddress
    // );

    // //03 sUSD
    // let SUSDTokenAddress = await readConfig("14config","sUSD");
    // const ShumAssetUpgradeable = await ethers.getContractFactory('ShumAssetUpgradeable',deployer)
    // let susdToken = await ShumAssetUpgradeable.connect(admin).attach(
    //     SUSDTokenAddress
    // );
    
    // console.log(SUSDTokenAddress);

    // ///
    // await shumFinance.connect(alice).approve(
    //     ShumCollateralSystemAddress,                // spender
    //     expandTo18Decimals(10),                     // amount
    //     { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    // );

    // // let result = await shumCollateralSystem.connect(alice).stakeAndBuild(
    // //     ethers.utils.formatBytes32String("SHUM"),   // stakeCurrency
    // //     expandTo18Decimals(1),                      // stakeAmount
    // //     expandTo18Decimals(1),                      // buildAmount
    // //     { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    // // );
    // // //console.log(result);

    // // let recipt = await result.wait();
    // // console.log(recipt);

    // console.log(shumFinance.balanceOf);

    // // let sum = await shumFinance.balanceOf(alice.address)    
    // // console.log(sum);

    // susdToken.balanceOf(alice.address).catch(error => { throw error})
    // try{
    //     let susd = await susdToken.balanceOf(alice.address) ;
    //     console.log(susd); 
    // }catch(e){
    //     console.log("xxl to error ...");
    //     console.log(e);
    // }
      
    
}

main();
