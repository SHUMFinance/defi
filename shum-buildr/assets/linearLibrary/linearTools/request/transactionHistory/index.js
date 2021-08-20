import linearData from "../linearData/transactionData";
import flatten from "lodash/flatten";
import _ from "lodash";
import { isBinanceNetwork, isEthereumNetwork, LIQUIDATION_NETWORKS } from "../../network";

export const PAGINATION_INDEX = 10;

export const TRANSACTION_EVENTS = [
    "Build",
    "Burn",
    "Claim",
    "Stake",
    "Unstake",
    "Transfer",
    "Referral",
    "Swap",
    "Swap",
    "Liquidated(Staked)",
    "Liquidated(Locked)"
];

export const fetchTransactionHistory = async (
    walletAddress,
    networkId = undefined
) => {
    try {
        const [
            Build,
            burned,
            feesClaimed,
            collaterals,
            redeemCollaterals,
            transfers,
            referrals,
            freeZes,
            unfreezes
        ] = await Promise.all([
            linearData.lnr.minted({ account: walletAddress, networkId }),
            linearData.lnr.burned({ account: walletAddress, networkId }),
            linearData.lnr.feesClaimed({ account: walletAddress, networkId }),
            linearData.lnr.collateral({ account: walletAddress, networkId }),
            linearData.lnr.redeemCollateral({
                account: walletAddress,
                networkId
            }),
            linearData.lnr.transfer({ account: walletAddress, networkId }),
            linearData.lnr.referral({ to: walletAddress, networkId }),
            linearData.lnr.freeZe({ depositor: walletAddress, networkId }),
            linearData.lnr.unfreeze({ recipient: walletAddress, networkId })
        ]);

        let tempDataArr = [
            Build,
            burned,
            feesClaimed,
            collaterals,
            redeemCollaterals,
            transfers,
            referrals,
            freeZes,
            unfreezes
        ];

        //如果是bsc main/bsc(私链)则检查liquidation
        if (LIQUIDATION_NETWORKS[networkId] !== undefined) {
            let [
                liquidatedStaked,
                liquidatedLocked
            ] = await Promise.all([
                linearData.lnr.liquidatedStakedCollateral({ account: walletAddress, networkId, value: '0' }),
                linearData.lnr.liquidatedLockedCollateral({ account: walletAddress, networkId, value: '0' })
            ]);

            tempDataArr.push(liquidatedStaked);
            tempDataArr.push(liquidatedLocked);
        }

        let chain; //链
        if (isEthereumNetwork(networkId)) {
            chain = "ethereum";
        } else if (isBinanceNetwork(networkId)) {
            chain = "binance";
        }

        const mergedArray = flatten(
            tempDataArr.map((eventType, i) => {
                return eventType.map(event => {
                    event.decimal = TRANSACTION_EVENTS[i] == "Swap" ? 4 : 2;
                    event.value
                        ? (event.value = _.floor(event.value, event.decimal))
                        : null;
                    event.amount
                        ? (event.amount = _.floor(event.amount, event.decimal))
                        : null;
                    event.rewardssUSD
                        ? (event.rewardssUSD = _.floor(event.rewardssUSD, 2))
                        : null;
                    event.rewardsLina
                        ? (event.rewardsLina = _.floor(event.rewardsLina, 2))
                        : null;
                    event.source
                        ? (event.source = event.source.replace(/l/, "ℓ"))
                        : null;
                    return event.type
                        ? { networkId, chain, ...event }
                        : {
                              networkId,
                              chain,
                              type: TRANSACTION_EVENTS[i],
                              ...event
                          };
                });
            })
        );

        //所有类型的交易记录按时间戳降序排序
        const orderData = mergedArray.sort(function(record1, record2) {
            return record2.timestamp - record1.timestamp;
        });
// console.log(orderData, "orderData");
        return orderData;
    } catch (e) {
        console.log(e, "fetchTransactionHistory error");
    }
};
