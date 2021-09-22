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

    let args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }


    const ShumFinance = await ethers.getContractFactory('ShumFinance',deployer)
    /**
     * SHUM token contract
     */
     const shumFinance = await upgrades.deployProxy(
        ShumFinance,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumFinance_init",
        }
    );


    // Bridge does NOT need to hold any lUSD (mint/burn mode)
    await shumFinance
      .connect(deployer)
      .mint(alice.address, expandTo18Decimals(1_000_000));    

    let balance = await shumFinance.balanceOf(alice.address);

    console.log("xxl before :" + balance);

    const ShumErc20Bridge = await ethers.getContractFactory("ShumErc20Bridge");
    shumErc20Bridge = await ShumErc20Bridge.deploy();
    await shumErc20Bridge.connect(deployer).__ShumErc20Bridge_init(
      relayer.address, // _relayer
      admin.address // _admin
    );


    console.log(alice.address);
    const uint256Max = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    await shumFinance.connect(alice).approve(shumErc20Bridge.address, uint256Max);

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

        console.log(re);

    
        await shumErc20Bridge.connect(admin).addChainSupportForToken(
            ethers.utils.formatBytes32String("SHUM"), // tokenKey
            targetChainID                             // chainId
        );
        
        console.log("xxl 002");
        await shumErc20Bridge.connect(alice).deposit(
            ethers.utils.formatBytes32String("SHUM"), // token
            expandTo18Decimals(1_000),                // amount
            targetChainID,                            // destChainId
            hexlify(zeroPad(alice.address, 32)),      // recipient
            { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
        )


        balance = await shumFinance.balanceOf(alice.address);
        console.log("xxl after :" + balance);
    }catch(e){
        console.log("xxl error ");
        console.log(e);
    }





}

main();
