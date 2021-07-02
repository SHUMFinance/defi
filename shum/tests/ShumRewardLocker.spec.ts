import { ethers, waffle } from "hardhat";
import { expect, use } from "chai";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { formatBytes32String } = ethers.utils;

use(waffle.solidity);

describe("ShumRewardLocker", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress;

  let lnAccessControl: Contract, shumRewardLocker: Contract;

  const mockLinaAddress = "0x0000000000000000000000000000000000000001";

  beforeEach(async function () {
    [deployer, admin, alice, bob] = await ethers.getSigners();

    const LnAccessControl = await ethers.getContractFactory("LnAccessControl");
    const ShumRewardLocker = await ethers.getContractFactory("ShumRewardLocker");

    lnAccessControl = await LnAccessControl.deploy();
    await lnAccessControl.connect(deployer).__LnAccessControl_init(
      admin.address // admin
    );

    shumRewardLocker = await ShumRewardLocker.deploy();
    await shumRewardLocker.connect(deployer).__ShumRewardLocker_init(
      mockLinaAddress, // _linaTokenAddr
      lnAccessControl.address, // _accessCtrl
      admin.address // _admin
    );
  });

  it("only LOCK_REWARD role can add reward", async () => {
    await expect(
      shumRewardLocker.connect(alice).addReward(
        bob.address, // user
        10, // amount
        20 // unlockTime
      )
    ).to.be.revertedWith("ShumRewardLocker: not LOCK_REWARD role");

    await lnAccessControl.connect(admin).SetRoles(
      formatBytes32String("LOCK_REWARD"), // roleType
      [alice.address], // addresses
      [true] // setTo
    );

    await expect(
      shumRewardLocker.connect(alice).addReward(
        bob.address, // user
        10, // amount
        20 // unlockTime
      )
    )
      .to.emit(shumRewardLocker, "RewardEntryAdded")
      .withArgs(
        1, //entryId
        bob.address, // user
        10, // amount
        20 // unlockTime
      );

    const rewardEntry = await shumRewardLocker.rewardEntries(1, bob.address);
    expect(rewardEntry.amount).to.equal(10);
    expect(rewardEntry.unlockTime).to.equal(20);

    expect(await shumRewardLocker.lockedAmountByAddresses(bob.address)).to.equal(
      10
    );
    expect(await shumRewardLocker.totalLockedAmount()).to.equal(10);
  });

  it("only admin can migrate rewards", async () => {
    await expect(
      shumRewardLocker.connect(alice).migrateRewards(
        [alice.address, bob.address], // users
        [10, 20], // amounts
        [30, 40] // unlockTimes
      )
    ).to.be.revertedWith(
      "ShumAdminUpgradeable: only the contract admin can perform this action"
    );

    await expect(
      shumRewardLocker.connect(admin).migrateRewards(
        [alice.address, bob.address], // users
        [10, 20], // amounts
        [30, 40] // unlockTimes
      )
    )
      .to.emit(shumRewardLocker, "RewardEntryAdded")
      .withArgs(
        1, //entryId
        alice.address, // user
        10, // amount
        30 // unlockTime
      )
      .and.emit(shumRewardLocker, "RewardEntryAdded")
      .withArgs(
        2, //entryId
        bob.address, // user
        20, // amount
        40 // unlockTime
      );

    const aliceEntry = await shumRewardLocker.rewardEntries(1, alice.address);
    expect(aliceEntry.amount).to.equal(10);
    expect(aliceEntry.unlockTime).to.equal(30);

    const bobEntry = await shumRewardLocker.rewardEntries(2, bob.address);
    expect(bobEntry.amount).to.equal(20);
    expect(bobEntry.unlockTime).to.equal(40);

    expect(
      await shumRewardLocker.lockedAmountByAddresses(alice.address)
    ).to.equal(10);
    expect(await shumRewardLocker.lockedAmountByAddresses(bob.address)).to.equal(
      20
    );
    expect(await shumRewardLocker.totalLockedAmount()).to.equal(30);
  });

  it("reward amount cannot overflow", async () => {
    const uint216Max = BigNumber.from("0x" + "f".repeat(216 / 4));

    // Allow Alice to add reward
    await lnAccessControl.connect(admin).SetRoles(
      formatBytes32String("LOCK_REWARD"), // roleType
      [alice.address], // addresses
      [true] // setTo
    );

    await expect(
      shumRewardLocker.connect(alice).addReward(
        alice.address, // user
        uint216Max.add(1), // amount
        10 // unlockTime
      )
    ).to.revertedWith("ShumRewardLocker: reward amount overflow");

    await shumRewardLocker.connect(alice).addReward(
      alice.address, // user
      uint216Max, // amount
      10 // unlockTime
    );
  });

  it("unlock time cannot overflow", async () => {
    const uint40Max = BigNumber.from("0x" + "f".repeat(40 / 4));

    // Allow Alice to add reward
    await lnAccessControl.connect(admin).SetRoles(
      formatBytes32String("LOCK_REWARD"), // roleType
      [alice.address], // addresses
      [true] // setTo
    );

    await expect(
      shumRewardLocker.connect(alice).addReward(
        alice.address, // user
        10, // amount
        uint40Max.add(1) // unlockTime
      )
    ).to.revertedWith("ShumRewardLocker: unlock time overflow");

    await shumRewardLocker.connect(alice).addReward(
      alice.address, // user
      10, // amount
      uint40Max // unlockTime
    );
  });
});
