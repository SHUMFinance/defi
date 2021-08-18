//const { ethers } = require("hardhat");
const { Duration } = require("luxon");

const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
const { formatBytes32String }  = require("ethers/lib/utils");

const { Contract,BigNumber} = require("ethers");
const { Big } = require("big.js");

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

    
    let ShumAccessControlAddress = await readConfig("bconfig","ShumAccessControl");
    let ShumConfigAddress = await readConfig("bconfig","ShumConfig");
    
    
    //let MockShumPricesAddress = await readConfig("bconfig","MockShumPrices"); //xxl 01
    let ShumOracleRouter = await readConfig("aconfig","ShumOracleRouter");

    let ShumDebtSystemAddress = await readConfig("bconfig","ShumDebtSystem");
    let ShumCollateralSystemAddress = await readConfig("bconfig","ShumCollateralSystem");
    let ShumBuildBurnSystemAddress = await readConfig("bconfig","ShumBuildBurnSystem");
    let ShumRewardLockerAddress = await readConfig("bconfig","ShumRewardLocker");
    let ShumExchangeSystemAddress = await readConfig("bconfig","ShumExchangeSystem");
    let ShumLiquidationAddress = await readConfig("bconfig","ShumLiquidation");
    let ShumAssetSystemAddress = await readConfig("bconfig","ShumAssetSystem");

    const ShumAssetSystem = await ethers.getContractFactory('ShumAssetSystem',deployer)
    shumAssetSystem = await ShumAssetSystem.connect(admin).attach(
        ShumAssetSystemAddress
    );

    let args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }
    /**
    * Fill the contract address registry
    */
  await shumAssetSystem
  .connect(admin)
  .updateAll(
    [
      ethers.utils.formatBytes32String("ShumAssetSystem"),
      ethers.utils.formatBytes32String("ShumAccessControl"),
      ethers.utils.formatBytes32String("ShumConfig"),
      ethers.utils.formatBytes32String("ShumPrices"),
      ethers.utils.formatBytes32String("ShumDebtSystem"),
      ethers.utils.formatBytes32String("ShumCollateralSystem"),
      ethers.utils.formatBytes32String("ShumBuildBurnSystem"),
      ethers.utils.formatBytes32String("ShumRewardLocker"),
      ethers.utils.formatBytes32String("ShumExchangeSystem"),
      ethers.utils.formatBytes32String("ShumLiquidation"),
    ],
    [
      ShumAssetSystemAddress,
      ShumAccessControlAddress,
      ShumConfigAddress,
      ShumOracleRouter,
      ShumDebtSystemAddress,
      ShumCollateralSystemAddress,
      ShumBuildBurnSystemAddress,
      ShumRewardLockerAddress,
      ShumExchangeSystemAddress,
      ShumLiquidationAddress,
    ],{ gasPrice: args.gasPrice, gasLimit: args.gasLimit}
  );
  console.log("shumAssetSystem updateAll");
 
  let safeDecimalMath = await readConfig("bconfig","SafeDecimalMath");
  const ShumBuildBurnSystem = await ethers.getContractFactory('ShumBuildBurnSystem', {
      signer: deployer,
      libraries: {
          "contracts/SafeDecimalMath.sol:SafeDecimalMath":
          safeDecimalMath,
      },
  })
  let shumBuildBurnSystem = await ShumBuildBurnSystem.connect(admin).attach(
      ShumBuildBurnSystemAddress
  );

  const ShumCollateralSystem = await ethers.getContractFactory('ShumCollateralSystem',deployer)
  let shumCollateralSystem = await ShumCollateralSystem.connect(admin).attach(
    ShumCollateralSystemAddress
  );

  const ShumDebtSystem = await ethers.getContractFactory('ShumDebtSystem', {
      signer: deployer,
      libraries: {
          "contracts/SafeDecimalMath.sol:SafeDecimalMath":
          safeDecimalMath,
      },
  })
  let shumDebtSystem = await ShumDebtSystem.connect(admin).attach(
      ShumDebtSystemAddress
  );

  /**
   * Synchronize contract address cache
   */
  await shumBuildBurnSystem
      .connect(admin)
      .updateAddressCache(ShumAssetSystemAddress,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});
  await shumCollateralSystem
      .connect(admin)
      .updateAddressCache(ShumAssetSystemAddress,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});
  await shumDebtSystem
      .connect(admin)
      .updateAddressCache(ShumAssetSystemAddress,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});
  console.log("shumBuildBurnSystem  updateAddressCache");
  console.log("shumCollateralSystem updateAddressCache");
  console.log("shumDebtSystem       updateAddressCache");
  console.log("");
  await sleep(2000);

}


main();
