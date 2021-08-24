import {
    isEthereumNetwork,
    BLOCKCHAIN_BROWSER_API,
    TOKEN_BRIDGE_API,
    isMainnetNetwork
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
    }
};
