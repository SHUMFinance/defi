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
      
   
    let ShumOracleRouterAddress = await readConfig("fconfig","ShumOracleRouter");
    
    console.log(ShumOracleRouterAddress);
    let shumOracleRouter = await ShumOracleRouter.connect(admin).attach(
        ShumOracleRouterAddress
    );

    let args = {
      "gasPrice":0x02540be400,
      "gasLimit":0x7a1200,
    }

    // Set token "LINK" to use Chainlink
    await shumOracleRouter
          .connect(admin)
          .addChainlinkOracle(
            ethers.utils.formatBytes32String("LINK"), // currencyKey
            "0x1B329402Cb1825C6F30A0d92aB9E2862BE47333f", // oracleAddress
            false,// removeExisting
            { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    let LinkPrice = await shumOracleRouter
                            .connect(admin)
                            .getPrice(ethers.utils.formatBytes32String("LINK")
                            ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    console.log(LinkPrice);

    // Set token "LINK" to use Chainlink
    await shumOracleRouter
      .connect(admin)
      .addChainlinkOracle(
      ethers.utils.formatBytes32String("BNB"), // currencyKey
      "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526", // oracleAddress
      false,// removeExisting
      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    let BNBPrice = await shumOracleRouter
                            .connect(admin)
                            .getPrice(ethers.utils.formatBytes32String("BNB")
                            ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    console.log(BNBPrice);


    // Set token "LINK" to use Chainlink
    await shumOracleRouter
    .connect(admin)
    .addChainlinkOracle(
      ethers.utils.formatBytes32String("ETH"), // currencyKey
      "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7", // oracleAddress
      false,// removeExisting
      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

  let ETHPrice = await shumOracleRouter
                          .connect(admin)
                          .getPrice(ethers.utils.formatBytes32String("ETH")
                          ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

  console.log(ETHPrice);


    console.log("BTC : " + ethers.utils.formatBytes32String("BTC"));
    // Set token "LINK" to use Chainlink
    await shumOracleRouter
      .connect(admin)
      .addChainlinkOracle(
        ethers.utils.formatBytes32String("BTC"), // currencyKey
        "0x5741306c21795FdCBb9b265Ea0255F499DFe515C", // oracleAddress
        false,// removeExisting
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
      );

    let BTCPrice = await shumOracleRouter
            .connect(admin)
            .getPrice(ethers.utils.formatBytes32String("BTC")
            ,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

    console.log(BTCPrice);

}

main();
