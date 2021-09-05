//const { ethers } = require("hardhat");
const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
const { ethers,upgrades } = require("hardhat");
const { Duration } = require("luxon");

const {
    writeConfig,
    readConfig,
    sleep, 
    expandTo18Decimals
} = require('./utils/helper')

const main = async () => {

    accounts = await ethers.getSigners();
    let admin = accounts[0]
    let deployer = accounts[0]
    let alice = accounts[2]
    console.log("admin address is :" + admin.address + " alice " + alice.address);
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }

    //01 ShumFinance
    let safeDecimalMath = await readConfig("2config","SafeDecimalMath");
    const ShumDebtSystem = await ethers.getContractFactory('ShumDebtSystem', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath,
        },
    })
    //const ShumDebtSystem = await ethers.getContractFactory('ShumDebtSystem',admin)
    let ShumDebtSystemAddress = await readConfig("14config","ShumDebtSystem");
    shumDebtSystem = await ShumDebtSystem.connect(admin).attach(
        ShumDebtSystemAddress
    );

    try{
        let result = await shumDebtSystem.GetUserDebtBalanceInUsd(
            alice.address,
            { gasPrice: args.gasPrice, gasLimit: args.gasLimit}    
        );
        console.log("result is ");
        console.log(result);

    }catch(e){
        console.log("xxl GetUserDebtBalanceInUsd");
        console.log(e);
    }
    
    
}

main();
