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
} = require('./utils/helper')

const main = async () => {

    [deployer] = await ethers.getSigners();
    admin = deployer;
    console.log("admin address is :" + admin.address);

    let safeDecimalMath = await readConfig("2config","SafeDecimalMath");
    const ShumDebtSystem = await ethers.getContractFactory('ShumDebtSystem', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath,
        },
    })

    const shumDebtSystem = await upgrades.deployProxy(
        ShumDebtSystem,
        [admin.address],
        {
            initializer: "__ShumDebtSystem_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 07 ShumDebtSystem contract deployed ")
    console.log(shumDebtSystem.address);
    console.log(""); 

    await writeConfig("6config","7config","ShumDebtSystem",shumDebtSystem.address);
    await sleep(2000);

}

main();
