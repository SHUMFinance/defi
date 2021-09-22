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

    
    let ShumAccessControlAddress = await readConfig("11config","ShumAccessControl");
    let ShumConfigAddress = await readConfig("11config","ShumConfig");
    
    
    //let MockShumPricesAddress = await readConfig("11config","MockShumPrices"); //xxl 01
    let ShumOracleRouter = await readConfig("11config","ShumOracleRouter");

    let ShumDebtSystemAddress = await readConfig("11config","ShumDebtSystem");
    let ShumCollateralSystemAddress = await readConfig("11config","ShumCollateralSystem");
    let ShumBuildBurnSystemAddress = await readConfig("11config","ShumBuildBurnSystem");
    let ShumRewardLockerAddress = await readConfig("11config","ShumRewardLocker");
    let ShumExchangeSystemAddress = await readConfig("11config","ShumExchangeSystem");
    let ShumLiquidationAddress = await readConfig("11config","ShumLiquidation");
    let ShumAssetSystemAddress = await readConfig("11config","ShumAssetSystem");

    const ShumAssetSystem = await ethers.getContractFactory('ShumAssetSystem',deployer)
    shumAssetSystem = await ShumAssetSystem.connect(admin).attach(
        ShumAssetSystemAddress
    );

    await sleep(3000);

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
  console.log("1 shumAssetSystem updateAll");
  await sleep(3000);
 
  let safeDecimalMath = await readConfig("11config","SafeDecimalMath");
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
  console.log("2 ShumBuildBurnSystemAddress");
  await sleep(3000);

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

  console.log("3 ShumDebtSystem");
  await sleep(3000);
  /**
   * Synchronize contract address cache
   */
  await shumBuildBurnSystem
      .connect(admin)
      .updateAddressCache(ShumAssetSystemAddress,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});
  console.log("4 shumBuildBurnSystem");
  await sleep(2000);


  await shumCollateralSystem
      .connect(admin)
      .updateAddressCache(ShumAssetSystemAddress,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});

  console.log("5 shumCollateralSystem");

  await sleep(2000);
  await shumDebtSystem
      .connect(admin)
      .updateAddressCache(ShumAssetSystemAddress,{ gasPrice: args.gasPrice, gasLimit: args.gasLimit});
  console.log("shumBuildBurnSystem  updateAddressCache");
  console.log("shumCollateralSystem updateAddressCache");
  console.log("shumDebtSystem       updateAddressCache");
  console.log("");
  //await sleep(2000);

}


main();
