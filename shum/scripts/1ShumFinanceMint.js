const { ethers } = require("hardhat");
const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    console.log("xxl ShumFinance Deployer ...");
    let accounts = await ethers.getSigners()
    let admin = accounts[1];

    //
    const Factory__ShumFinance = await ethers.getContractFactory('ShumFinance',admin)
    args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200,
    }
    ShumFinance = await Factory__ShumFinance.connect(admin).attach(
        "0x2ba233B9345165E7b374B13bCc4991C4fCD8B351"
    );

    //n1
    let sendValue = utils.parseEther("10.1");
    let tx = await ShumFinance.mint("0x46A26B330c0988a58aFF56e2a106F8256Ca89872",sendValue);
    
    console.log("✓ ShumFinance contract mint")
    console.log(tx.hash);

}

main();
