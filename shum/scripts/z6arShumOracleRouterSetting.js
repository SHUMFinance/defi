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
    let tx = await shumOracleRouter
          .connect(admin)
          .addChainlinkOracle(
            ethers.utils.formatBytes32String("sLINK"), // currencyKey
            "0x1B329402Cb1825C6F30A0d92aB9E2862BE47333f", // oracleAddress
            false,// removeExisting
            { gasLimit: args.gasLimit}
    );

    // await sleep(5000);
    // let LinkPrice = await shumOracleRouter
    //                         .connect(admin)
    //                         .getPrice(ethers.utils.formatBytes32String("sLINK")
    //                         ,{gasLimit: args.gasLimit});

    // console.log("sLINK");                        
    // console.log(LinkPrice);

    // let rep = await tx.wait();
    // console.log(rep);


    // Set token "sBNB" to use Chainlink
    await shumOracleRouter
      .connect(admin)
      .addChainlinkOracle(
      ethers.utils.formatBytes32String("sBNB"), // currencyKey
      "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526", // oracleAddress
      false,// removeExisting
      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    // let BNBPrice = await shumOracleRouter
    //                         .connect(admin)
    //                         .getPrice(ethers.utils.formatBytes32String("sBNB")
    //                         ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    // console.log("sBNB");   
    // console.log(BNBPrice);


    // Set token "sETH" to use Chainlink
    await shumOracleRouter
    .connect(admin)
    .addChainlinkOracle(
      ethers.utils.formatBytes32String("sETH"), // currencyKey
      "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7", // oracleAddress
      false,// removeExisting
      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

  // let ETHPrice = await shumOracleRouter
  //                         .connect(admin)
  //                         .getPrice(ethers.utils.formatBytes32String("sETH")
  //                         ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

  // console.log("sETH");  
  // console.log(ETHPrice);


    console.log("sBTC : " + ethers.utils.formatBytes32String("sBTC"));
    // Set token "LINK" to use Chainlink
    await shumOracleRouter
      .connect(admin)
      .addChainlinkOracle(
        ethers.utils.formatBytes32String("sBTC"), // currencyKey
        "0x5741306c21795FdCBb9b265Ea0255F499DFe515C", // oracleAddress
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
