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

    let safeDecimalMath = await readConfig("2config","SafeDecimalMath");
    const ShumBuildBurnSystem = await ethers.getContractFactory('ShumBuildBurnSystem', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath,
        },
    })

    const zeroAddress = "0x0000000000000000000000000000000000000000";
    /**
     * The contract for controlling issuance and burning of synthetic assets
     */
     const shumBuildBurnSystem = await upgrades.deployProxy(
        ShumBuildBurnSystem,
        [
            admin.address, // admin
            zeroAddress, // _susdTokenAddr
        ],
        {
            initializer: "__ShumBuildBurnSystem_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 03 ShumBuildBurnSystem contract deployed ")
    console.log(shumBuildBurnSystem.address);
    console.log(""); 

    await writeConfig("2config","3config","ShumBuildBurnSystem",shumBuildBurnSystem.address);
    await sleep(2000);

}

main();
