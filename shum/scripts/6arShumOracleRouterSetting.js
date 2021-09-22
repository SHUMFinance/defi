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

    let safeDecimalMath = await readConfig("2config","SafeDecimalMath");

    const ShumOracleRouter = await ethers.getContractFactory("ShumOracleRouter", {
        signer: deployer,
        libraries: {
          "contracts/SafeDecimalMath.sol:SafeDecimalMath":
          safeDecimalMath,
        },
      });
      
   
    let ShumOracleRouterAddress = await readConfig("6config","ShumOracleRouter");
    
    console.log(ShumOracleRouterAddress);
    let shumOracleRouter = await ShumOracleRouter.connect(admin).attach(
        ShumOracleRouterAddress
    );

    let args = {
      "gasPrice":0x02540be400,
      "gasLimit":0x7a1200,
    }

    // Set token "sLINK" to use Chainlink
    await shumOracleRouter
          .connect(admin)
          .addChainlinkOracle(
            ethers.utils.formatBytes32String("sLINK"), // currencyKey
            "0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0", // oracleAddress
            false,// removeExisting
            { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    // let LinkPrice = await shumOracleRouter
    //                         .connect(admin)
    //                         .getPrice(ethers.utils.formatBytes32String("sLINK")
    //                         ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    console.log("sLINK");                        
    // console.log(LinkPrice);
    await sleep(3000);

    // Set token "sBNB" to use Chainlink
    await shumOracleRouter
      .connect(admin)
      .addChainlinkOracle(
      ethers.utils.formatBytes32String("sBNB"), // currencyKey
      "0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16", // oracleAddress
      false,// removeExisting
      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    // let BNBPrice = await shumOracleRouter
    //                         .connect(admin)
    //                         .getPrice(ethers.utils.formatBytes32String("sBNB")
    //                         ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    // console.log("sBNB");   
    // console.log(BNBPrice);
    console.log("sBNB");                        
    await sleep(3000);

    // Set token "sETH" to use Chainlink
    await shumOracleRouter
    .connect(admin)
    .addChainlinkOracle(
      ethers.utils.formatBytes32String("sETH"), // currencyKey
      "0x9326BFA02ADD2366b30bacB125260Af641031331", // oracleAddress
      false,// removeExisting
      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

  // let ETHPrice = await shumOracleRouter
  //                         .connect(admin)
  //                         .getPrice(ethers.utils.formatBytes32String("sETH")
  //                         ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

  // console.log("sETH");  
  // console.log(ETHPrice);
  console.log("sETH");                        
  await sleep(3000);

    console.log("sBTC : " + ethers.utils.formatBytes32String("sBTC"));
    // Set token "LINK" to use Chainlink
    await shumOracleRouter
      .connect(admin)
      .addChainlinkOracle(
        ethers.utils.formatBytes32String("sBTC"), // currencyKey
        "0x6135b13325bfC4B00278B4abC5e20bbce2D6580e", // oracleAddress
        false,// removeExisting
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
      );

    // let BTCPrice = await shumOracleRouter
    //         .connect(admin)
    //         .getPrice(ethers.utils.formatBytes32String("sBTC")
    //         ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    // console.log("sBTC");          
    // console.log(BTCPrice);

}

main();
