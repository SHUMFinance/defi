
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

    /**
     * Reusable SafeDecimalMath library. Contracts that depend on it must link
     * to it first before being deployed.
     */
    const SafeDecimalMath = await ethers.getContractFactory(
        "SafeDecimalMath",
        deployer
    );
    const safeDecimalMath = await SafeDecimalMath.deploy();
    console.log("✓ 00 SafeDecimalMath lib deployed ")
    console.log(safeDecimalMath.address);
    console.log("");    

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

    // Load contract factories with external libraries
    const [
        ShumBuildBurnSystem,
        MockShumPrices,
        ShumDebtSystem,
        ShumExchangeSystem,
        ShumLiquidation,
    ] = await Promise.all(
        [
            "ShumBuildBurnSystem",
            "MockShumPrices",
            "ShumDebtSystem",
            "ShumExchangeSystem",
            "ShumLiquidation",
        ].map((contractName) =>
            ethers.getContractFactory(contractName, {
                signer: deployer,
                libraries: {
                    "contracts/SafeDecimalMath.sol:SafeDecimalMath":
                    safeDecimalMath.address,
                },
            })
        )
    );

    /**
     * SHUM token contract
     */
    const shumToken = await upgrades.deployProxy(
        ShumFinance,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumFinance_init",
        }
    );
    //console.log("ShumFinance deploy");   
    console.log("✓ 01 ShumFinance contract deployed ")
    console.log(shumToken.address);
    console.log("");
    
    /**
     * This contract serves two purposes:
     * - An asset registry for recording all synthetic assets
     * - A contract address registry for service discovery
     */
    const shumAssetSystem = await upgrades.deployProxy(
        ShumAssetSystem,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumAssetSystem_init",
        }
    );
    console.log("✓ 02 ShumAssetSystem contract deployed ")
    console.log(shumAssetSystem.address);
    console.log("");   
    
    /**
     * The contract for controlling issuance and burning of synthetic assets
     */
    const shumBuildBurnSystem = await upgrades.deployProxy(
        ShumBuildBurnSystem,
        [
            admin.address, // admin
            zeroAddress, // _susdTokenAddr
        ],
        {
            initializer: "__ShumBuildBurnSystem_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 03 ShumBuildBurnSystem contract deployed ")
    console.log(shumBuildBurnSystem.address);
    console.log(""); 

    /**
     * A contract for storing configuration values
     */
    const shumConfig = await upgrades.deployProxy(
        ShumConfig,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumConfig_init",
        }
    );
    console.log("✓ 04 ShumConfig contract deployed ")
    console.log(shumConfig.address);
    console.log(""); 

    /**
     * A contract for role-based access control
     */
    const shumAccessControl = await upgrades.deployProxy(
        ShumAccessControl,
        [
            admin.address, // admin
        ],
        {
            initializer: "__ShumAccessControl_init",
        }
    );
    console.log("✓ 05 ShumAccessControl contract deployed ")
    console.log(shumAccessControl.address);
    console.log(""); 

    /**
     * Oracle contract for price data access
     */
    const shumPrices = await MockShumPrices.deploy(
        Duration.fromObject({ hours: 12 }).as("seconds") // _stalePeriod
    );
    console.log("✓ 06 MockShumPrices contract deployed ")
    console.log(shumPrices.address);
    console.log(""); 

    const shumDebtSystem = await upgrades.deployProxy(
        ShumDebtSystem,
        [admin.address],
        {
            initializer: "__ShumDebtSystem_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 07 ShumDebtSystem contract deployed ")
    console.log(shumDebtSystem.address);
    console.log(""); 

    const shumCollateralSystem = await upgrades.deployProxy(
        ShumCollateralSystem,
        [
            admin.address, // admin
        ],
        {
            initializer: "__ShumCollateralSystem_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 08 ShumCollateralSystem contract deployed ")
    console.log(shumCollateralSystem.address);
    console.log("");    

    const shumRewardLocker = await upgrades.deployProxy(
        ShumRewardLocker,
        [
            shumToken.address, // _shumTokenAddr
            shumAccessControl.address, // _accessCtrl
            admin.address, // _admin
        ],
        {
            initializer: "__ShumRewardLocker_init",
        }
    );
    console.log("✓ 09 ShumRewardLocker contract deployed ")
    console.log(shumRewardLocker.address);
    console.log("");    

    const shumExchangeSystem = await upgrades.deployProxy(
        ShumExchangeSystem,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumExchangeSystem_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 10 ShumExchangeSystem contract deployed ")
    console.log(shumExchangeSystem.address);
    console.log("");   


    const shumLiquidation = await upgrades.deployProxy(
        ShumLiquidation,
        [
            shumBuildBurnSystem.address, // _shumBuildBurnSystem
            shumCollateralSystem.address, // _shumCollateralSystem
            shumConfig.address, // _shumConfig
            shumDebtSystem.address, // _shumDebtSystem
            shumPrices.address, // _shumPrices
            shumRewardLocker.address, // _shumRewardLocker
            admin.address, // _admin
        ],
        {
            initializer: "__ShumLiquidation_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 11 ShumLiquidation contract deployed ")
    console.log(shumLiquidation.address);
    console.log("");  

    /**
     * Set config items:
     *
     * - BuildRatio: 0.2
     * - LiquidationRatio: 0.5
     * - LiquidationMarkerReward: 0.05
     * - LiquidationLiquidatorReward: 0.1
     * - LiquidationDelay: 3 days
     */
    for (const config of [
    {
        key: "BuildRatio",
        value: expandTo18Decimals(0.2),
    },
    {
        key: "LiquidationRatio",
        value: expandTo18Decimals(0.5),
    },
    {
        key: "LiquidationMarkerReward",
        value: expandTo18Decimals(0.05),
    },
    {
        key: "LiquidationLiquidatorReward",
        value: expandTo18Decimals(0.1),
    },
    {
        key: "LiquidationDelay",
        value: Duration.fromObject({ days: 3 }).as("seconds"),
    },
    ])
    await shumConfig.connect(admin).setUint(
        ethers.utils.formatBytes32String(config.key), // key
        config.value // value
    );
    console.log("shumConfig setUint :");
    console.log(" * - BuildRatio: 0.2 ");
    console.log(" * - LiquidationRatio: 0.5 ");
    console.log(" * - LiquidationMarkerReward: 0.05 ");
    console.log(" * - LiquidationLiquidatorReward: 0.1");
    console.log(" * - LiquidationDelay: 3 days");
    console.log("");

    /**
     * Assign the following roles to contract `ShumBuildBurnSystem`:
     * - ISSUE_ASSET
     * - BURN_ASSET
     * - ShumDebtSystem
     */
    await shumAccessControl
        .connect(admin)
        .SetIssueAssetRole([shumBuildBurnSystem.address], [true]);
    await shumAccessControl
        .connect(admin)
        .SetBurnAssetRole([shumBuildBurnSystem.address], [true]);
    await shumAccessControl
        .connect(admin)
        .SetDebtSystemRole([shumBuildBurnSystem.address], [true]);
    console.log("shumAccessControl :");
    console.log("shumBuildBurnSystem ISSUE_ASSET ");
    console.log("shumBuildBurnSystem BURN_ASSET ");
    console.log("shumBuildBurnSystem SetDebtSystemRole  ");

  /**
   * Assign the following roles to contract `ShumExchangeSystem`:
   * - ISSUE_ASSET
   * - BURN_ASSET
   * - MOVE_ASSET
   */
  await shumAccessControl
    .connect(admin)
    .SetIssueAssetRole([shumExchangeSystem.address], [true]);
  await shumAccessControl
    .connect(admin)
    .SetBurnAssetRole([shumExchangeSystem.address], [true]);
  await shumAccessControl.connect(admin).SetRoles(
    formatBytes32String("MOVE_ASSET"), // roleType
    [shumExchangeSystem.address], // addresses
    [true] // setTo
  );
  console.log("shumExchangeSystem  SetIssueAssetRole");
  console.log("shumExchangeSystem  SetBurnAssetRole");
  console.log("shumExchangeSystem  SetRoles MOVE_ASSET");

  /**
   * Assign the following role to contract `ShumLiquidation`:
   * - MOVE_REWARD
   */
  await shumAccessControl.connect(admin).SetRoles(
    formatBytes32String("MOVE_REWARD"), // roleType
    [shumLiquidation.address], // addresses
    [true] // setTo
  );
  console.log("shumLiquidation     SetRoles MOVE_REWARD");
  console.log("");


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
        shumAssetSystem.address,
        shumAccessControl.address,
        shumConfig.address,
        shumPrices.address,
        shumDebtSystem.address,
        shumCollateralSystem.address,
        shumBuildBurnSystem.address,
        shumRewardLocker.address,
        shumExchangeSystem.address,
        shumLiquidation.address,
      ]
    );
    console.log("shumAssetSystem updateAll");
    console.log("");


    /**
     * Synchronize contract address cache
     */
    await shumBuildBurnSystem
        .connect(admin)
        .updateAddressCache(shumAssetSystem.address);
    await shumCollateralSystem
        .connect(admin)
        .updateAddressCache(shumAssetSystem.address);
    await shumDebtSystem.connect(admin).updateAddressCache(shumAssetSystem.address);
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
    await susdToken.connect(admin).updateAddressCache(shumAssetSystem.address);
    await sbtcToken.connect(admin).updateAddressCache(shumAssetSystem.address);
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
     .updateAddressCache(shumAssetSystem.address);
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


