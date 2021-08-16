import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { expandTo18Decimals } from "../utilities";
import { DeployedStack, deployLinearStack } from "../utilities/init";

describe("Integration | Merge API: Stake/Build and Burn/Unstake", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress;

  let stack: DeployedStack;

  beforeEach(async function () {
    [deployer, alice] = await ethers.getSigners();
    admin = deployer;

    stack = await deployLinearStack(deployer, admin);

    // Set SHUM price to $0.01
    await stack.shumPrices.connect(admin).setPrice(
      ethers.utils.formatBytes32String("SHUM"), // currencyKey
      expandTo18Decimals(0.01) // price
    );

    // Mint and approve 10,000 SHUM for Alice
    await stack.shumToken.connect(admin).mint(
      alice.address, // account
      expandTo18Decimals(10_000) // amounts
    );
    await stack.shumToken.connect(alice).approve(
      stack.shumCollateralSystem.address, // spender
      expandTo18Decimals(10_000) // amount
    );
  });

  it("can stake without building", async function () {
    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(10_000)
    );
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(0);

    // Alice can stake SHUM without building sUSD
    await expect(
      stack.shumCollateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        0 // buildAmount
      )
    )
      .to.emit(stack.shumCollateralSystem, "CollateralLog")
      .and.not.emit(stack.shumDebtSystem, "PushDebtLog");

    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(0);
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(0);

    expect(
      await stack.shumCollateralSystem.GetUserCollateral(
        alice.address, // _user
        ethers.utils.formatBytes32String("SHUM") // _currency
      )
    ).to.equal(expandTo18Decimals(10_000));
    expect(
      (
        await stack.shumDebtSystem.GetUserDebtBalanceInUsd(
          alice.address // _user
        )
      )[0]
    ).to.equal(0);
  });

  it("can build without staking", async function () {
    await stack.shumCollateralSystem.connect(alice).stakeAndBuild(
      ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
      expandTo18Decimals(10_000), // stakeAmount
      0 // buildAmount
    );

    await expect(
      stack.shumCollateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
        0, // stakeAmount
        expandTo18Decimals(10) // buildAmount
      )
    )
      .to.emit(stack.shumDebtSystem, "PushDebtLog")
      .and.not.emit(stack.shumCollateralSystem, "CollateralLog");

    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(0);
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(10)
    );

    expect(
      await stack.shumCollateralSystem.GetUserCollateral(
        alice.address, // _user
        ethers.utils.formatBytes32String("SHUM") // _currency
      )
    ).to.equal(expandTo18Decimals(10_000));
    expect(
      (
        await stack.shumDebtSystem.GetUserDebtBalanceInUsd(
          alice.address // _user
        )
      )[0]
    ).to.equal(expandTo18Decimals(10));
  });

  it("can stake and build atomically", async function () {
    await expect(
      stack.shumCollateralSystem.connect(alice).stakeAndBuild(
        ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
        expandTo18Decimals(10_000), // stakeAmount
        expandTo18Decimals(10) // buildAmount
      )
    )
      .to.emit(stack.shumCollateralSystem, "CollateralLog")
      .and.emit(stack.shumDebtSystem, "PushDebtLog");

    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(0);
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(10)
    );

    expect(
      await stack.shumCollateralSystem.GetUserCollateral(
        alice.address, // _user
        ethers.utils.formatBytes32String("SHUM") // _currency
      )
    ).to.equal(expandTo18Decimals(10_000));
    expect(
      (
        await stack.shumDebtSystem.GetUserDebtBalanceInUsd(
          alice.address // _user
        )
      )[0]
    ).to.equal(expandTo18Decimals(10));
  });

  it("can stake and build max atomically", async function () {
    // sUSD = 10,000 * 0.01 * 0.2 = 20
    await expect(
      stack.shumCollateralSystem.connect(alice).stakeAndBuildMax(
        ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
        expandTo18Decimals(10_000) // stakeAmount
      )
    )
      .to.emit(stack.shumCollateralSystem, "CollateralLog")
      .and.emit(stack.shumDebtSystem, "PushDebtLog");

    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(0);
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(20)
    );

    expect(
      await stack.shumCollateralSystem.GetUserCollateral(
        alice.address, // _user
        ethers.utils.formatBytes32String("SHUM") // _currency
      )
    ).to.equal(expandTo18Decimals(10_000));
    expect(
      (
        await stack.shumDebtSystem.GetUserDebtBalanceInUsd(
          alice.address // _user
        )
      )[0]
    ).to.equal(expandTo18Decimals(20));
  });

  it("can burn without unstaking", async function () {
    // Alice stakes 10,000 SHUM and builds 20 sUSD
    await stack.shumCollateralSystem.connect(alice).stakeAndBuildMax(
      ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
      expandTo18Decimals(10_000) // stakeAmount
    );

    await expect(
      stack.shumCollateralSystem.connect(alice).burnAndUnstake(
        expandTo18Decimals(10), // burnAmount
        ethers.utils.formatBytes32String("SHUM"), // unstakeCurrency
        0 // unstakeAmount
      )
    )
      .to.emit(stack.shumDebtSystem, "PushDebtLog")
      .and.not.emit(stack.shumCollateralSystem, "RedeemCollateral");

    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(0);
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(10)
    );

    expect(
      await stack.shumCollateralSystem.GetUserCollateral(
        alice.address, // _user
        ethers.utils.formatBytes32String("SHUM") // _currency
      )
    ).to.equal(expandTo18Decimals(10_000));
    expect(
      (
        await stack.shumDebtSystem.GetUserDebtBalanceInUsd(
          alice.address // _user
        )
      )[0]
    ).to.equal(expandTo18Decimals(10));
  });

  it("can unstake without burning", async function () {
    // Alice stakes 10,000 SHUM and builds 10 sUSD
    await stack.shumCollateralSystem.connect(alice).stakeAndBuild(
      ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
      expandTo18Decimals(10_000), // stakeAmount
      expandTo18Decimals(10) // buildAmount
    );

    await expect(
      stack.shumCollateralSystem.connect(alice).burnAndUnstake(
        0, // burnAmount
        ethers.utils.formatBytes32String("SHUM"), // unstakeCurrency
        expandTo18Decimals(4_000) // unstakeAmount
      )
    )
      .to.emit(stack.shumCollateralSystem, "RedeemCollateral")
      .and.not.emit(stack.shumDebtSystem, "PushDebtLog");

    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(4_000)
    );
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(10)
    );

    expect(
      await stack.shumCollateralSystem.GetUserCollateral(
        alice.address, // _user
        ethers.utils.formatBytes32String("SHUM") // _currency
      )
    ).to.equal(expandTo18Decimals(6_000));
    expect(
      (
        await stack.shumDebtSystem.GetUserDebtBalanceInUsd(
          alice.address // _user
        )
      )[0]
    ).to.equal(expandTo18Decimals(10));
  });

  it("can burn and unstake atomically", async function () {
    // Alice stakes 10,000 SHUM and builds 20 sUSD
    await stack.shumCollateralSystem.connect(alice).stakeAndBuildMax(
      ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
      expandTo18Decimals(10_000) // stakeAmount
    );

    await expect(
      stack.shumCollateralSystem.connect(alice).burnAndUnstake(
        expandTo18Decimals(10), // burnAmount
        ethers.utils.formatBytes32String("SHUM"), // unstakeCurrency
        expandTo18Decimals(2_000) // unstakeAmount
      )
    )
      .to.emit(stack.shumDebtSystem, "PushDebtLog")
      .and.emit(stack.shumCollateralSystem, "RedeemCollateral");

    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(2_000)
    );
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(10)
    );

    expect(
      await stack.shumCollateralSystem.GetUserCollateral(
        alice.address, // _user
        ethers.utils.formatBytes32String("SHUM") // _currency
      )
    ).to.equal(expandTo18Decimals(8_000));
    expect(
      (
        await stack.shumDebtSystem.GetUserDebtBalanceInUsd(
          alice.address // _user
        )
      )[0]
    ).to.equal(expandTo18Decimals(10));
  });

  it("can burn and unstake max atomically", async function () {
    // Alice stakes 10,000 SHUM and builds 20 sUSD
    await stack.shumCollateralSystem.connect(alice).stakeAndBuildMax(
      ethers.utils.formatBytes32String("SHUM"), // stakeCurrency
      expandTo18Decimals(10_000) // stakeAmount
    );

    await expect(
      stack.shumCollateralSystem.connect(alice).burnAndUnstakeMax(
        expandTo18Decimals(5), // burnAmount
        ethers.utils.formatBytes32String("SHUM") // unstakeCurrency
      )
    )
      .to.emit(stack.shumDebtSystem, "PushDebtLog")
      .and.emit(stack.shumCollateralSystem, "RedeemCollateral");

    expect(await stack.shumToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(2_500)
    );
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(15)
    );

    expect(
      await stack.shumCollateralSystem.GetUserCollateral(
        alice.address, // _user
        ethers.utils.formatBytes32String("SHUM") // _currency
      )
    ).to.equal(expandTo18Decimals(7_500));
    expect(
      (
        await stack.shumDebtSystem.GetUserDebtBalanceInUsd(
          alice.address // _user
        )
      )[0]
    ).to.equal(expandTo18Decimals(15));
  });
});
