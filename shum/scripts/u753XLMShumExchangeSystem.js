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

    console.log("admin address is :" + admin.address + " alice " + alice.address);
    let chainID =  (await ethers.provider.getNetwork()).chainId
    currentChainId = BigNumber.from(
        chainID
    );
    console.log("chainID is : " + currentChainId);

    let args = {
      "gasPrice":0x02540be400,
      "gasLimit":0x7a1200,
    }

    //1.0 shum config
    let shumConfigAddress = await readConfig("11config","ShumConfig");
    const ShumConfig = await ethers.getContractFactory('ShumConfig',deployer)
    shumConfig = await ShumConfig.connect(admin).attach(
        shumConfigAddress
        //"0x2ba233B9345165E7b374B13bCc4991C4fCD8B351"
    );

    //2.0 set ETH exchange fee rate to 1%
    await shumConfig.connect(admin).setUint(
      ethers.utils.formatBytes32String("sXLM"), // key
      expandTo18Decimals(0.01), // value
      {gasLimit: args.gasLimit}
    );

    //3.0 set shum exchange 
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

    try{
        
        let SUSDTokenAddress = await readConfig("15config","sUSD");
        let sXLMTokenAddress = await readConfig("15config","sXLM");
        
        //4.0 set susd
        const ShumAssetUpgradeable = await ethers.getContractFactory('ShumAssetUpgradeable',deployer)
        let susdToken = await ShumAssetUpgradeable.connect(admin).attach(
            SUSDTokenAddress
        );
    
        console.log("xxl ShumAssetUpgradeable start ");
        console.log(sXLMTokenAddress);
        //4.0 set sXLM
        let sXLMToken = await ShumAssetUpgradeable.connect(admin).attach(
          sXLMTokenAddress
        );
        console.log("xxl ShumAssetUpgradeable end ");

        // Set settlement delay
        await shumConfig.connect(admin).setUint(
          ethers.utils.formatBytes32String("TradeSettlementDelay"), // key
          1,
          {gasLimit: args.gasLimit}
        );

        // Set revert delay
        await shumConfig.connect(admin).setUint(
          ethers.utils.formatBytes32String("TradeRevertDelay"), // key
          1000000,
        );

        ///-----------------before balance-------------------------------------
        let beforeSusdBal = await susdToken.balanceOf(alice.address)
        console.log(beforeSusdBal);

        let beforeCBal = await susdToken.balanceOf(ShumExchangeSystemAddress)
        console.log(beforeCBal);

        let beforesXLMBal = await sXLMToken.balanceOf(alice.address)
        console.log(beforesXLMBal);
        // ///---------------------------------------------------------------------

        // let tx = await shumExchangeSystem.connect(alice).exchange(

        //   ethers.utils.formatBytes32String("sUSD"),   // sourceKey
        //   expandTo18Decimals(1),                    // sourceAmount
        //   alice.address,                              // destAddr
        //   ethers.utils.formatBytes32String("sXLM"),   // destKey xxl TODO just for test 
        //   {gasLimit: args.gasLimit}

        // );

        // let rep = await tx.wait();
        // console.log(rep.events);

        // console.log("xxl settle ...");
        // let lastId = await shumExchangeSystem.lastPendingExchangeEntryId();
        // console.log(lastId);

        // tx = await shumExchangeSystem.connect(admin).settle(
        //   lastId, // pendingExchangeEntryId
        //   {gasLimit: args.gasLimit}
        // );

        // console.log("tx wait :");
        // let bal = await tx.wait();
        // console.log(bal);

        // ///-----------------after balance-------------------------------------
        // let susdBal = await susdToken.balanceOf(alice.address)
        // console.log(susdBal);

        // susdBal = await susdToken.balanceOf(ShumExchangeSystemAddress)
        // console.log(susdBal);

        // sXLMBala = await sXLMToken.balanceOf(alice.address)
        // console.log(sXLMBala);
        // ///---------------------------------------------------------------------

    }catch(e){
      console.log(e);
    }


}


main();
