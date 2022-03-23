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

    //01 shumFinance
    let ShumFinanceAddress = await readConfig("15config","ShumFinance");
    const ShumFinance = await ethers.getContractFactory('ShumFinance',admin)
    shumFinance = await ShumFinance.connect(admin).attach(
        ShumFinanceAddress
    );

    console.log("xxl ShumFinanceAddress : " + ShumFinanceAddress);

    //02 shumErc20Bridge
    let ShumErc20BridgeAddress = await readConfig("15config","ShumErc20Bridge");
    const ShumErc20Bridge = await ethers.getContractFactory('ShumErc20Bridge',admin)
    shumErc20Bridge = await ShumErc20Bridge.connect(admin).attach(
        ShumErc20BridgeAddress
    );

    console.log("xxl ShumErc20BridgeAddress : " + ShumErc20BridgeAddress);

    console.log(alice.address);
    const uint256Max = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    await shumFinance.connect(alice).approve(shumErc20Bridge.address, uint256Max);

    //
    const TOKEN_LOCK_TYPE_TRANSFER = 1;
    const targetChainID = 97

    console.log("xxl SHUM ...");
    console.log(ethers.utils.formatBytes32String("SHUM"));


    try{    

        console.log("xxl 1111 ...");
        console.log(shumFinance.address);
        console.log(TOKEN_LOCK_TYPE_TRANSFER);

        let re = await shumErc20Bridge.connect(admin).addToken(
            ethers.utils.formatBytes32String("SHUM"), // tokenKey
            shumFinance.address,                      // tokenAddress
            TOKEN_LOCK_TYPE_TRANSFER                  // lockType
        );

        // console.log(re);    
        await shumErc20Bridge.connect(admin).addChainSupportForToken(
            ethers.utils.formatBytes32String("SHUM"), // tokenKey
            targetChainID                             // chainId
        );
        
        // console.log("xxl 002 : " + shumErc20Bridge.address);
        // let tx = await shumErc20Bridge.connect(alice).deposit(
        //     ethers.utils.formatBytes32String("SHUM"), // token
        //     expandTo18Decimals(1_000),                // amount
        //     targetChainID,                            // destChainId
        //     hexlify(zeroPad(alice.address, 32))       // recipient
        // )
        // await sleep(5000);

        // let testAddress = "0x46A26B330c0988a58aFF56e2a106F8256Ca89872";
        // console.log("xxl 003 : " + shumErc20Bridge.address);
        // let tx = await shumErc20Bridge.connect(admin).withdraw(
        //     BigNumber.from(97),
        //     BigNumber.from(42),
        //     BigNumber.from(5),
        //     hexlify(zeroPad(testAddress, 32)), // depositor
        //     hexlify(zeroPad(testAddress, 32)), // recipient
        //     formatBytes32String("SHUM"), // currency
        //     BigNumber.from("10000000000000000"), // amount
        //     "0xadec3fb7b07e8291c597b9de852b1a742f0be058b0c64126b846a86835a38966004900270b3e01fb829dd45101959689baf9890fd759b6782a87cb51dd4711e61c",
        //     { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
        // );

        // let re1 = await tx.wait();
        // console.log(re1);


    }catch(e){
        console.log("xxl error ");
        console.log(e);
    }
}

main();
