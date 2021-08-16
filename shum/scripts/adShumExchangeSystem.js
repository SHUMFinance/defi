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
    const ShumExchangeSystem = await ethers.getContractFactory('ShumExchangeSystem', {
        signer: deployer,
        libraries: {
            "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath,
        },
    })

    const shumExchangeSystem = await upgrades.deployProxy(
        ShumExchangeSystem,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumExchangeSystem_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    console.log("✓ 10 ShumExchangeSystem contract deployed ")
    console.log(shumExchangeSystem.address);
    console.log("");   



    await writeConfig("9config","aconfig","ShumExchangeSystem",shumExchangeSystem.address);
    await sleep(2000);

}

main();
