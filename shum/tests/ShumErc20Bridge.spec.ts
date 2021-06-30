import { ethers, waffle } from "hardhat";
import { expect, use } from "chai";
import { BigNumber, Contract, Signature, Wallet } from "ethers";
import {
  formatBytes32String,
  hexlify,
  splitSignature,
  zeroPad,
} from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expandTo18Decimals, uint256Max, zeroAddress } from "./utilities";

use(waffle.solidity);

const TOKEN_LOCK_TYPE_TRANSFER: number = 1;
const TOKEN_LOCK_TYPE_MINT_BURN: number = 2;

describe("ShumErc20Bridge", function () {
  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    relayer: Wallet;

  let shum: Contract, lusd: Contract, shumErc20Bridge: Contract;

  let currentChainId: BigNumber,
    mockChainId: BigNumber = BigNumber.from(9999);

  const createSignature = async (
    signer: Wallet,
    srcChainId: BigNumber,
    destChainId: BigNumber,
    depositId: BigNumber,
    depositor: string,
    recipient: string,
    currency: string,
    amount: BigNumber
  ): Promise<string> => {
    const domain = {
      name: "Shum",
      version: "1",
      chainId: (await ethers.provider.getNetwork()).chainId,
      verifyingContract: shumErc20Bridge.address,
    };

    const types = {
      Deposit: [
        { name: "srcChainId", type: "uint256" },
        { name: "destChainId", type: "uint256" },
        { name: "depositId", type: "uint256" },
        { name: "depositor", type: "bytes32" },
        { name: "recipient", type: "bytes32" },
        { name: "currency", type: "bytes32" },
        { name: "amount", type: "uint256" },
      ],
    };

    const value = {
      srcChainId,
      destChainId,
      depositId,
      depositor,
      recipient,
      currency,
      amount,
    };

    const signatureHex = await signer._signTypedData(domain, types, value);

    return signatureHex;
  };

  beforeEach(async function () {
    [deployer, admin, alice, bob] = await ethers.getSigners();
    
    relayer = Wallet.createRandom();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const ShumErc20Bridge = await ethers.getContractFactory("ShumErc20Bridge");

    currentChainId = BigNumber.from(
      (await ethers.provider.getNetwork()).chainId
    );
    //console.log(currentChainId);

    shum = await MockERC20.deploy(
      "Shum Token", // _name
      "Shum" // _symbol
    );
    lusd = await MockERC20.deploy(
      "lUSD", // _name
      "lUSD" // _symbol
    );

    shumErc20Bridge = await ShumErc20Bridge.deploy();
    await shumErc20Bridge.connect(deployer).__ShumErc20Bridge_init(
      relayer.address, // _relayer
      admin.address // _admin
    );

    // Bridge does NOT need to hold any lUSD (mint/burn mode)
    await shum
      .connect(deployer)
      .mint(alice.address, expandTo18Decimals(1_000_000));
    await shum
      .connect(deployer)
      .mint(shumErc20Bridge.address, expandTo18Decimals(1_000_000));
    await lusd
      .connect(deployer)
      .mint(alice.address, expandTo18Decimals(1_000_000));

    await shum.connect(alice).approve(shumErc20Bridge.address, uint256Max);

    await shumErc20Bridge.connect(admin).addToken(
      formatBytes32String("Shum"), // tokenKey
      shum.address, // tokenAddress
      TOKEN_LOCK_TYPE_TRANSFER // lockType
    );
    await shumErc20Bridge.connect(admin).addToken(
      formatBytes32String("lUSD"), // tokenKey
      lusd.address, // tokenAddress
      TOKEN_LOCK_TYPE_MINT_BURN // lockType
    );
    await shumErc20Bridge.connect(admin).addChainSupportForToken(
      formatBytes32String("Shum"), // tokenKey
      mockChainId // chainId
    );
    await shumErc20Bridge.connect(admin).addChainSupportForToken(
      formatBytes32String("lUSD"), // tokenKey
      mockChainId // chainId
    );
  });

  it("cannot deposit with unsupported token", async () => {
    await expect(
      shumErc20Bridge.connect(alice).deposit(
        formatBytes32String("NOTFOUND"), // token
        expandTo18Decimals(1_000), // amount
        mockChainId, // destChainId
        hexlify(zeroPad(alice.address, 32)) // recipient
      )
    ).to.revertedWith("ShumErc20Bridge: token not found");
  });

  it("cannot deposit for unsupported chain", async () => {
    await expect(
      shumErc20Bridge.connect(alice).deposit(
        formatBytes32String("Shum"), // token
        expandTo18Decimals(1_000), // amount
        BigNumber.from(8888), // destChainId
        hexlify(zeroPad(alice.address, 32)) // recipient
      )
    ).to.revertedWith("ShumErc20Bridge: token not supported on chain");
  });

  it("token tranferred on deposit of token in transfer mode", async () => {
    await expect(
      shumErc20Bridge.connect(alice).deposit(
        formatBytes32String("Shum"), // token
        expandTo18Decimals(1_000), // amount
        mockChainId, // destChainId
        hexlify(zeroPad(alice.address, 32)) // recipient
      )
    )
      .to.emit(shum, "Transfer")
      .withArgs(alice.address, shumErc20Bridge.address, expandTo18Decimals(1_000))
      .and.emit(shumErc20Bridge, "TokenDeposited")
      .withArgs(
        currentChainId, // srcChainId
        mockChainId, // destChainId
        1, // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("Shum"), // currency
        expandTo18Decimals(1_000) // amount
      );

    expect(await shum.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(999_000)
    );
    expect(await shum.balanceOf(shumErc20Bridge.address)).to.equal(
      expandTo18Decimals(1_001_000)
    );
  });

  it("token burnt on deposit of token in mint/burn mode", async () => {
    await expect(
      shumErc20Bridge.connect(alice).deposit(
        formatBytes32String("lUSD"), // token
        expandTo18Decimals(1_000), // amount
        mockChainId, // destChainId
        hexlify(zeroPad(alice.address, 32)) // recipient
      )
    )
      .to.emit(lusd, "Transfer")
      .withArgs(alice.address, zeroAddress, expandTo18Decimals(1_000))
      .and.emit(shumErc20Bridge, "TokenDeposited")
      .withArgs(
        currentChainId, // srcChainId
        mockChainId, // destChainId
        1, // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("lUSD"), // currency
        expandTo18Decimals(1_000) // amount
      );

    expect(await lusd.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(999_000)
    );
    expect(await lusd.balanceOf(shumErc20Bridge.address)).to.equal(0);
  });

  it("cannot withdraw with invalid signature", async () => {
    // Signature with wrong depositId
    const signature = await createSignature(
      relayer, // signer
      mockChainId, // srcChainId
      currentChainId, // destChainId
      BigNumber.from(999), // depositId
      hexlify(zeroPad(alice.address, 32)), // depositor
      hexlify(zeroPad(alice.address, 32)), // recipient
      formatBytes32String("Shum"), // currency
      expandTo18Decimals(1_000) // amount
    );

    await expect(
      shumErc20Bridge.connect(alice).withdraw(
        mockChainId, // srcChainId
        currentChainId, // destChainId
        BigNumber.from(1), // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("Shum"), // currency
        expandTo18Decimals(1000), // amount
        signature // signature
      )
    ).to.revertedWith("ShumErc20Bridge: invalid signature");
  });

  it("token tranferred on withdrawal of token in transfer mode", async () => {
    const signature = await createSignature(
      relayer, // signer
      mockChainId, // srcChainId
      currentChainId, // destChainId
      BigNumber.from(1), // depositId
      hexlify(zeroPad(alice.address, 32)), // depositor
      hexlify(zeroPad(alice.address, 32)), // recipient
      formatBytes32String("Shum"), // currency
      expandTo18Decimals(1_000) // amount
    );

    await expect(
      shumErc20Bridge.connect(alice).withdraw(
        mockChainId, // srcChainId
        currentChainId, // destChainId
        BigNumber.from(1), // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("Shum"), // currency
        expandTo18Decimals(1000), // amount
        signature // signature
      )
    )
      .to.emit(shum, "Transfer")
      .withArgs(shumErc20Bridge.address, alice.address, expandTo18Decimals(1_000))
      .and.emit(shumErc20Bridge, "TokenWithdrawn")
      .withArgs(
        mockChainId, // srcChainId
        currentChainId, // destChainId
        1, // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("Shum"), // currency
        expandTo18Decimals(1_000) // amount
      );

    expect(await shum.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(1_001_000)
    );
    expect(await shum.balanceOf(shumErc20Bridge.address)).to.equal(
      expandTo18Decimals(999_000)
    );
  });

  it("token minted on withdrawal of token in mint/burn mode", async () => {
    const signature = await createSignature(
      relayer, // signer
      mockChainId, // srcChainId
      currentChainId, // destChainId
      BigNumber.from(1), // depositId
      hexlify(zeroPad(alice.address, 32)), // depositor
      hexlify(zeroPad(alice.address, 32)), // recipient
      formatBytes32String("lUSD"), // currency
      expandTo18Decimals(1_000) // amount
    );

    await expect(
      shumErc20Bridge.connect(alice).withdraw(
        mockChainId, // srcChainId
        currentChainId, // destChainId
        BigNumber.from(1), // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("lUSD"), // currency
        expandTo18Decimals(1000), // amount
        signature // signature
      )
    )
      .to.emit(lusd, "Transfer")
      .withArgs(zeroAddress, alice.address, expandTo18Decimals(1_000))
      .and.emit(shumErc20Bridge, "TokenWithdrawn")
      .withArgs(
        mockChainId, // srcChainId
        currentChainId, // destChainId
        1, // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("lUSD"), // currency
        expandTo18Decimals(1_000) // amount
      );

    expect(await lusd.balanceOf(alice.address)).to.equal(
      expandTo18Decimals(1_001_000)
    );
    expect(await lusd.balanceOf(shumErc20Bridge.address)).to.equal(0);
  });

  it("cannot withdraw the same deposit multiple times", async () => {
    const signature = await createSignature(
      relayer, // signer
      mockChainId, // srcChainId
      currentChainId, // destChainId
      BigNumber.from(1), // depositId
      hexlify(zeroPad(alice.address, 32)), // depositor
      hexlify(zeroPad(alice.address, 32)), // recipient
      formatBytes32String("Shum"), // currency
      expandTo18Decimals(1_000) // amount
    );

    // The first withdrawal is successful
    await shumErc20Bridge.connect(alice).withdraw(
      mockChainId, // srcChainId
      currentChainId, // destChainId
      BigNumber.from(1), // depositId
      hexlify(zeroPad(alice.address, 32)), // depositor
      hexlify(zeroPad(alice.address, 32)), // recipient
      formatBytes32String("Shum"), // currency
      expandTo18Decimals(1000), // amount
      signature // signature
    );

    await expect(
      shumErc20Bridge.connect(alice).withdraw(
        mockChainId, // srcChainId
        currentChainId, // destChainId
        BigNumber.from(1), // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("Shum"), // currency
        expandTo18Decimals(1000), // amount
        signature // signature
      )
    ).to.revertedWith("ShumErc20Bridge: already withdrawn");
  });

  it("depositId should increment on each deposit", async () => {
    expect(await shumErc20Bridge.depositCount()).to.equal(0);

    await expect(
      shumErc20Bridge.connect(alice).deposit(
        formatBytes32String("lUSD"), // token
        expandTo18Decimals(1_000), // amount
        mockChainId, // destChainId
        hexlify(zeroPad(alice.address, 32)) // recipient
      )
    )
      .to.emit(shumErc20Bridge, "TokenDeposited")
      .withArgs(
        currentChainId, // srcChainId
        mockChainId, // destChainId
        1, // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("lUSD"), // currency
        expandTo18Decimals(1_000) // amount
      );

    expect(await shumErc20Bridge.depositCount()).to.equal(1);

    await expect(
      shumErc20Bridge.connect(alice).deposit(
        formatBytes32String("lUSD"), // token
        expandTo18Decimals(1_000), // amount
        mockChainId, // destChainId
        hexlify(zeroPad(alice.address, 32)) // recipient
      )
    )
      .to.emit(shumErc20Bridge, "TokenDeposited")
      .withArgs(
        currentChainId, // srcChainId
        mockChainId, // destChainId
        2, // depositId
        hexlify(zeroPad(alice.address, 32)), // depositor
        hexlify(zeroPad(alice.address, 32)), // recipient
        formatBytes32String("lUSD"), // currency
        expandTo18Decimals(1_000) // amount
      );

    expect(await shumErc20Bridge.depositCount()).to.equal(2);
  });
});
