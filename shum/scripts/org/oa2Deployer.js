
const { Duration } = require("luxon");
const { ethers,upgrades } = require("hardhat");


const { Contract,BigNumber} = require("ethers");
const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/dist/src/signer-with-address");
const { Big } = require("big.js");

const { formatBytes32String }  = require("ethers/lib/utils");

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    [deployer, alice, bob] = await ethers.getSigners();
    admin = deployer;

    console.log("admin address is :" + admin.address);

    const zeroAddress = "0x0000000000000000000000000000000000000000";
    uint256Max = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    // Disable OpenZepplin upgrade warnings for test runs
    upgrades.silenceWarnings();

    // Load contract factories without external libraries
    const [
        ShumFinance,
        ShumAccessControl,
        ShumAssetSystem,
        ShumAssetUpgradeable,
        ShumCollateralSystem,
        ShumConfig,
        ShumRewardLocker,
        ShumRewardSystem,
    ] = await Promise.all(
        [
            "ShumFinance",
            "ShumAccessControl",
            "ShumAssetSystem",
            "ShumAssetUpgradeable",
            "ShumCollateralSystem",
            "ShumConfig",
            "ShumRewardLocker",
            "ShumRewardSystem",
        ].map((contractName) => ethers.getContractFactory(contractName, deployer))
    );
    















    
    /**
     * Synchronize contract address cache
     */
    await shumBuildBurnSystem
        .connect(admin)
        .updateAddressCache("0xB45df97a329C33bBd337F0d2776CBFa4d5c790F5");
    await shumCollateralSystem
        .connect(admin)
        .updateAddressCache("0xB45df97a329C33bBd337F0d2776CBFa4d5c790F5");
    await shumDebtSystem.connect(admin).updateAddressCache("0xB45df97a329C33bBd337F0d2776CBFa4d5c790F5");
    console.log("shumBuildBurnSystem  updateAddressCache");
    console.log("shumCollateralSystem updateAddressCache");
    console.log("");


    /**
     * Create the base synthetic asset sUSD
     */
    const susdToken = await upgrades.deployProxy(
        ShumAssetUpgradeable,
        [
            ethers.utils.formatBytes32String("sUSD"), // bytes32 _key,
            "sUSD", // _name,
            "sUSD", // _symbol
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetUpgradeable_init",
        }
    );
    console.log("✓ 12 ShumAssetUpgradeable sUSD deployed ")
    console.log(susdToken.address);
    console.log("");  

    /**
     * Create synthetic asset sBTC
     */
    const sbtcToken = await upgrades.deployProxy(
        ShumAssetUpgradeable,
        [
            ethers.utils.formatBytes32String("sBTC"), // bytes32 _key,
            "sBTC", // _name,
            "sBTC", // _symbol
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetUpgradeable_init",
        }
    );
    console.log("✓ 13 ShumAssetUpgradeable sBTC deployed ")
    console.log(sbtcToken.address);
    console.log("");  


    /**
     * Update synth address cache
     */
    await susdToken.connect(admin).updateAddressCache("0xB45df97a329C33bBd337F0d2776CBFa4d5c790F5");
    await sbtcToken.connect(admin).updateAddressCache("0xB45df97a329C33bBd337F0d2776CBFa4d5c790F5");
    console.log("sUSD shumAssetSystem updateAddressCache");
    console.log("sBTC shumAssetSystem updateAddressCache");
    console.log("");

    /**
    * Register sUSD on `ShumBuildBurnSystem`
    */
    await shumBuildBurnSystem.connect(admin).SetSusdTokenAddress(susdToken.address);
    console.log("shumBuildBurnSystem sUSD SetSusdTokenAddress");
    console.log("");


    /**
    * Register synth assets on `ShumAssetSystem`
    */
    await shumAssetSystem.connect(admin).addAsset(susdToken.address);
    await shumAssetSystem.connect(admin).addAsset(sbtcToken.address);
    console.log("shumAssetSystem sUSD addAsset");
    console.log("shumAssetSystem sBTC addAsset");
    console.log("");

 
   /**
    * Register SHUM on `ShumCollateralSystem`
    */
   await shumCollateralSystem.connect(admin).UpdateTokenInfo(
     ethers.utils.formatBytes32String("SHUM"), // _currency
     shumToken.address, // _tokenAddr
     expandTo18Decimals(1), // _minCollateral
     false // _close
   );
   console.log("shumCollateralSystem SHUM UpdateTokenInfo");
   console.log("");
 
   /**
    * A contract for distributing rewards calculated and signed off-chain.
    */
   const shumRewardSystem = await upgrades.deployProxy(
     ShumRewardSystem,
     [
       (await ethers.provider.getBlock("latest")).timestamp, // _firstPeriodStartTime
       admin.address, // _rewardSigner
       susdToken.address, // _susdAddress
       shumCollateralSystem.address, // _collateralSystemAddress
       shumRewardLocker.address, // _rewardLockerAddress
       admin.address, // _admin
     ],
     {
       initializer: "__ShumRewardSystem_init",
     }
   );
   console.log("✓ 14 ShumRewardSystem contract deployed ")
   console.log(shumRewardSystem.address);
   console.log("");  

 
   /**
    * Synchronize shumExchangeAddress cache
    */
   await shumAssetSystem
     .connect(admin)
     .updateAll(
       [ethers.utils.formatBytes32String("ShumRewardSystem")],
       [shumRewardSystem.address]
     );
    console.log("shumAssetSystem updateAll ShumRewardSystem ")
   await shumExchangeSystem
     .connect(admin)
     .updateAddressCache("0xB45df97a329C33bBd337F0d2776CBFa4d5c790F5");
    console.log("shumExchangeSystem updateAddressCache shumAssetSystem ")
    console.log("");  

  console.log("Deploy OK");
  
}



main();


function expandTo18Decimals(num){

  return expandToNDecimals(num, 18);
}

function expandToNDecimals(num, n){
  let bigNum = new Big(num);

  while (!bigNum.round(0, Big.RoundDown).eq(bigNum)) {
    bigNum = bigNum.mul(10);
    if (--n < 0) return BigNumber.from(0);
  }

  return BigNumber.from(bigNum.toString()).mul(BigNumber.from(10).pow(n));
}


