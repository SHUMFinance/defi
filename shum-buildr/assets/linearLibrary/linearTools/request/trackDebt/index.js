import linearData from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";
import _ from "lodash";
import { formatEtherToNumber } from "@/assets/linearLibrary/linearTools/format";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { ethers } from "ethers";
import { getOtherNetworks } from "../../network";

export const fetchTrackDebt = async walletAddress => {
    try {
        let otherNetWorkId = getOtherNetworks(
            $nuxt.$store.state?.walletNetworkId
        );

        let [
            minted,
            burned,
            oetherNetWorkMinted,
            oetherNetWorkBurned
        ] = await Promise.all([
            linearData.lnr.minted({ account: walletAddress }),
            linearData.lnr.burned({ account: walletAddress }),
            linearData.lnr.minted({
                account: walletAddress,
                networkId: otherNetWorkId
            }),
            linearData.lnr.burned({
                account: walletAddress,
                networkId: otherNetWorkId
            })
        ]);

        minted = minted.concat(oetherNetWorkMinted);
        burned = burned.concat(oetherNetWorkBurned);

        let totalMinted = 0,
            totalBuild = 0,
            issuedDebt = 0,
            debtSnapshot = [];

        minted.map((record, index) => {
            totalMinted += record.value;
        });

        burned.map((record, index) => {
            totalBuild += record.value;
        }); //it`s shouldn`t record in burn when user exchange lusd to other synth //console.log(minted, burned); //console.log(issuedDebt, totalMinted, totalBuild);
        issuedDebt = totalMinted - totalBuild;
        // console.log(issuedDebt, "issuedDebt");

        if (totalMinted) {
            const {
                lnrJS: { LnDebtSystem },
                utils
            } = lnrJSConnector;

            let timestampArr = [],
                todayZeroTime = 0;

            todayZeroTime =
                new Date(new Date().toLocaleDateString()).getTime() / 1000;

            timestampArr.push(todayZeroTime - 86400 * 2);
            timestampArr.push(todayZeroTime - 86400 * 1);
            timestampArr.push(todayZeroTime);

            const [selfDebt3, selfDebt2, selfDebt] = await Promise.all([
                linearData.lnr.updateUserDebt({
                    max: 1,
                    filter: {
                        account: `\\"${walletAddress}\\"`,
                        timestamp_lte: timestampArr[0]
                    }
                }),
                linearData.lnr.updateUserDebt({
                    max: 1,
                    filter: {
                        account: `\\"${walletAddress}\\"`,
                        timestamp_lte: timestampArr[1]
                    }
                }),
                linearData.lnr.updateUserDebt({
                    max: 1,
                    filter: {
                        account: `\\"${walletAddress}\\"`,
                        timestamp_lte: timestampArr[2]
                    }
                })
            ]);

            const [globalDebt3, globalDebt2, globalDebt] = await Promise.all([
                linearData.lnr.updateUserDebt({
                    max: 1,
                    filter: { timestamp_lte: timestampArr[0] }
                }),
                linearData.lnr.updateUserDebt({
                    max: 1,
                    filter: { timestamp_lte: timestampArr[1] }
                }),
                linearData.lnr.updateUserDebt({
                    max: 1,
                    filter: { timestamp_lte: timestampArr[2] }
                })
            ]);

            let PUNIT = utils.parseEther("1000000000");
            let HALF = utils.parseEther("0.000000001");

            if (selfDebt3.length != 0) {
                let temp3 = ethers.BigNumber.from(globalDebt3[0].debtFactor)
                    .mul(PUNIT)
                    .div(selfDebt3[0].debtFactor)
                    .mul(selfDebt3[0].debtProportion)
                    .div(PUNIT);
                let currentDebt3 = formatEtherToNumber(
                    ethers.BigNumber.from(globalDebt3[0].totalAssetSupplyInUsd)
                        .mul(HALF)
                        .mul(temp3)
                        .div(PUNIT)
                        .div(HALF)
                );
                debtSnapshot.push([
                    (timestampArr[0] - 86400) * 1000,
                    currentDebt3
                ]);
            } else {
                debtSnapshot.push([(timestampArr[0] - 86400) * 1000, 0]);
            }

            if (selfDebt2.length != 0) {
                let temp2 = ethers.BigNumber.from(globalDebt2[0].debtFactor)
                    .mul(PUNIT)
                    .div(selfDebt2[0].debtFactor)
                    .mul(selfDebt2[0].debtProportion)
                    .div(PUNIT);
                let currentDebt2 = formatEtherToNumber(
                    ethers.BigNumber.from(globalDebt2[0].totalAssetSupplyInUsd)
                        .mul(HALF)
                        .mul(temp2)
                        .div(PUNIT)
                        .div(HALF)
                );
                debtSnapshot.push([
                    (timestampArr[1] - 86400) * 1000,
                    currentDebt2
                ]);
            } else {
                debtSnapshot.push([(timestampArr[1] - 86400) * 1000, 0]);
            }

            if (selfDebt.length != 0) {
                let temp = ethers.BigNumber.from(globalDebt[0].debtFactor)
                    .mul(PUNIT)
                    .div(selfDebt[0].debtFactor)
                    .mul(selfDebt[0].debtProportion)
                    .div(PUNIT);
                let currentDebt = formatEtherToNumber(
                    ethers.BigNumber.from(globalDebt[0].totalAssetSupplyInUsd)
                        .mul(HALF)
                        .mul(temp)
                        .div(PUNIT)
                        .div(HALF)
                );
                debtSnapshot.push([
                    (timestampArr[2] - 86400) * 1000,
                    currentDebt
                ]);
            } else {
                debtSnapshot.push([(timestampArr[2] - 86400) * 1000, 0]);
            }

            let tempCurrentDebt = await LnDebtSystem.GetUserDebtBalanceInUsd(
                walletAddress
            );

            tempCurrentDebt = formatEtherToNumber(tempCurrentDebt[0]);
            debtSnapshot.push([
                Date.parse(new Date()),
                _.floor(tempCurrentDebt, 2)
            ]);
        }

        return { issuedDebt: issuedDebt, currentDebt: debtSnapshot };
    } catch (e) {
        console.error(e, "fetchTrackDebt error");
    }
};
