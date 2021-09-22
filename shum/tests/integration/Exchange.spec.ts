import { DateTime, Duration } from "luxon";
import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { expandTo18Decimals, uint256Max } from "../utilities";
import { deployLinearStack, DeployedStack } from "../utilities/init";
import {
  getBlockDateTime,
  setNextBlockTimestamp,
} from "../utilities/timeTravel";

describe("Integration | Exchange", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    settler: SignerWithAddress;

  let stack: DeployedStack;

  const settlementDelay: Duration = Duration.fromObject({ minutes: 1 });
  const revertDelay: Duration = Duration.fromObject({ minutes: 10 });
  const stalePeriod: Duration = Duration.fromObject({ hours: 12 });
  let priceUpdateTime: DateTime;

  const setLbtcPrice = async (price: number): Promise<void> => {
    await stack.shumPrices.connect(admin).setPrice(
      ethers.utils.formatBytes32String("sBTC"), // currencyKey
      expandTo18Decimals(price) // price
    );
  };

  const passSettlementDelay = async (): Promise<void> => {
    await setNextBlockTimestamp(
      ethers.provider,
      (await getBlockDateTime(ethers.provider)).plus(settlementDelay)
    );
  };

  const settleTrade = (entryId: number): Promise<any> => {
    return stack.shumExchangeSystem.connect(settler).settle(
      entryId // pendingExchangeEntryId
    );
  };

  const settleTradeWithDelay = async (entryId: number): Promise<any> => {
    await passSettlementDelay();
    await settleTrade(entryId);
  };

  beforeEach(async function () {
    [deployer, alice, bob, settler] = await ethers.getSigners();
    
    admin = deployer;

    stack = await deployLinearStack(deployer, admin);

    priceUpdateTime = await getBlockDateTime(ethers.provider);

    // Set SHUM price to $0.01 and sBTC to $20,000
    await stack.shumPrices.connect(admin).setPriceAndTime(
      ethers.utils.formatBytes32String("SHUM"), // currencyKey
      expandTo18Decimals(0.01), // price
      priceUpdateTime.toSeconds() // updateTime
    );

    await stack.shumPrices.connect(admin).setPriceAndTime(
      ethers.utils.formatBytes32String("sBTC"), // currencyKey
      expandTo18Decimals(20_000), // price
      priceUpdateTime.toSeconds() // updateTime
    );

    // Set BTC exchange fee rate to 1%
    await stack.shumConfig.connect(admin).setUint(
      ethers.utils.formatBytes32String("sBTC"), // key
      expandTo18Decimals(0.01) // value
    );

    // Set settlement delay
    await stack.shumConfig.connect(admin).setUint(
      ethers.utils.formatBytes32String("TradeSettlementDelay"), // key
      settlementDelay.as("seconds")
    );

    // Set revert delay
    await stack.shumConfig.connect(admin).setUint(
      ethers.utils.formatBytes32String("TradeRevertDelay"), // key
      revertDelay.as("seconds")
    );

    // Mint 1,000,000 Shum to Alice
    await stack.shumToken
      .connect(admin)
      .mint(alice.address, expandTo18Decimals(1_000_000));

    // Alice stakes all Shum
    await stack.shumToken
      .connect(alice)
      .approve(stack.shumCollateralSystem.address, uint256Max);
    await stack.shumCollateralSystem.connect(alice).Collateral(
      ethers.utils.formatBytes32String("SHUM"), // _currency
      expandTo18Decimals(1_000_000) // _amount
    );

    // Alice builds 1,000 sUSD
    await stack.shumBuildBurnSystem.connect(alice).BuildAsset(
      expandTo18Decimals(1_000) // amount
    );

  });

  it("fee not splitted when fee holder is not set", async () => {

    // Set fee split ratio to 30%
    await stack.shumConfig.connect(admin).setUint(
      ethers.utils.formatBytes32String("FoundationFeeSplit"), // key
      expandTo18Decimals(0.3) // value
    );

    // Alice exchanges 500 sUSD for 0.025 sBTC
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );

    await settleTradeWithDelay(1);

    // All fees (0.025 * 0.01 * 20000 = 5) go to pool
    expect(
      await stack.susdToken.balanceOf(stack.shumRewardSystem.address)
    ).to.equal(expandTo18Decimals(5));

    // Proceedings after fees: 500 / 20000 * (1 - 0.01) = 0.02475 BTC
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(500)
    );
    expect(await stack.sbtcToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(0.02475)
    );

  });


  
  it("fee not splitted when split ratio is not set", async () => {
    // Set fee holder to bob
    await stack.shumExchangeSystem.connect(admin).setFoundationFeeHolder(
      bob.address // _foundationFeeHolder
    );

    // Alice exchanges 500 sUSD for 0.025 sBTC
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );
    await settleTradeWithDelay(1);

    // All fees (0.025 * 0.01 * 20000 = 5) go to pool
    expect(
      await stack.susdToken.balanceOf(stack.shumRewardSystem.address)
    ).to.equal(expandTo18Decimals(5));
    expect(await stack.susdToken.balanceOf(bob.address)).to.equal(0);

    // Proceedings after fees: 500 / 20000 * (1 - 0.01) = 0.02475 BTC
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(500)
    );
    expect(await stack.sbtcToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(0.02475)
    );
  });

  it("fee splitted to pool and foundation", async () => {
    // Set fee split ratio to 30%
    await stack.shumConfig.connect(admin).setUint(
      ethers.utils.formatBytes32String("FoundationFeeSplit"), // key
      expandTo18Decimals(0.3) // value
    );

    // Set fee holder to bob
    await stack.shumExchangeSystem.connect(admin).setFoundationFeeHolder(
      bob.address // _foundationFeeHolder
    );

    // Alice exchanges 500 sUSD for 0.025 sBTC
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );
    await passSettlementDelay();
    await expect(settleTrade(1))
      .to.emit(stack.shumExchangeSystem, "PendingExchangeSettled")
      .withArgs(
        1, // id
        settler.address, // settler
        expandTo18Decimals(0.02475), // destRecived
        expandTo18Decimals(3.5), // feeForPool
        expandTo18Decimals(1.5) // feeForFoundation
      );

    /**
     * Fee split:
     *   Total = 0.025 * 0.01 * 20000 = 5 sUSD
     *   Foundation = 5 * 0.3 = 1.5 sUSD
     *   Pool = 5 - 1.5 = 3.5 sUSD
     */
    expect(
      await stack.susdToken.balanceOf(stack.shumRewardSystem.address)
    ).to.equal(expandTo18Decimals(3.5));
    expect(await stack.susdToken.balanceOf(bob.address)).to.equal(
      expandTo18Decimals(1.5)
    );

    // Proceedings after fees: 500 / 20000 * (1 - 0.01) = 0.02475 BTC
    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(500)
    );
    expect(await stack.sbtcToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(0.02475)
    );
  });

  it("cannot settle when price is staled", async () => {
    const exchangeAction = () =>
      stack.shumExchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("sUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("sBTC") // destKey
      );

    // Temporarily set delay to avoid settlement issue
    await stack.shumConfig.connect(admin).setUint(
      ethers.utils.formatBytes32String("TradeRevertDelay"), // key
      Duration.fromObject({ days: 10 }).as("seconds")
    );

    // Make 2 exchanges
    await exchangeAction();
    await exchangeAction();

    // Can settle when price is not staled
    await setNextBlockTimestamp(
      ethers.provider,
      priceUpdateTime.plus(stalePeriod)
    );
    await settleTrade(1);

    // Cannot settle once price becomes staled
    await setNextBlockTimestamp(
      ethers.provider,
      priceUpdateTime.plus(stalePeriod).plus({ seconds: 1 })
    );


    await expect(settleTrade(2)).to.be.revertedWith(
      "MockShumPrices: staled price data"
    );



  });

  it("can sell when position entrance is disabled", async () => {
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );
    await settleTradeWithDelay(1);

    await stack.shumExchangeSystem.connect(admin).setExitPositionOnly(true);

    // Can still sell
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sBTC"), // sourceKey
      expandTo18Decimals(0.01), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sUSD") // destKey
    );
  });

  it("cannot buy when position entrance is disabled", async () => {
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );

    await stack.shumExchangeSystem.connect(admin).setExitPositionOnly(true);

    // Can no longer buy
    await expect(
      stack.shumExchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("sUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("sBTC") // destKey
      )
    ).to.be.revertedWith("ShumExchangeSystem: can only exit position");
  });

  it("events should be emitted for exchange and settlement", async () => {
    await expect(
      stack.shumExchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("sUSD"), // sourceKey
        expandTo18Decimals(500), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("sBTC") // destKey
      )
    )
      .to.emit(stack.shumExchangeSystem, "PendingExchangeAdded")
      .withArgs(
        1, // id
        alice.address, // fromAddr
        alice.address, // destAddr
        expandTo18Decimals(500), // fromAmount
        ethers.utils.formatBytes32String("sUSD"), // fromCurrency
        ethers.utils.formatBytes32String("sBTC") // toCurrency
      );

    /**
     * sBTC price changes to 40,000. Will only receive:
     *     500 / 40000 * 0.99 = 0.012375 sBTC
     */
    await passSettlementDelay();
    await setLbtcPrice(40_000);

    await expect(settleTrade(1))
      .to.emit(stack.shumExchangeSystem, "PendingExchangeSettled")
      .withArgs(
        1, // id
        settler.address, // settler
        expandTo18Decimals(0.012375), // destRecived
        expandTo18Decimals(5), // feeForPool
        0 // feeForFoundation
      );
  });

  it("cannot settle trade before delay is passed", async () => {
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );

    // Cannot settle before delay is reached
    await setNextBlockTimestamp(
      ethers.provider,
      (await getBlockDateTime(ethers.provider))
        .plus(settlementDelay)
        .minus({ seconds: 1 })
    );
    await expect(settleTrade(1)).to.be.revertedWith(
      "ShumExchangeSystem: settlement delay not passed"
    );

    // Can settle once delay is reached
    await setNextBlockTimestamp(
      ethers.provider,
      (await getBlockDateTime(ethers.provider)).plus(settlementDelay)
    );
    await settleTrade(1);
  });

  it("source asset should be locked up on exchange", async () => {
    await expect(
      stack.shumExchangeSystem.connect(alice).exchange(
        ethers.utils.formatBytes32String("sUSD"), // sourceKey
        expandTo18Decimals(400), // sourceAmount
        alice.address, // destAddr
        ethers.utils.formatBytes32String("sBTC") // destKey
      )
    )
      .to.emit(stack.susdToken, "Transfer")
      .withArgs(
        alice.address, // from
        stack.shumExchangeSystem.address, // to
        expandTo18Decimals(400) // value
      );

    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(600)
    );
    expect(
      await stack.susdToken.balanceOf(stack.shumExchangeSystem.address)
    ).to.equal(expandTo18Decimals(400));
  });

  it("trade cannot be settled twice", async () => {
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );

    // Trade settled
    await settleTradeWithDelay(1);

    // Cannot double-settle a trade
    await expect(settleTrade(1)).to.be.revertedWith(
      "ShumExchangeSystem: pending entry not found"
    );
  });

  it("can only revert trade after revert delay", async () => {
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );

    const exchangeTime = await getBlockDateTime(ethers.provider);

    await setNextBlockTimestamp(
      ethers.provider,
      exchangeTime.plus(revertDelay)
    );
    await expect(
      stack.shumExchangeSystem.connect(settler).revert(
        1 // pendingExchangeEntryId
      )
    ).to.be.revertedWith("ShumExchangeSystem: revert delay not passed");

    await setNextBlockTimestamp(
      ethers.provider,
      exchangeTime.plus(revertDelay).plus({ seconds: 1 })
    );
    await expect(
      stack.shumExchangeSystem.connect(settler).revert(
        1 // pendingExchangeEntryId
      )
    )
      .to.emit(stack.shumExchangeSystem, "PendingExchangeReverted")
      .withArgs(
        1 // id
      )
      .and.emit(stack.susdToken, "Transfer")
      .withArgs(
        stack.shumExchangeSystem.address, // from
        alice.address, // to
        expandTo18Decimals(500) // value
      );

    expect(await stack.susdToken.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(1_000)
    );
    expect(
      await stack.susdToken.balanceOf(stack.shumExchangeSystem.address)
    ).to.equal(0);
  });

  it("cannot settle trade after revert delay", async () => {
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );

    const exchangeTime = await getBlockDateTime(ethers.provider);

    await setNextBlockTimestamp(
      ethers.provider,
      exchangeTime.plus(revertDelay).plus({ seconds: 1 })
    );
    await expect(settleTrade(1)).to.be.revertedWith(
      "ShumExchangeSystem: trade can only be reverted now"
    );
  });

  it("cannot revert trade twice", async () => {
    await stack.shumExchangeSystem.connect(alice).exchange(
      ethers.utils.formatBytes32String("sUSD"), // sourceKey
      expandTo18Decimals(500), // sourceAmount
      alice.address, // destAddr
      ethers.utils.formatBytes32String("sBTC") // destKey
    );

    const exchangeTime = await getBlockDateTime(ethers.provider);

    await setNextBlockTimestamp(
      ethers.provider,
      exchangeTime.plus(revertDelay).plus({ seconds: 1 })
    );
    await stack.shumExchangeSystem.connect(settler).revert(
      1 // pendingExchangeEntryId
    );

    // Cannot revert again
    await expect(
      stack.shumExchangeSystem.connect(settler).revert(
        1 // pendingExchangeEntryId
      )
    ).to.be.revertedWith("ShumExchangeSystem: pending entry not found");
  });
});
