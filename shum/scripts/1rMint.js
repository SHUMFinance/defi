const { ethers } = require("hardhat");
const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const {
    writeConfig,
    readConfig,
    sleep, 
} = require('./utils/helper')

const main = async () => {
    
    console.log("xxl ShumFinance  ...");
    let accounts = await ethers.getSigners()
    let admin = accounts[0];
    console.log("xxl admin :" + admin.address);

    //let mintAddress = "0x46A26B330c0988a58aFF56e2a106F8256Ca89872";
    let mintAddress = admin.address;

    let ShumFinanceAddress = await readConfig("1config","ShumFinance");
    // console.log(ShumFinanceAddress);

    const Factory__ShumFinance = await ethers.getContractFactory('ShumFinance',admin)
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }
    ShumFinance = await Factory__ShumFinance.connect(admin).attach(
        ShumFinanceAddress
    );

    //let account = await ShumFinance.name();
    //console.log("admin is " + account);

    //n1
    let sendValue = utils.parseEther("10000000");
    let tx = await ShumFinance.mint(mintAddress,sendValue);
    
    console.log("✓ ShumFinance contract mint")
    console.log(tx);

    //let rep = await tx.wait();
    //console.log(rep);    

    //await sleep(2000);
    //console.log(ShumFinance);

    //let balance = await ShumFinance.balanceOf(mintAddress);
    // console.log(balance);


}

main();
