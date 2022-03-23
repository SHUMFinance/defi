//const { ethers } = require("hardhat");
const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
const { ethers,upgrades } = require("hardhat");

const {
    writeConfig,
    readConfig,
    sleep, 
} = require('./utils/helper')

const main = async () => {

    [deployer] = await ethers.getSigners();
    admin = deployer;
    console.log("admin address is :" + admin.address);
    let args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x8a1200,
    }

    //1.0
    console.log("0.1");
    let sETHTokenAddress = await readConfig("15config","sETH");
    console.log(sETHTokenAddress);

    const ShumAssetUpgradeable = await ethers.getContractFactory('ShumAssetUpgradeable',deployer)
    let sETHToken = await ShumAssetUpgradeable.connect(admin).attach(
        sETHTokenAddress
    );
    console.log(1);

    //2.0
    let ShumAssetSystemAddress = await readConfig("15config","ShumAssetSystem");
    const ShumAssetSystem = await ethers.getContractFactory('ShumAssetSystem',deployer)
    let shumAssetSystem = await ShumAssetSystem.connect(admin).attach(
        ShumAssetSystemAddress
    );
    console.log(2);

    //3.0
    await sETHToken.connect(admin).updateAddressCache(
        ShumAssetSystemAddress,
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );
    console.log("sETH shumAssetSystem updateAddressCache");
    console.log(3);

    //4.0
    tx = await shumAssetSystem.connect(admin).addAsset(
         sETHToken.address,
         { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );
    console.log(4);
    rep = await tx.wait();
    console.log("shumAssetSystem sETH addAsset");

    //5.0
    let data = await shumAssetSystem.connect(admin).getAssetAddresses(
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );
    console.log(data);
    console.log(5);



}

main();
