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
    let ShumBuildBurnSystemAddress = await readConfig("11config","ShumBuildBurnSystem");
    let ShumExchangeSystemAddress = await readConfig("11config","ShumExchangeSystem");
    let ShumLiquidationAddress = await readConfig("11config","ShumLiquidation");

    const ShumAccessControl = await ethers.getContractFactory('ShumAccessControl',deployer)
    shumAccessControl = await ShumAccessControl.connect(admin).attach(
        ShumAccessControlAddress
        //"0x2ba233B9345165E7b374B13bCc4991C4fCD8B351"
    );

    /**
     * Assign the following roles to contract `ShumBuildBurnSystem`:
     * - ISSUE_ASSET
     * - BURN_ASSET
     * - ShumDebtSystem
     */
    await shumAccessControl
        .connect(admin)
        .SetIssueAssetRole([ShumBuildBurnSystemAddress], [true]);
    await shumAccessControl
        .connect(admin)
        .SetBurnAssetRole([ShumBuildBurnSystemAddress], [true]);
    await shumAccessControl
        .connect(admin)
        .SetDebtSystemRole([ShumBuildBurnSystemAddress], [true]);
    console.log("shumAccessControl :");
    console.log("shumBuildBurnSystem ISSUE_ASSET ");
    console.log("shumBuildBurnSystem BURN_ASSET ");
    console.log("shumBuildBurnSystem SetDebtSystemRole  ");

    /**
    * Assign the following roles to contract `ShumExchangeSystem`:
    * - ISSUE_ASSET
    * - BURN_ASSET
    * - MOVE_ASSET
    */
    await shumAccessControl
        .connect(admin)
        .SetIssueAssetRole([ShumExchangeSystemAddress], [true]);
    await shumAccessControl
        .connect(admin)
        .SetBurnAssetRole([ShumExchangeSystemAddress], [true]);
    await shumAccessControl.connect(admin).SetRoles(
        formatBytes32String("MOVE_ASSET"),         // roleType
        [ShumExchangeSystemAddress],               // addresses
        [true]                                     // setTo
    );
    console.log("shumExchangeSystem  SetIssueAssetRole");
    console.log("shumExchangeSystem  SetBurnAssetRole");
    console.log("shumExchangeSystem  SetRoles MOVE_ASSET");

    /**
    * Assign the following role to contract `ShumLiquidation`:
    * - MOVE_REWARD
    */
    await shumAccessControl.connect(admin).SetRoles(
        formatBytes32String("MOVE_REWARD"),     // roleType
        [ShumLiquidationAddress],               // addresses
        [true]                                  // setTo
    );
    console.log("shumLiquidation     SetRoles MOVE_REWARD");
    console.log("");



    await sleep(2000);

}


main();
