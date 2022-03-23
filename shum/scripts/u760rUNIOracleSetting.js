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

    //1.
    const MockChainlinkAggregator = await ethers.getContractFactory(
        "MockChainlinkAggregator"
    );
    chainlinkAggregator = await MockChainlinkAggregator.deploy();
    await writeConfig("15config","15config","UNIChainlink",chainlinkAggregator.address);
    await sleep(2000);

    //2.
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

    // Set token "sUNI" to use Chainlink
    await shumOracleRouter.connect(admin).addChainlinkOracle(
        ethers.utils.formatBytes32String("sUNI"), // currencyKey
        chainlinkAggregator.address,             // oracleAddress
        false, // removeExisting
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    console.log("sUNI");                        
    await sleep(3000);

    // 18 decimals
    await chainlinkAggregator.setDecimals(18,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});
    tx = await chainlinkAggregator.setLatestRoundData(
      1, // newRoundId
      expandToNDecimals(25.93, 18), // newAnswer
      100, // newStartedAt
      200, // newUpdatedAt
      1, // newAnsweredInRound
      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );


    let re = await tx.wait();
    console.log(re);

    
   
    // let SHUMPrice = await shumOracleRouter
    //         .connect(admin)
    //         .getPrice(ethers.utils.formatBytes32String("XLM0")
    //         ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    // console.log(SHUMPrice);


}

main();
