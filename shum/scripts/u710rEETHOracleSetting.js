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

    // Set token "sETH" to use Chainlink
    await shumOracleRouter
          .connect(admin)
          .addChainlinkOracle(
            ethers.utils.formatBytes32String("sETH"), // currencyKey
            "0x9326BFA02ADD2366b30bacB125260Af641031331", // oracleAddress
            true,// removeExisting
            { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );

    console.log("sETH");                  
    

}

main();
