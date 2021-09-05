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

    const ShumOracleRouter = await ethers.getContractFactory("ShumOracleRouter", {
        signer: deployer,
        libraries: {
          "contracts/SafeDecimalMath.sol:SafeDecimalMath":
          safeDecimalMath,
        },
      });
      
    oracleRouter = await upgrades.deployProxy(
        ShumOracleRouter,
        [
            admin.address, // _admin
        ],
        {
            initializer: "__ShumOracleRouter_init",
            unsafeAllowLinkedLibraries: true,
        }
    );

    console.log("✓ 060 ShumOracleRouter contract deployed ")
    console.log(oracleRouter.address);
    console.log("");

    await writeConfig("5config","6config","ShumOracleRouter",oracleRouter.address);
    await sleep(2000);

}

main();
