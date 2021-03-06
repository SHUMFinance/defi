import { getDefaultProvider } from "ethers";
import addresses from "./lib/addresses";

const SUPPORTED_NETWORKS = {
    1: "mainnet",
    42: "ropsten",
    56: "bscmainnet", //bsc主网
    97: "bsctestnet", //bsc测试网
    //10001: "ethdev", // eth dev
    //10056: "bscdev" //bsc dev
};

const API_KEY = {
    infura: process.env.INFURA_PROJECT_ID,
    etherscan: process.env.ETHERSCAN_KEY,
    alchemy: process.env.ALCHEMY_KEY
};

export const RPC_URL = {
    56: "https://bsc-dataseed1.binance.org",
    97: "https://data-seed-prebsc-2-s1.binance.org:8545",
    42: "https://kovan.infura.io/v3/7e31d49d7c8a48f4a4539aff9da768e7"
    // 10001: "https://master.http.eth.dev.linear.finance",
    // 10056: "https://master.http.bsc.dev.linear.finance"
};

class ContractSettings {
    constructor(contractSettings) {
        contractSettings = contractSettings || {};
        const { provider, signer, networkId } = contractSettings;
        this.networkId = networkId || 1;
        this.network = SUPPORTED_NETWORKS[Number(this.networkId)];
        this.provider = provider || getDefaultProvider();
        if (!provider && networkId) {
            let tempNetwork = this.network;

            // if ([56, 97, 10001, 10056].includes(this.networkId)) {
            if ([42,56, 97].includes(this.networkId)) {
                tempNetwork = RPC_URL[this.networkId];
            }
            console.log("xxl3 ContractSettings start");
            console.log("xxl3 " + tempNetwork + " : " + API_KEY.infura);

            this.provider = getDefaultProvider(tempNetwork, API_KEY);
        }
        this.signer = signer;
        this.addressList = addresses[this.networkId];

        console.log("xxl3 ContractSettings ");
        console.log(this.addressList);
    }
}

ContractSettings.SUPPORTED_NETWORKS = SUPPORTED_NETWORKS;

export default ContractSettings;
