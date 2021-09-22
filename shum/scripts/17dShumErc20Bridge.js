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

    [deployer] = await ethers.getSigners();
    admin = deployer;
    relayer = deployer;
    console.log("admin address is :" + admin.address);
    
    let chainID =  (await ethers.provider.getNetwork()).chainId
    currentChainId = BigNumber.from(
        chainID
    );
    console.log("chainID is : " + currentChainId);

    const ShumErc20Bridge = await ethers.getContractFactory("ShumErc20Bridge");
    shumErc20Bridge = await ShumErc20Bridge.deploy();
    await shumErc20Bridge.connect(deployer).__ShumErc20Bridge_init(
      relayer.address, // _relayer
      admin.address // _admin
    );

    console.log("xxl shumErc20Bridge address : " + shumErc20Bridge.address);

    await writeConfig("14config","15config","ShumErc20Bridge",shumErc20Bridge.address);
    await sleep(2000);

}

main();
