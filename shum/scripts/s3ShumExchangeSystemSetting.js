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



    let data = expandTo18Decimals(0.01);
    console.log("xxl 001 " + data);




    // //
    // let ShumExchangeSystemAddress = await readConfig("15config","ShumExchangeSystem");
    // console.log("xxl ShumExchangeSystemAddress :" + ShumExchangeSystemAddress);

    // let safeDecimalMath = await readConfig("2config","SafeDecimalMath");
    // const ShumExchangeSystem = await ethers.getContractFactory('ShumExchangeSystem', {
    //     signer: deployer,
    //     libraries: {
    //         "contracts/SafeDecimalMath.sol:SafeDecimalMath":
    //         safeDecimalMath,
    //     },
    // })


    // shumExchangeSystem = await ShumExchangeSystem.connect(admin).attach(
    //   ShumExchangeSystemAddress
    //   //"0x2ba233B9345165E7b374B13bCc4991C4fCD8B351"
    // );

    // let args = {
    //   "gasPrice":0x02540be400,
    //   "gasLimit":0x7a1200,
    // }

    // try{

    //     let SUSDTokenAddress = await readConfig("13config","sUSD");
    //     let SBTCTokenAddress = await readConfig("13config","sBTC");
        
    //     const ShumAssetUpgradeable = await ethers.getContractFactory('ShumAssetUpgradeable',deployer)
    //     let susdToken = await ShumAssetUpgradeable.connect(admin).attach(
    //         SUSDTokenAddress
    //     );
    
    //     let sbtcToken = await ShumAssetUpgradeable.connect(admin).attach(
    //         SBTCTokenAddress
    //     );


    //     ///-----------------before balance----------------
    //     let beforeSusdBal = await susdToken.balanceOf(alice.address)
    //     console.log(beforeSusdBal);

    //     let beforeCBal = await susdToken.balanceOf(ShumExchangeSystemAddress)
    //     console.log(beforeCBal);

    //     let beforeSbtcBal = await sbtcToken.balanceOf(alice.address)
    //     console.log(beforeSbtcBal);

    //     // console.log("xxl settle ...");
    //     // let lastId = await shumExchangeSystem.lastPendingExchangeEntryId();
    //     // console.log(lastId);

    //     // tx = await shumExchangeSystem.connect(admin).settle(
    //     //   lastId, // pendingExchangeEntryId
    //     //   {gasLimit: args.gasLimit}
    //     // );

    //     // console.log("tx wait :");
    //     // let bal = await tx.wait();
    //     // console.log(bal);

    //     // // await sleep(2000);
    //     // let susdBal = await susdToken.balanceOf(alice.address)
    //     // console.log(susdBal);

    //     // susdBal = await susdToken.balanceOf(ShumExchangeSystemAddress)
    //     // console.log(susdBal);

    //     // sbtcBala = await sbtcToken.balanceOf(alice.address)
    //     // console.log(sbtcBala);


      

    // }catch(e){
    //   console.log(e);
    // }



    // // Alice exchanges 500 sUSD for 0.025 sBTC
    // await stack.shumExchangeSystem.connect(alice).exchange(
    //   ethers.utils.formatBytes32String("sUSD"), // sourceKey
    //   expandTo18Decimals(500), // sourceAmount
    //   alice.address, // destAddr
    //   ethers.utils.formatBytes32String("sBTC") // destKey
    // );




 


}




// const passSettlementDelay = async (): Promise<void> => {
//   await setNextBlockTimestamp(
//     ethers.provider,
//     (await getBlockDateTime(ethers.provider)).plus(settlementDelay)
//   );
// };

// const settleTrade = (entryId: number): Promise<any> => {
//   return stack.shumExchangeSystem.connect(settler).settle(
//     entryId // pendingExchangeEntryId
//   );
// };

// const settleTradeWithDelay = async (entryId: number): Promise<any> => {
//   await passSettlementDelay();
//   await settleTrade(entryId);
// };

// async function  settleTradeWithDelay(entryId) {
//   await passSettlementDelay();
//   await settleTrade(entryId);
// }





main();
