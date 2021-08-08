/**
 * This file is for bootstrapping a testing environment that's as complete as possible.
 * Note that this is intended for integration tests. For unit tests, you are recommended
 * to use mocks etc. to isolate the module under test.
 */

import { Duration } from "luxon";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { expandTo18Decimals, zeroAddress } from ".";
import { formatBytes32String } from "ethers/lib/utils";

export interface DeployedStack {
  shumToken: Contract;
  susdToken: Contract;
  sbtcToken: Contract;
  shumAccessControl: Contract;
  shumAssetSystem: Contract;
  shumBuildBurnSystem: Contract;
  shumPrices: Contract;
  shumCollateralSystem: Contract;
  shumConfig: Contract;
  shumDebtSystem: Contract;
  shumExchangeSystem: Contract;
  shumRewardLocker: Contract;
  shumRewardSystem: Contract;
  shumLiquidation: Contract;
}

export const deployLinearStack = async (
  deployer: SignerWithAddress,
  admin: SignerWithAddress
): Promise<DeployedStack> => {
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
  const shumToken: Contract = await upgrades.deployProxy(
    ShumFinance,
    [
      admin.address, // _admin
    ],
    {
      initializer: "__ShumFinance_init",
    }
  );

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

  /**
   * Oracle contract for price data access
   */
  const shumPrices = await MockShumPrices.deploy(
    Duration.fromObject({ hours: 12 }).as("seconds") // _stalePeriod
  );

  const shumDebtSystem = await upgrades.deployProxy(
    ShumDebtSystem,
    [admin.address],
    {
      initializer: "__ShumDebtSystem_init",
      unsafeAllowLinkedLibraries: true,
    }
  );

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

  /**
   * Assign the following role to contract `ShumLiquidation`:
   * - MOVE_REWARD
   */
  await shumAccessControl.connect(admin).SetRoles(
    formatBytes32String("MOVE_REWARD"), // roleType
    [shumLiquidation.address], // addresses
    [true] // setTo
  );

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

  /**
   * Create synthetic asset lBTC
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

  /**
   * Update synth address cache
   */
  await susdToken.connect(admin).updateAddressCache(shumAssetSystem.address);
  await sbtcToken.connect(admin).updateAddressCache(shumAssetSystem.address);

  /**
   * Register sUSD on `ShumBuildBurnSystem`
   */
  await shumBuildBurnSystem.connect(admin).SetSusdTokenAddress(susdToken.address);

  /**
   * Register synth assets on `ShumAssetSystem`
   */
  await shumAssetSystem.connect(admin).addAsset(susdToken.address);
  await shumAssetSystem.connect(admin).addAsset(sbtcToken.address);

  /**
   * Register SHUM on `ShumCollateralSystem`
   */
  await shumCollateralSystem.connect(admin).UpdateTokenInfo(
    ethers.utils.formatBytes32String("SHUM"), // _currency
    shumToken.address, // _tokenAddr
    expandTo18Decimals(1), // _minCollateral
    false // _close
  );

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

  /**
   * Synchronize shumExchangeAddress cache
   */
  await shumAssetSystem
    .connect(admin)
    .updateAll(
      [ethers.utils.formatBytes32String("ShumRewardSystem")],
      [shumRewardSystem.address]
    );
  await shumExchangeSystem
    .connect(admin)
    .updateAddressCache(shumAssetSystem.address);

  return {
    shumToken,
    susdToken,
    sbtcToken,
    shumAccessControl,
    shumAssetSystem,
    shumBuildBurnSystem,
    shumPrices,
    shumCollateralSystem,
    shumConfig,
    shumDebtSystem,
    shumExchangeSystem,
    shumRewardLocker,
    shumRewardSystem,
    shumLiquidation,
  };
};
