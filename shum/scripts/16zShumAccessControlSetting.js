//const { ethers } = require("hardhat");
const { Duration } = require("luxon");

const { utils } = require('ethers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
const { formatBytes32String }  = require("ethers/lib/utils");

const { Contract,BigNumber} = require("ethers");
const { Big } = require("big.js");

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

    let ShumAccessControlAddress = await readConfig("11config","ShumAccessControl");
    let ShumRewardSystemAddress = await readConfig("13config","ShumRewardSystem");

    //let ShumRewardSystemAddress = "0xa7BD4d19E21C99fCDC68f3fBcc1b00B973af0Df4";
  
    const ShumAccessControl = await ethers.getContractFactory('ShumAccessControl',deployer)
    shumAccessControl = await ShumAccessControl.connect(admin).attach(
        ShumAccessControlAddress
        //"0x2ba233B9345165E7b374B13bCc4991C4fCD8B351"
    );

    /**
    * Assign the following role to contract `ShumLiquidation`:
    * - LOCK_REWARD
    */
    await shumAccessControl.connect(admin).SetRoles(
        formatBytes32String("LOCK_REWARD"),     // roleType
        [ShumRewardSystemAddress],               // addresses
        [true]                                  // setTo
    );
    console.log("shumAccessControl SetRoles LOCK_REWARD");
    console.log("");



    await sleep(2000);

}


main();
