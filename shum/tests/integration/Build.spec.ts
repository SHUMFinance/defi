import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { expandTo18Decimals, uint256Max } from "../utilities";
import { deployLinearStack, DeployedStack } from "../utilities/init";
import { getBlockDateTime } from "../utilities/timeTravel";

describe("Integration | Build", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress;

  let stack: DeployedStack;

  beforeEach(async function () {
    [deployer, alice, bob] = await ethers.getSigners();
    admin = deployer;

    stack = await deployLinearStack(deployer, admin);

    // Set SHUM price to $0.01
    await stack.shumPrices.connect(admin).setPrice(
      ethers.utils.formatBytes32String("SHUM"), // currencyKey
      expandTo18Decimals(0.01) // price
    );

    // Mint 1,000,000 SHUM to Alice
    await stack.shumToken
      .connect(admin)
      .mint(alice.address, expandTo18Decimals(1_000_000));

    await stack.shumToken
      .connect(alice)
      .approve(stack.shumCollateralSystem.address, uint256Max);
  });

  it("can build sUSD with just locked reward", async function () {
    // Lock 10,000 SHUM of rewards for Alice
    await stack.shumRewardLocker.connect(admin).migrateRewards(
      [alice.address], // _users
      [expandTo18Decimals(10_000)], // _amounts
      [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
    );

    // Alice can build 1 sUSD without staking
    await stack.shumBuildBurnSystem.connect(alice).BuildAsset(
      expandTo18Decimals(1) // amount
    );

    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(1)
    );
  });

  it("maxRedeemableLina() should return staked amount when debt is zero regardless of locked collateral", async function () {
    // Alice stakes 9,000 SHUM
    await stack.shumCollateralSystem.connect(alice).Collateral(
      ethers.utils.formatBytes32String("SHUM"), // _currency
      expandTo18Decimals(9_000) // _amount
    );

    // Returns 9,000 when locked amount is zero
    expect(
      await stack.shumCollateralSystem.maxRedeemableLina(
        alice.address // user
      )
    ).to.equal(expandTo18Decimals(9_000));

    // Lock rewards for Alice
    await stack.shumRewardLocker.connect(admin).migrateRewards(
      [alice.address], // _users
      [expandTo18Decimals(9_000).sub(1)], // _amounts
      [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
    );

    // Returns 9,000 when locked amount is less than staked
    expect(
      await stack.shumCollateralSystem.maxRedeemableLina(
        alice.address // user
      )
    ).to.equal(expandTo18Decimals(9_000));

    // Lock 1 unit of SHUM rewards for Alice
    await stack.shumRewardLocker.connect(admin).migrateRewards(
      [alice.address], // _users
      [1], // _amounts
      [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
    );

    // Returns 9,000 when locked amount is the same as staked
    expect(
      await stack.shumCollateralSystem.maxRedeemableLina(
        alice.address // user
      )
    ).to.equal(expandTo18Decimals(9_000));

    // Lock 1 unit of SHUM rewards for Alice
    await stack.shumRewardLocker.connect(admin).migrateRewards(
      [alice.address], // _users
      [1], // _amounts
      [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
    );

    // Returns 9,000 when locked amount is the same as staked
    expect(
      await stack.shumCollateralSystem.maxRedeemableLina(
        alice.address // user
      )
    ).to.equal(expandTo18Decimals(9_000));
  });

  it("maxRedeemableLina() should reflect debt amount", async function () {
    // Alice stakes 9,000 SHUM
    await stack.shumCollateralSystem.connect(alice).Collateral(
      ethers.utils.formatBytes32String("SHUM"), // _currency
      expandTo18Decimals(9_000) // _amount
    );

    // Alice builds 10 sUSD
    await stack.shumBuildBurnSystem.connect(alice).BuildAsset(
      expandTo18Decimals(10) // amount
    );

    // 5,000 SHUM is set aside
    expect(
      await stack.shumCollateralSystem.maxRedeemableLina(
        alice.address // user
      )
    ).to.equal(expandTo18Decimals(4_000));

    // Lock 4,000 SHUM rewards for Alice
    await stack.shumRewardLocker.connect(admin).migrateRewards(
      [alice.address], // _users
      [expandTo18Decimals(4_000)], // _amounts
      [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
    );

    // Now 8,000 SHUM is withdrawable
    expect(
      await stack.shumCollateralSystem.maxRedeemableLina(
        alice.address // user
      )
    ).to.equal(expandTo18Decimals(8_000));

    // Lock 1,000 SHUM rewards for Alice
    await stack.shumRewardLocker.connect(admin).migrateRewards(
      [alice.address], // _users
      [expandTo18Decimals(1_000)], // _amounts
      [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
    );

    // All staked amount available
    expect(
      await stack.shumCollateralSystem.maxRedeemableLina(
        alice.address // user
      )
    ).to.equal(expandTo18Decimals(9_000));

    // Locking more won't increase withdrawable amount
    await stack.shumRewardLocker.connect(admin).migrateRewards(
      [alice.address], // _users
      [1], // _amounts
      [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
    );
    expect(
      await stack.shumCollateralSystem.maxRedeemableLina(
        alice.address // user
      )
    ).to.equal(expandTo18Decimals(9_000));
  });
});
