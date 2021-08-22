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

    //01 shumFinance
    let ShumFinanceAddress = await readConfig("15config","ShumFinance");
    const ShumFinance = await ethers.getContractFactory('ShumFinance',admin)
    shumFinance = await ShumFinance.connect(admin).attach(
        ShumFinanceAddress
    );

    //02 shumErc20Bridge
    let ShumErc20BridgeAddress = await readConfig("15config","ShumErc20Bridge");
    const ShumErc20Bridge = await ethers.getContractFactory('ShumErc20Bridge',admin)
    shumErc20Bridge = await ShumErc20Bridge.connect(admin).attach(
        ShumErc20BridgeAddress
    );

    console.log(alice.address);
    const uint256Max = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    await shumFinance.connect(alice).approve(shumErc20Bridge.address, uint256Max);

    //
    const TOKEN_LOCK_TYPE_TRANSFER = 1;
    const targetChainID = 3
    await shumErc20Bridge.connect(admin).addToken(
        ethers.utils.formatBytes32String("Shum"), // tokenKey
        shumFinance.address,                      // tokenAddress
        TOKEN_LOCK_TYPE_TRANSFER                  // lockType
      );
  
    await shumErc20Bridge.connect(admin).addChainSupportForToken(
        ethers.utils.formatBytes32String("Shum"), // tokenKey
        targetChainID                             // chainId
    );
    

    await shumErc20Bridge.connect(alice).deposit(
        formatBytes32String("Shum"),              // token
        expandTo18Decimals(1_000),                // amount
        targetChainID,                            // destChainId
        hexlify(zeroPad(alice.address, 32))       // recipient
    )
    
}

main();
