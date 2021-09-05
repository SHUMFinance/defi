const { ethers } = require("hardhat");

require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const main = async () => {

    //mockShumAddress = "0x50D1B9bD0D1643d3d983C25E5a341536a9770350";
    console.log("xxl Test ...");
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    let admin = accounts[1];

    try{
      const SafeDecimalMath = await ethers.getContractFactory("SafeDecimalMath");
      const safeDecimalMath = await SafeDecimalMath.deploy();
      
      const ShumDebtSystem = await ethers.getContractFactory(
        "ShumDebtSystem",
        {
        signer: deployer,
        libraries: {
          "contracts/SafeDecimalMath.sol:SafeDecimalMath":
            safeDecimalMath.address,
        },
      });

      // ShumDebtSystemContract = await ShumDebtSystem.connect(deployer).attach(
      //   "0x152B52e00AF9d7313dA4976020883A458F934A2F"
      // );

      ShumDebtSystemContract = await ShumDebtSystem.connect(deployer).deploy();
      await ShumDebtSystemContract.connect(deployer).__ShumDebtSystem_init(
        admin.address // _admin
      );

      args = {
        "gasPrice":0x02540be400,
        "gasLimit":0x7a1200
      }
  
      await ShumDebtSystemContract.GetUserDebtBalanceInUsd
                          (
                            "0x46A26B330c0988a58aFF56e2a106F8256Ca89872",
                            { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
                          );
      //console.log(balance);


    }catch(e){
      console.log(e);
    }
  
    




}

main();
