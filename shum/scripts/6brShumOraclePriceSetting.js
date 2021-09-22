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
    expandToNDecimals,
} = require('./utils/helper')

const main = async () => {

    [deployer] = await ethers.getSigners();
    admin = deployer;
    console.log("admin address is :" + admin.address);

    let args = {
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

    let ShumOracleRouterAddress = await readConfig("6config","ShumOracleRouter");
    let shumOracleRouter = await ShumOracleRouter.connect(admin).attach(
        ShumOracleRouterAddress
    );

    let ChainlinkAggregatorAddress = await readConfig("6config","ChainlinkAggregator");
    const ChainlinkAggregator = await ethers.getContractFactory("MockChainlinkAggregator", deployer);
    let chainlinkAggregator = await ChainlinkAggregator.connect(admin).attach(
        ChainlinkAggregatorAddress
    );

    // Set token "SHUM" to use Chainlink
    await shumOracleRouter.connect(admin).addChainlinkOracle(
        ethers.utils.formatBytes32String("SHUM"), // currencyKey
        ChainlinkAggregatorAddress, // oracleAddress
        false, // removeExisting
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    console.log("SHUM");                        
    await sleep(3000);

    // 18 decimals
    await chainlinkAggregator.setDecimals(18,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});
    tx = await chainlinkAggregator.setLatestRoundData(
      1, // newRoundId
      expandToNDecimals(5, 18), // newAnswer
      100, // newStartedAt
      200, // newUpdatedAt
      1, // newAnsweredInRound
      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );


    let re = await tx.wait();
    console.log(re);

    
   
    // let SHUMPrice = await shumOracleRouter
    //         .connect(admin)
    //         .getPrice(ethers.utils.formatBytes32String("SHUM")
    //         ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    // console.log(SHUMPrice);


}

main();
