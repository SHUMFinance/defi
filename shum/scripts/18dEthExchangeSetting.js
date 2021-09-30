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
    deployer = accounts[0];
    admin = deployer;
    relayer = deployer;
    alice = accounts[2]

    console.log("admin address is :" + admin.address);
    
    let chainID =  (await ethers.provider.getNetwork()).chainId
    currentChainId = BigNumber.from(
        chainID
    );
    console.log("chainID is : " + currentChainId);

    let args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }

    try{    
        //1.
        console.log("1.0 Set ETH exchange fee rate to 1% :");
        let shumConfigAddress = await readConfig("11config","ShumConfig");
        const ShumConfig = await ethers.getContractFactory('ShumConfig',deployer)
        shumConfig = await ShumConfig.connect(admin).attach(
            shumConfigAddress
        );
    
        // Set ETH exchange fee rate to 1%
        await shumConfig.connect(admin).setUint(
          ethers.utils.formatBytes32String("sETH"), // key
          expandTo18Decimals(0.01) // value
        );


        //2.
        let ShumExchangeSystemAddress = await readConfig("15config","ShumExchangeSystem");
        console.log("xxl ShumExchangeSystemAddress :" + ShumExchangeSystemAddress);
    
        let safeDecimalMath = await readConfig("2config","SafeDecimalMath");
        const ShumExchangeSystem = await ethers.getContractFactory('ShumExchangeSystem', {
            signer: deployer,
            libraries: {
                "contracts/SafeDecimalMath.sol:SafeDecimalMath":
                safeDecimalMath,
            },
        })
    
        shumExchangeSystem = await ShumExchangeSystem.connect(admin).attach(
          ShumExchangeSystemAddress
        );

        let tx = await shumExchangeSystem.connect(alice).exchange(

            ethers.utils.formatBytes32String("sUSD"),   // sourceKey
            expandTo18Decimals(10),                    // sourceAmount
            alice.address,                              // destAddr
            ethers.utils.formatBytes32String("sETH"),   // destKey
            {gasLimit: args.gasLimit}
  
          );
  
          let rep = await tx.wait();
          console.log(rep.events);
    
    }catch(e){
        console.log("xxl error ");
        console.log(e);
    }
}

main();
