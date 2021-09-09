//const { ethers } = require("hardhat");
const { BigNumber,utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
const { ethers,upgrades } = require("hardhat");

const {
    writeConfig,
    readConfig,
    sleep, 
    expandTo18Decimals
} = require('./utils/helper')

const {
    formatBytes32String,
    hexlify,
    splitSignature,
    zeroPad,
  } = require( "ethers/lib/utils")

const main = async () => {

    accounts = await ethers.getSigners();
    deployer = accounts[0]
    admin = deployer;
    relayer = deployer;
    alice = accounts[2]

    console.log("admin address is :" + admin.address);    
    let chainID =  (await ethers.provider.getNetwork()).chainId
    currentChainId = BigNumber.from(
        chainID
    );
    console.log("chainID is : " + currentChainId);

    let shumAssetSystemAddress = await readConfig("15config","ShumRewardSystem");
    // 1. Shum reward
    const ShumRewardSystem = await ethers.getContractFactory('ShumRewardSystem',deployer)

    let shumRewardSystem = await ShumRewardSystem.connect(admin).attach(
        shumAssetSystemAddress
    );

    let rewardAddress = await shumRewardSystem.rewardSigner();
    console.log("xxl rewardAddress : " + rewardAddress);


    // 2. Period 1, 100 staking reward, 100 fee reward
    let aliceSignaturePeriod1 = await createSignature(
        admin,
        BigNumber.from(1),
        alice.address,
        expandTo18Decimals(100),
        expandTo18Decimals(200),
        shumAssetSystemAddress
    );
    
    console.log(aliceSignaturePeriod1);
 


}


async function createSignature (
    signer,
    periodId,
    recipient,
    stakingReward,
    feeReward,
    shumAssetSystemAddress
  ){
    const domain = {
      name: "Shum",
      version: "1",
      chainId: (await ethers.provider.getNetwork()).chainId,
      verifyingContract: shumAssetSystemAddress,
    };

    

    const types = {
      Reward: [
        { name: "periodId", type: "uint256" },
        { name: "recipient", type: "address" },
        { name: "stakingReward", type: "uint256" },
        { name: "feeReward", type: "uint256" },
      ],
    };

    const value = {
      periodId,
      recipient,
      stakingReward,
      feeReward,
    };
    console.log(value);

    
    const signatureHex = await signer._signTypedData(domain, types, value);
    return signatureHex;
};

main();
