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

    //
    let ShumFinanceAddress = "0x2ba233B9345165E7b374B13bCc4991C4fCD8B351";
    [deployer,newAccount] = await ethers.getSigners();
    admin = deployer;


    let fromAccount = admin; 
    let toAccount = newAccount;

    console.log("from :" + fromAccount.address + " to :" + toAccount.address);


    const Factory__ShumFinance = await ethers.getContractFactory('ShumFinance',fromAccount)
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }
    ShumFinance = await Factory__ShumFinance.connect(fromAccount).attach(
        ShumFinanceAddress
    );


    let re = await ShumFinance.setCandidate(toAccount.address);
    let re2 = await re.wait();
    console.log("xxl setCandidate :");
    console.log(re2);

    await sleep(10000);
    
    let newRe = await ShumFinance.connect(toAccount).becomeAdmin();
    let newRe2 = await newRe.wait();
    console.log("xxl becomeAdmin :");
    console.log(newRe2);



    // let account = await ShumFinance.name();
    // console.log("admin is " + account);




}

main();
