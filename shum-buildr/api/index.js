import {
    isEthereumNetwork,
    BLOCKCHAIN_BROWSER_API,
    TOKEN_BRIDGE_API,
    isMainnetNetwork,
    CENTER_BASE
} from "@/assets/linearLibrary/linearTools/network";

export default {
    async getReferralCode(wallet) {
        return await $nuxt.$axios
            .$post(`${process.env.BACKEND_API}/referral/getCode`, { wallet })
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                return Promise.reject(err.response);
            });
    },

    async checkReferralCode(wallet, referral_code) {
        return await this.addReferralCode(wallet, referral_code, true);
    },

    async addReferralCode(wallet, referral_code, only_check = false) {
        return await $nuxt.$axios
            .$post(`${process.env.BACKEND_API}/referral/addCode`, {
                wallet,
                referral_code,
                only_check
            })
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                return Promise.reject(err.response);
            });
    },

    async getBSCGasPrice(walletNetworkId = 56) {
        let url;
        if (isMainnetNetwork(walletNetworkId)) {
            url = "https://bsc-dataseed.binance.org";
        } else {
            url = "https://data-seed-prebsc-2-s1.binance.org:8545";
        }
        return await $nuxt.$axios
            .$post(url, {
                jsonrpc: "2.0",
                id: 1,
                method: "eth_gasPrice",
                params: []
            })
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                return Promise.reject(err.response);
            });
    },

    async getTokenPrice({ tokenid = [], target = "usd" }) {
        return await $nuxt.$axios
            .$get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${tokenid.join(
                    ","
                )}&vs_currencies=${target}`
            )
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                return Promise.reject(err.response);
            });
    },

    async getWalletBalance(address, networkId) {
        const apikey = isEthereumNetwork(networkId)
            ? process.env.ETHERSCAN_KEY
            : process.env.BSCSCAN_KEY;

        return await $nuxt.$axios
            .$get(BLOCKCHAIN_BROWSER_API[networkId], {
                params: {
                    module: "account",
                    action: "balance",
                    tag: "latest",
                    address,
                    apikey
                }
            })
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                return Promise.reject(err.response);
            });
    },

    async getTokenBalance(address, contractaddress, networkId) {
        const apikey = isEthereumNetwork(networkId)
            ? process.env.ETHERSCAN_KEY
            : process.env.BSCSCAN_KEY;

        return await $nuxt.$axios
            .$get(BLOCKCHAIN_BROWSER_API[networkId], {
                params: {
                    module: "account",
                    action: "tokenbalance",
                    tag: "latest",
                    address,
                    contractaddress,
                    apikey
                }
            })
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                return Promise.reject(err.response);
            });
    },

    async getDeposits(srcChainId, depositId) {
        return await $nuxt.$axios
            .$get(TOKEN_BRIDGE_API[srcChainId], {
                params: {
                    srcChainId,
                    depositId
                }
            })
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                return Promise.reject(err.response);
            });
    },

    async dealFreeZe(
        sourceWalletAddress,
        targetWalletAddress,
        sourceNetworkId,
        currency,
        status
    ){

        let url = CENTER_BASE + "depositRec"
        return await $nuxt.$axios
            .$post(url, {
                jsonrpc: "2.0",
                id: 1,
                data: {
                    sourceWalletAddress,
                    targetWalletAddress,
                    sourceNetworkId,
                    currency,
                    status
                }
            })
            .then(res => {
                return Promise.resolve(res.data.record);
            })
            .catch(err => {
                return Promise.reject(err.response);
        });
    },

    async setCrossResult(txid, targetTxid) {


        console.log("xxl setCrossResult ");
        let url = CENTER_BASE + "crossSet"
        return await $nuxt.$axios
            .$post(url, {
                jsonrpc: "2.0",
                id: 1,
                data: {
                    txid,
                    targetTxid
                }
            })
            .then(res => {
                console.log(res);
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log(err.response);
                return Promise.reject(err.response);
        });

    },

    /**
     * 获取当前价格
     * @param {string | strubg[]} txid 
     * @returns 
     */
    getTickerPrice(txid) {
        return $nuxt.$axios
            .$get('/api/v3/ticker/price', {
                params: {
                    symbol: txid
                },
                Headers:{
                    'Access-Control-Allow-Origin':'*'
                }
            }).then(res => {
                console.log("xxl getTickerPrice res");
                console.log(res);
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log("xxl getTickerPrice err");
                console.log(err);
                return Promise.reject(err.response);
            });
    },

    /**
     * 24hr 价格变动情况
     * @param {string} txid 
     * @returns 
     */
     get24hr(txid) {
        return $nuxt.$axios
            .$get('/api/v3/ticker/24hr', {
                params: {
                    symbol: txid
                },
                Headers:{
                    'Access-Control-Allow-Origin':'*'
                }
            }).then(res => {
                console.log("xxl getTickerPrice res");
                console.log(res);
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log("xxl getTickerPrice err");
                console.log(err);
                return Promise.reject(err.response);
            });
    },

    getHK24hr(txid) {
        return $nuxt.$axios
            .$get(`http://47.242.107.228:7789/24hr/${txid}`)
    },


    isExchangeApproved(address){

        console.log("xxl setCrossResult ");
        let url = CENTER_BASE + "isExchangeApprove/" + address

        return $nuxt.$axios
        .$get(url, {}).then(res => {
            console.log("xxl isExchangeApprove res");
            console.log(res);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            console.log("xxl isExchangeApprove err");
            console.log(err);
            return Promise.reject(err.response);
        });
    },


    setExchangeApprove(txid,address){

        console.log("xxl setExchangeApprove ");
        let url = CENTER_BASE + "setExchangeApprove"
        return $nuxt.$axios
            .$post(url, {
                jsonrpc: "2.0",
                id: 1,
                data: {
                    txid,
                    address
                }
            })
            .then(res => {
                console.log(res);
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log(err.response);
                return Promise.reject(err.response);
        });

    },

    setExchangeRecord(
        chainID,
        txid,
        sourceKey,                 // sourceKey
        sourceAmount,                        
        destAddr,                  // destAddr
        destKey
        ){

        console.log("xxl setExchangeRecord ");
        let url = CENTER_BASE + "setExchangeRecord"

        return $nuxt.$axios
            .$post(url, {
                jsonrpc: "2.0",
                id: 1,
                data: {
                    chainID,
                    txid,
                    sourceKey,
                    sourceAmount,
                    destAddr,
                    destKey
                }
            })
            .then(res => {
                console.log(res);
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log(err.response);
                return Promise.reject(err.response);
        });

    },

    //xxl ##01 setTransactionRecord 
    setTransactionRecord(
        txid,
        from,
        to,                
        value,                        
        chainType,         
        chain
        ){

        //console.log("xxl setTransactionRecord ");
        //

        console.log("xxl setTransactionRecord : " + CENTER_BASE);
        let url = CENTER_BASE + "setTransactionRecord"
        return $nuxt.$axios
            .$post(url, {
                jsonrpc: "2.0",
                id: 1,
                data: {
                    txid,
                    from,
                    to,                
                    value,                        
                    chainType,         
                    chain
                }
            })
            .then(res => {
                console.log(res);
                return Promise.resolve(res);
            })
            .catch(err => {
                console.log(err.response);
                return Promise.reject(err.response);
        });

    },

    //xxl ##01 getTransaction 
    getTransaction(address) {

        let url = CENTER_BASE + "getTransaction/" + address
        return $nuxt.$axios.$get(url)
    },

    getklines(symbol, startTime, endTime, interval = '1h') {

        let url = CENTER_BASE + "api/v3/klines"
        return $nuxt.$axios
            .$get(url, {
                params: {
                    symbol,
                    interval,
                    startTime,
                    endTime
                },
                Headers:{
                    'Access-Control-Allow-Origin':'*'
                }
            }).then(res => {
                // [
                //     1499040000000,      // 开盘时间
                //     "0.01634790",       // 开盘价
                //     "0.80000000",       // 最高价
                //     "0.01575800",       // 最低价
                //     "0.01577100",       // 收盘价(当前K线未结束的即为最新价)
                //     "148976.11427815",  // 成交量
                //     1499644799999,      // 收盘时间
                //     "2434.19055334",    // 成交额
                //     308,                // 成交笔数
                //     "1756.87402397",    // 主动买入成交量
                //     "28.46694368",      // 主动买入成交额
                //     "17928899.62484339" // 请忽略该参数
                // ]
                console.log("xxl 0001");
                console.log(res);
                console.log("xxl 0002");

                return Promise.resolve(res.data);
            })
            .catch(err => {
                return Promise.reject(err.response);
            });
    }


};
