import { BigNumber } from "ethers";

const { ethers } = require('hardhat')

export const handler = {

    getRewardFromAddress:async(
        pRadio:number,
        collateralSystemAddress:string,
        rewardSystemAddress:string,
        debtSystemAddress:string,
        workAccount:any,
        address:string
        ):Promise<string[]> => {

        try{

            console.log("*** xxl getRewardFromAddress start : " + address);
            console.log("pRadio :" + pRadio);
            console.log("collateralSystemAddress :" + collateralSystemAddress);
            console.log("rewardSystemAddress :" + rewardSystemAddress);
            console.log("debtSystemAddress :" + debtSystemAddress);
            console.log("*** xxl getRewardFromAddress end");

            //Shum Reward System
            console.log(1);
            const ShumRewardSystem = await ethers.getContractFactory('ShumRewardSystem',workAccount)
            let shumRewardSystem = await ShumRewardSystem.connect(workAccount).attach(rewardSystemAddress);

            console.log(2);
            let firstPeriodStart = await shumRewardSystem.firstPeriodStartTime();
            console.log("-----**** xxl firstPeriodStart : " + firstPeriodStart);
           
            // let lastClaimPeriodIds = await shumRewardSystem.userLastClaimPeriodIds(address);
            // console.log("-----**** xxl last ClaimPeriod Ids : " + lastClaimPeriodIds);

            //Shum Collateral System
            const ShumCollateralSystem = await ethers.getContractFactory('ShumCollateralSystem',workAccount)
            let shumCollateralSystem = await ShumCollateralSystem.connect(workAccount).attach(collateralSystemAddress);
            let totalCollateralInUsd = await shumCollateralSystem.GetUserTotalCollateralInUsd(address);
            console.log("-----**** xxl user TotalCollateral In Usd : " + totalCollateralInUsd + " address : " + address);

            return [totalCollateralInUsd,firstPeriodStart];

            
        }catch(e){
            console.log(e);
            return ["0","0"];
        }
    
    
    },


    claimReward:async(
        rewardSystemAddress:string,
        workAccount:any,
        periodId:BigNumber,
        stakingReward:BigNumber,
        feeReward:BigNumber,
        signature:string
        ):Promise<string[]> => {

        try{

            //Shum Reward System
            const ShumRewardSystem = await ethers.getContractFactory('ShumRewardSystem',workAccount)
            let shumRewardSystem = await ShumRewardSystem.connect(workAccount).attach(rewardSystemAddress);

            let tx = await shumRewardSystem.claimReward(
                periodId,
                stakingReward,
                feeReward,
                signature
            );

            let recipt = await tx.wait();
            console.log(recipt);
            

            //xxl 2 modify claim logic 
            
            
        }catch(e){
            console.log(e);
            return ["0","0"];
        }
    
    
    },


    withdraw:async(
        workAccount:any,
        bridgeAddress:string,
        srcChainId:number,
        destChainId:number,
        depositId:BigNumber,
        depositor:string,
        recipient:string,
        currency:string,
        amount:BigNumber,
        signature:string
    ):Promise<string[]> => {

        try{

            console.log("xxl withdraw ...");
            console.log(workAccount);
            console.log(bridgeAddress);
            console.log(srcChainId);
            console.log(destChainId);
            console.log(depositId);
            console.log(depositor);
            console.log(recipient);
            console.log(currency);
            console.log(amount);
            console.log(signature);


            let args = {
                "gasPrice":0x02540be400,
                "gasLimit":0x7a1200,
            }
            //Shum Reward System
            const ShumErc20Bridge = await ethers.getContractFactory('ShumErc20Bridge',workAccount)
            let shumErc20Bridge = await ShumErc20Bridge.connect(workAccount).attach(bridgeAddress);


            // function withdraw(
            //     uint256 srcChainId,
            //     uint256 destChainId,
            //     uint256 depositId,
            //     bytes32 depositor,
            //     bytes32 recipient,
            //     bytes32 currency,
            //     uint256 amount,
            //     bytes calldata signature
            // ) external {

            let tx = await shumErc20Bridge.withdraw(
                destChainId,
                srcChainId,
                depositId,
                depositor,
                recipient,
                currency,
                amount,
                signature,
                { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
            );

            let recipt = await tx.wait();
            console.log(recipt);

            
            
        }catch(e){
            console.log(e);
            return ["0","0"];
        }
    
    
    },

    getDepoistCount:async(workAccount:any,bridgeAddress:string):Promise<number> => {

        try{

            let args = {
                "gasPrice":0x02540be400,
                "gasLimit":0x7a1200,
            }
            //Shum Reward System
            const ShumErc20Bridge = await ethers.getContractFactory('ShumErc20Bridge',workAccount)
            let shumErc20Bridge = await ShumErc20Bridge.connect(workAccount).attach(bridgeAddress);

            let depositCnt = await shumErc20Bridge.depositCount(
                { gasPrice: args.gasPrice, gasLimit: args.gasLimit}
            );

        
            return depositCnt;
            
        }catch(e){
            console.log(e);
            return 0;
        }
    
    
    },

    //
    settle:async(
        workAccount:any,
        exchangeAddress:string,
        safeDecimalMathAddress:string
    ):Promise<any> => {

        try{
            let args = {
                "gasPrice":0x02540be400,
                "gasLimit":0x7a1200,
            }
            
            //Shum Reward System
            const ShumExchangeSystem = await ethers.getContractFactory('ShumExchangeSystem',{
                signer: workAccount,
                libraries: {
                    "contracts/SafeDecimalMath.sol:SafeDecimalMath":
                    safeDecimalMathAddress,
                }
            })
            
            let shumExchangeSystem = await ShumExchangeSystem.connect(workAccount).attach(exchangeAddress);

            console.log("xxl settle ...");
            let lastId = await shumExchangeSystem.lastPendingExchangeEntryId();
            console.log(lastId);

            let tx = await shumExchangeSystem.settle(
                lastId, // pendingExchangeEntryId
                {gasLimit: args.gasLimit}
            );

            console.log("tx wait :");
            let bal = await tx.wait();
            console.log(bal);
            
        }catch(e){
            console.log(e);

        }

    },





}

