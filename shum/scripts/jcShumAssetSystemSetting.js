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
    expandTo18Decimals
} = require('./utils/helper')

const main = async () => {

    [deployer] = await ethers.getSigners();
    admin = deployer;
    console.log("admin address is :" + admin.address);

    let ShumRewardSystemAddress = await readConfig("econfig","ShumRewardSystem");
    let ShumAssetSystemAddress = await readConfig("econfig","ShumAssetSystem");
    const ShumAssetSystem = await ethers.getContractFactory('ShumAssetSystem',deployer)
    shumAssetSystem = await ShumAssetSystem.connect(admin).attach(
        ShumAssetSystemAddress
    );

    let args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }
    /**
    * Synchronize shumExchangeAddress cache
    */
    await shumAssetSystem
        .connect(admin)
        .updateAll(
        [ethers.utils.formatBytes32String("ShumRewardSystem")],
        [ShumRewardSystemAddress],
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );
    console.log("shumAssetSystem updateAll ShumRewardSystem ")
    
    //
    let ShumExchangeSystemAddress = await readConfig("bconfig","ShumExchangeSystem");
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

    await shumExchangeSystem
        .connect(admin)
        .updateAddressCache(ShumAssetSystemAddress,
        { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
    );    
    console.log("shumExchangeSystem updateAddressCache shumAssetSystem ")
    console.log("");  

}

main();
