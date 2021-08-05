import * as ethers from "ethers";

import MetaMask from "./lib/signers/metamaskSigner";
import BinanceChain from "./lib/signers/binanceSigner";
import WalletConnect from "./lib/signers/walletConnectSigner";
import PrivateKey from "./lib/signers/privateKeySigner";
import ContractSettings from "./contractSettings";
import contracts from "./contracts";
import util from "./util";

const signers = {
    MetaMask,
    BinanceChain,
    WalletConnect,
    PrivateKey
};

export class LinearJs {
    constructor(contractSettings, signers = { PrivateKey }) {

        console.log("xxl 11");
        contractSettings = new ContractSettings(contractSettings);

        console.log("xxl 12");
        this.signers = signers;
        this.contractSettings = contractSettings;
        const { network } = contractSettings;
        this.network = network;

        console.log("xxl 13");
        console.log(network);
        console.log(contracts);

        const contractForEnv = contracts[network];
        Object.keys(contractForEnv).map(name => {
            const Contract = contractForEnv[name];
            this[name] = new Contract(contractSettings);
        });

        console.log("xxl 14");
        const utils = new util(contractSettings);
        this.utils = { ...utils, ...ethers.utils };
    }
}

LinearJs.signers = signers;
