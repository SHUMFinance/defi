import { Duration } from "luxon";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { expandTo18Decimals, uint256Max } from "../utilities";
import { deployLinearStack, DeployedStack } from "../utilities/init";
import {
  getBlockDateTime,
  setNextBlockTimestamp,
} from "../utilities/timeTravel";

interface RewardData {
  lockToTime: BigNumber;
  amount: BigNumber;
}

describe("Integration | Liquidation", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    charlie: SignerWithAddress;

  let stack: DeployedStack;

  const liquidationDelay: Duration = Duration.fromObject({ days: 3 });

  const passLiquidationDelay = async (): Promise<void> => {
    await setNextBlockTimestamp(
      ethers.provider,
      (await getBlockDateTime(ethers.provider))
        .plus(liquidationDelay)
        .plus({ seconds: 1 })
    );
  };

  const setShumPrice = async (price: number): Promise<void> => {
    await stack.shumPrices.connect(admin).setPrice(
      ethers.utils.formatBytes32String("SHUM"), // currencyKey
      expandTo18Decimals(price) // price
    );
  };

  const stakeAndBuild = async (
    user: SignerWithAddress,
    stakeAmount: BigNumber,
    buildAmount: BigNumber
  ): Promise<void> => {
    await stack.shumCollateralSystem.connect(user).Collateral(
      ethers.utils.formatBytes32String("SHUM"), // _currency
      stakeAmount // _amount
    );
    await stack.shumBuildBurnSystem.connect(user).BuildAsset(
      buildAmount // amount
    );
  };

  const assertUserLinaCollateral = async (
    user: string,
    staked: BigNumber,
    locked: BigNumber
  ): Promise<void> => {
    const breakdown = await stack.shumCollateralSystem.getUserLinaCollateralBreakdown(
      user
    );

    expect(breakdown.staked).to.equal(staked);
    expect(breakdown.locked).to.equal(locked);
  };

  const changeStakedCollateralToLocked = async (
    user: SignerWithAddress,
    amount: BigNumber
  ): Promise<void> => {
    await stack.shumRewardLocker.connect(admin).migrateRewards(
      [user.address], // _users
      [amount], // _amounts
      [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
    );
    await stack.shumCollateralSystem.connect(user).Redeem(
      formatBytes32String("SHUM"), // _currency
      amount // _amount
    );
  };

  const assertIdenticalAggregation = (
    expected: Map<number, BigNumber>,
    actual: Map<number, BigNumber>
  ): void => {
    expect(actual.size).to.equal(expected.size);

    expected.forEach((value, key) => {
      expect(actual.get(key)).to.equal(value);
    });
  };

  const aggregateLockedRewards = async (
    addresses: string[]
  ): Promise<Map<number, BigNumber>> => {
    const aggregation = new Map<number, BigNumber>();

    for (const address of addresses) {
      for (let ind = 0; ; ind++) {
        try {
          const rewardEntry: RewardData = await stack.shumRewardLocker.userRewards(
            address,
            ind
          );

          if (rewardEntry.amount.gt(0)) {
            const time = rewardEntry.lockToTime.toNumber();
            aggregation.set(
              time,
              rewardEntry.amount.add(
                aggregation.has(time) ? aggregation.get(time) : 0
              )
            );
          }
        } catch {
          break;
        }
      }
    }

    return aggregation;
  };

  const buildAggregation = (): Promise<Map<number, BigNumber>> => {
    return aggregateLockedRewards([
      alice.address,
      bob.address,
      charlie.address,
    ]);
  };

  beforeEach(async function () {
    [deployer, alice, bob, charlie] = await ethers.getSigners();
    admin = deployer;

    stack = await deployLinearStack(deployer, admin);

    // Set SHUM price to $0.1
    await setShumPrice(0.1);

    // Grant Alice and Bob 1,000,000 SHUM each
    for (const user of [alice, bob]) {
      await stack.shumToken
        .connect(admin)
        .mint(user.address, expandTo18Decimals(1_000_000));
      await stack.shumToken
        .connect(user)
        .approve(stack.shumCollateralSystem.address, uint256Max);
    }

    // Alice stakes 1,000 SHUM ($100) and builds 20 lUSD
    await stakeAndBuild(
      alice,
      expandTo18Decimals(1_000),
      expandTo18Decimals(20)
    );

    // Bob staks 1,000,000 SHUM nd builds 1,000 lUSD
    await stakeAndBuild(
      bob,
      expandTo18Decimals(1_000_000),
      expandTo18Decimals(1_000)
    );
  });

  it("can mark position only when C-ratio is below liquidation ratio", async () => {
    // Price of SHUM changes to $0.04 such that Alice's C-ratio becomes 200%
    await setShumPrice(0.04);

    // Can't mark Alice's position as it's not *below* liquidation ratio
    await expect(
      stack.shumLiquidation
        .connect(bob)
        .markPositionAsUndercollateralized(alice.address)
    ).to.be.revertedWith("ShumLiquidation: not undercollateralized");

    // // Price of SHUM drops such that Alice's C-ratio falls below liquidation ratio
    await setShumPrice(0.038);

    // Can mark position normally
    await expect(
      stack.shumLiquidation
        .connect(bob)
        .markPositionAsUndercollateralized(alice.address)
    )
      .to.emit(stack.shumLiquidation, "PositionMarked")
      .withArgs(
        alice.address, // user
        bob.address // marker
      );

    // // Confirm mark
    // expect(
    //   await stack.shumLiquidation.isPositionMarkedAsUndercollateralized(
    //     alice.address
    //   )
    // ).to.equal(true);
    // expect(
    //   await stack.shumLiquidation.getUndercollateralizationMarkMarker(
    //     alice.address
    //   )
    // ).to.equal(bob.address);



  });

  // it("can remove position mark only when C-ratio is not below issuance ratio", async () => {
  //   // Alice gets marked for liquidation
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .markPositionAsUndercollateralized(alice.address);

  //   // SHUM price goes to $0.099. Alice cannot remove mark
  //   await setShumPrice(0.099);

  //   await expect(
  //     stack.shumLiquidation
  //       .connect(alice)
  //       .removeUndercollateralizationMark(alice.address)
  //   ).to.be.revertedWith("ShumLiquidation: still undercollateralized");

  //   // SHUM price goes to $0.1. Alice can now remove mark
  //   await setShumPrice(0.1);
  //   await expect(
  //     stack.shumLiquidation
  //       .connect(alice)
  //       .removeUndercollateralizationMark(alice.address)
  //   )
  //     .to.emit(stack.shumLiquidation, "PositionUnmarked")
  //     .withArgs(
  //       alice.address // user
  //     );
  // });

  // it("cannot liquidate position without mark", async () => {
  //   // Alice should be liquidated at $0.035
  //   await setShumPrice(0.035);

  //   await expect(
  //     stack.shumLiquidation.connect(bob).liquidatePosition(alice.address, 1, [])
  //   ).to.be.revertedWith("ShumLiquidation: not marked for undercollateralized");
  // });

  // it("can liquidate position only when delay is passed", async () => {
  //   // Alice gets marked for liquidation
  //   await setShumPrice(0.035);
  //   const markTime = (await getBlockDateTime(ethers.provider)).plus({
  //     days: 1,
  //   });
  //   await setNextBlockTimestamp(ethers.provider, markTime);
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .markPositionAsUndercollateralized(alice.address);

  //   // Cannot liquidate before delay is passed
  //   await setNextBlockTimestamp(
  //     ethers.provider,
  //     markTime.plus(liquidationDelay)
  //   );
  //   await expect(
  //     stack.shumLiquidation.connect(bob).liquidatePosition(alice.address, 1, [])
  //   ).to.be.revertedWith("ShumLiquidation: liquidation delay not passed");

  //   // Can liquidate after delay is passed
  //   await setNextBlockTimestamp(
  //     ethers.provider,
  //     markTime.plus(liquidationDelay).plus({ seconds: 1 })
  //   );
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .liquidatePosition(alice.address, 1, []);
  // });

  // it("cannot liquidate position even if delay is passed if C-ratio is restored", async () => {
  //   // Alice gets marked for liquidation
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .markPositionAsUndercollateralized(alice.address);
  //   await passLiquidationDelay();

  //   // C-ratio restored but mark is not removed
  //   await setShumPrice(0.1);

  //   // Position cannot be liquidated now
  //   await expect(
  //     stack.shumLiquidation.connect(bob).liquidatePosition(alice.address, 1, [])
  //   ).to.be.revertedWith("ShumLiquidation: not undercollateralized");

  //   // C-ratio falls below issuance ratio
  //   await setShumPrice(0.09);

  //   // Position can now be liquidated
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .liquidatePosition(alice.address, 1, []);
  // });

  // it("locked reward should be counted towards collateral for liquidation", async () => {
  //   // Alice is granted 1,000 locked SHUM
  //   await stack.shumRewardLocker.connect(admin).migrateRewards(
  //     [alice.address], // _users
  //     [expandTo18Decimals(1_000)], // _amounts
  //     [(await getBlockDateTime(ethers.provider)).plus({ years: 1 }).toSeconds()] // _lockTo
  //   );

  //   // Alice has 2,000 SHUM now, and will only be liquidated below $0.02
  //   await setShumPrice(0.02);
  //   await expect(
  //     stack.shumLiquidation
  //       .connect(bob)
  //       .markPositionAsUndercollateralized(alice.address)
  //   ).to.be.revertedWith("ShumLiquidation: not undercollateralized");

  //   // SHUM price drops to $0.019 and Alice can be liquidated
  //   await setShumPrice(0.019);
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .markPositionAsUndercollateralized(alice.address);
  // });

  // it("can liquidate up to the amount to restore C-ratio to issuance ratio", async () => {
  //   // Alice gets marked for liquidation
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .markPositionAsUndercollateralized(alice.address);
  //   await passLiquidationDelay();

  //   /**
  //    * Formula:
  //    *     Max lUSD to Burn = (Debt Balance - Collateral Value * Issuance Ratio) / (1 - (1 + Liquidation Reward) * Issuance Ratio)
  //    *
  //    * Calculation:
  //    *     Max lUSD to Burn = (20 - 0.035 * 1000 * 0.2) / (1 - (1 + 0.15) * 0.2) = 16.883116883116883116
  //    */
  //   const maxLusdToBurn = BigNumber.from("16883116883116883116");

  //   // Burning 1 unit more lUSD fails
  //   await expect(
  //     stack.shumLiquidation
  //       .connect(bob)
  //       .liquidatePosition(alice.address, maxLusdToBurn.add(1), [])
  //   ).to.be.revertedWith("ShumLiquidation: burn amount too large");

  //   // Can burn exactly the max amount
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .liquidatePosition(alice.address, maxLusdToBurn, []);

  //   // Mark is removed after buring the max amount
  //   expect(
  //     await stack.shumLiquidation.isPositionMarkedAsUndercollateralized(
  //       alice.address
  //     )
  //   ).to.equal(false);
  // });

  // it("can burn max amount directly without specifying concrete amount", async () => {
  //   // Same as last case
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .markPositionAsUndercollateralized(alice.address);
  //   await passLiquidationDelay();

  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .liquidatePositionMax(alice.address, []);

  //   // Mark is removed after buring the max amount
  //   expect(
  //     await stack.shumLiquidation.isPositionMarkedAsUndercollateralized(
  //       alice.address
  //     )
  //   ).to.equal(false);
  // });

  // it("liquidation of position backed by staked collateral only", async () => {
  //   // Alice gets marked for liquidation by Charlie
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(charlie)
  //     .markPositionAsUndercollateralized(alice.address);
  //   await passLiquidationDelay();

  //   // Bob liquidates Alice's position by burning 10 lUSD
  //   await expect(
  //     stack.shumLiquidation
  //       .connect(bob)
  //       .liquidatePosition(alice.address, expandTo18Decimals(10), [])
  //   )
  //     .to.emit(stack.shumLiquidation, "PositionLiquidated")
  //     .withArgs(
  //       alice.address, // user
  //       charlie.address, // marker
  //       bob.address, // liquidator
  //       expandTo18Decimals(10), // debtBurnt
  //       formatBytes32String("SHUM"), // collateralCurrency
  //       BigNumber.from("328571428571428571427"), // collateralWithdrawnFromStaked
  //       BigNumber.from(0), // collateralWithdrawnFromLocked
  //       BigNumber.from("14285714285714285714"), // markerReward
  //       BigNumber.from("28571428571428571428") // liquidatorReward
  //     );

  //   /**
  //    * Collateral withdrawal = 10 / 0.035 = 285.714285714285714285 SHUM
  //    * Marker reward = 285.714285714285714285 * 0.05 = 14.285714285714285714 SHUM
  //    * Liquidator reward = 285.714285714285714285 * 0.1 = 28.571428571428571428 SHUM
  //    * Total withdrawal = 285.714285714285714285 + 14.285714285714285714 + 28.571428571428571428 = 328.571428571428571427 SHUM
  //    *
  //    * Alice's balance = 1000 - 328.571428571428571427 = 671.428571428571428573 SHUM
  //    * Bob's balance = 1000000 + 285.714285714285714285 + 28.571428571428571428 = 1000314.285714285714285713 SHUM
  //    * Charlie's balance = 14.285714285714285714 SHUM
  //    */
  //   await assertUserLinaCollateral(
  //     alice.address,
  //     BigNumber.from("671428571428571428573"),
  //     BigNumber.from(0)
  //   );
  //   await assertUserLinaCollateral(
  //     bob.address,
  //     BigNumber.from("1000314285714285714285713"),
  //     BigNumber.from(0)
  //   );
  //   await assertUserLinaCollateral(
  //     charlie.address,
  //     BigNumber.from("14285714285714285714"),
  //     BigNumber.from(0)
  //   );
  // });

  // it("liquidation of position backed by 1 locked collateral entry only", async () => {
  //   // Change Alice's staked collateral to locked
  //   await changeStakedCollateralToLocked(alice, expandTo18Decimals(1_000));

  //   // Aggregate reward entries
  //   const aggregation = await buildAggregation();

  //   // The rest is the same as the last case. For calculations see the last case
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(charlie)
  //     .markPositionAsUndercollateralized(alice.address);
  //   await passLiquidationDelay();
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .liquidatePosition(alice.address, expandTo18Decimals(10), [1]);

  //   await assertUserLinaCollateral(
  //     alice.address,
  //     BigNumber.from(0),
  //     BigNumber.from("671428571428571428573")
  //   );
  //   await assertUserLinaCollateral(
  //     bob.address,
  //     BigNumber.from("1000000000000000000000000"),
  //     BigNumber.from("314285714285714285713")
  //   );
  //   await assertUserLinaCollateral(
  //     charlie.address,
  //     BigNumber.from(0),
  //     BigNumber.from("14285714285714285714")
  //   );

  //   assertIdenticalAggregation(aggregation, await buildAggregation());
  // });

  // it("staked collateral shared by withdrawal and reward", async () => {
  //   // Change 700 SHUM of Alice's staked collateral to locked
  //   await changeStakedCollateralToLocked(alice, expandTo18Decimals(700));

  //   // Aggregate reward entries
  //   const aggregation = await buildAggregation();

  //   // Same as last case
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(charlie)
  //     .markPositionAsUndercollateralized(alice.address);
  //   await passLiquidationDelay();
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .liquidatePosition(alice.address, expandTo18Decimals(10), [1]);

  //   /**
  //    * Collateral withdrawal = 285.714285714285714285 SHUM
  //    * Marker reward = 14.285714285714285714 SHUM
  //    * Liquidator reward = 28.571428571428571428 SHUM
  //    * Total reward = 14.285714285714285714 + 28.571428571428571428 = 42.857142857142857142 SHUM
  //    *
  //    * Collateral withdrawal is covered by staked collateral
  //    *
  //    * Reward from staked = 300 - 285.714285714285714285 = 14.285714285714285715 SHUM
  //    * Reward from locked = 42.857142857142857142 - 14.285714285714285715 = 28.571428571428571427 SHUM
  //    *
  //    * Marker reward from staked = 14.285714285714285715 * 14.285714285714285714 / 42.857142857142857142 = 4.761904761904761905 SHUM
  //    * Liquidator reward from staked = 14.285714285714285715 - 4.761904761904761905 = 9.523809523809523810 SHUM
  //    *
  //    * Marker reward from locked = 14.285714285714285714 - 4.761904761904761905 = 9.523809523809523809 SHUM
  //    * Liquidator reward from locked = 28.571428571428571427 - 9.523809523809523809 = 19.047619047619047618 SHUM
  //    *
  //    * Bob's staked balance = 1000000 + 285.714285714285714285 + 9.523809523809523810 = 1000295.238095238095238095 SHUM
  //    * Bob's locked balance = 19.047619047619047618 SHUM
  //    *
  //    * Charlie's staked balance = 4.761904761904761905 SHUM
  //    * Charlie's locked balance = 9.523809523809523809 SHUM
  //    */
  //   await assertUserLinaCollateral(
  //     alice.address,
  //     BigNumber.from(0),
  //     BigNumber.from("671428571428571428573")
  //   );
  //   await assertUserLinaCollateral(
  //     bob.address,
  //     BigNumber.from("1000295238095238095238095"),
  //     BigNumber.from("19047619047619047618")
  //   );
  //   await assertUserLinaCollateral(
  //     charlie.address,
  //     BigNumber.from("4761904761904761905"),
  //     BigNumber.from("9523809523809523809")
  //   );

  //   assertIdenticalAggregation(aggregation, await buildAggregation());
  // });

  // it("locked collateral shared by withdrawal and reward", async () => {
  //   // Change 800 SHUM of Alice's staked collateral to locked
  //   await changeStakedCollateralToLocked(alice, expandTo18Decimals(800));

  //   // Aggregate reward entries
  //   const aggregation = await buildAggregation();

  //   // Same as last case
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(charlie)
  //     .markPositionAsUndercollateralized(alice.address);
  //   await passLiquidationDelay();
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .liquidatePosition(alice.address, expandTo18Decimals(10), [1]);

  //   /**
  //    * Collateral withdrawal = 285.714285714285714285 SHUM
  //    * Marker reward = 14.285714285714285714 SHUM
  //    * Liquidator reward = 28.571428571428571428 SHUM
  //    * Total reward = 14.285714285714285714 + 28.571428571428571428 = 42.857142857142857142 SHUM
  //    *
  //    * Collateral withdrawal from staked = 200 SHUM
  //    * Collateral withdrawal from locked = 85.714285714285714285 SHUM
  //    *
  //    * Bob's staked balance = 1000000 + 200 = 1000200 SHUM
  //    * Bob's locked balance = 85.714285714285714285 + 28.571428571428571428 = 114.285714285714285713 SHUM
  //    *
  //    * Charlie's staked balance = 0 SHUM
  //    * Charlie's locked balance = 14.285714285714285714 SHUM
  //    */
  //   await assertUserLinaCollateral(
  //     alice.address,
  //     BigNumber.from(0),
  //     BigNumber.from("671428571428571428573")
  //   );
  //   await assertUserLinaCollateral(
  //     bob.address,
  //     BigNumber.from("1000200000000000000000000"),
  //     BigNumber.from("114285714285714285713")
  //   );
  //   await assertUserLinaCollateral(
  //     charlie.address,
  //     BigNumber.from("0"),
  //     BigNumber.from("14285714285714285714")
  //   );

  //   assertIdenticalAggregation(aggregation, await buildAggregation());
  // });

  // it("multiple reward entries", async () => {
  //   // Change 800 SHUM of Alice's staked collateral to locked but in batches
  //   for (let ind = 0; ind < 20; ind++) {
  //     await changeStakedCollateralToLocked(alice, expandTo18Decimals(40));
  //   }

  //   // Aggregate reward entries
  //   const aggregation = await buildAggregation();

  //   // Same as last case
  //   await setShumPrice(0.035);
  //   await stack.shumLiquidation
  //     .connect(charlie)
  //     .markPositionAsUndercollateralized(alice.address);
  //   await passLiquidationDelay();
  //   await stack.shumLiquidation
  //     .connect(bob)
  //     .liquidatePosition(alice.address, expandTo18Decimals(10), [1, 2, 3, 4]);

  //   // Same as last case
  //   await assertUserLinaCollateral(
  //     alice.address,
  //     BigNumber.from(0),
  //     BigNumber.from("671428571428571428573")
  //   );
  //   await assertUserLinaCollateral(
  //     bob.address,
  //     BigNumber.from("1000200000000000000000000"),
  //     BigNumber.from("114285714285714285713")
  //   );
  //   await assertUserLinaCollateral(
  //     charlie.address,
  //     BigNumber.from("0"),
  //     BigNumber.from("14285714285714285714")
  //   );

  //   assertIdenticalAggregation(aggregation, await buildAggregation());
  // });
});
