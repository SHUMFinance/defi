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


    let SUSDTokenAddress = await readConfig("12config","sUSD");
    //let SBTCTokenAddress = await readConfig("12config","sBTC");
    const ShumAssetUpgradeable = await ethers.getContractFactory('ShumAssetUpgradeable',deployer)
    let susdToken = await ShumAssetUpgradeable.connect(admin).attach(
        SUSDTokenAddress
    );

    // let sbtcToken = await ShumAssetUpgradeable.connect(admin).attach(
    //     SBTCTokenAddress
    // );

    let ShumAssetSystemAddress = await readConfig("12config","ShumAssetSystem");
    const ShumAssetSystem = await ethers.getContractFactory('ShumAssetSystem',deployer)
    let shumAssetSystem = await ShumAssetSystem.connect(admin).attach(
        ShumAssetSystemAddress
    );

    let ShumBuildBurnSystemAddress = await readConfig("12config","ShumBuildBurnSystem");
    let safeDecimalMath = await readConfig("12config","SafeDecimalMath");
    const ShumBuildBurnSystem = await ethers.getContractFactory('ShumBuildBurnSystem', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath,
        },
    })
    let shumBuildBurnSystem = await ShumBuildBurnSystem.connect(admin).attach(
        ShumBuildBurnSystemAddress
    );
    
    /**
     * Update synth address cache
     */
    await susdToken.connect(admin).updateAddressCache(ShumAssetSystemAddress);
    // await sbtcToken.connect(admin).updateAddressCache(ShumAssetSystemAddress);
    console.log("sUSD shumAssetSystem updateAddressCache");
    // console.log("sBTC shumAssetSystem updateAddressCache");

    /**
     * Register sUSD on `ShumBuildBurnSystem`
     */
    await shumBuildBurnSystem.connect(admin).SetSusdTokenAddress(susdToken.address);
    console.log("shumBuildBurnSystem sUSD SetSusdTokenAddress");
    console.log("");
    await sleep(3000);

    let args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }
    /**
     * Register synth assets on `ShumAssetSystem`
     */
    let tx = await shumAssetSystem.connect(admin).addAsset(
        susdToken.address,
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );
    //let rep = await tx.wait();
    //console.log(rep);

    //  await sleep(3000);    
    //  tx = await shumAssetSystem.connect(admin).addAsset(
    //      sbtcToken.address,
    //      { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    //  );
    //  rep = await tx.wait();
     //console.log(rep);

    console.log("shumAssetSystem sUSD addAsset");
    //console.log("shumAssetSystem sBTC addAsset");
    console.log("");


}

main();
