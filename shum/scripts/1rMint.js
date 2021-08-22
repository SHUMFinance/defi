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

    let ShumFinanceAddress = await readConfig("1config","ShumFinance");
    //
    const Factory__ShumFinance = await ethers.getContractFactory('ShumFinance',admin)
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }
    ShumFinance = await Factory__ShumFinance.connect(admin).attach(
        ShumFinanceAddress
    );

    //n1
    let sendValue = utils.parseEther("10.2");
    let tx = await ShumFinance.mint("0x46A26B330c0988a58aFF56e2a106F8256Ca89872",sendValue);
    
    console.log("✓ ShumFinance contract mint")
    console.log(tx.hash);

    await sleep(5000);

    let balance = await ShumFinance.balanceOf("0x46A26B330c0988a58aFF56e2a106F8256Ca89872");
    console.log(balance);


}

main();
