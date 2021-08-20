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


        console.log("xxl LinearJs constructor ");
        contractSettings = new ContractSettings(contractSettings);

        console.log("xxl LinearJs constructor 01");

        this.signers = signers;
        this.contractSettings = contractSettings;
        const { network } = contractSettings;
        this.network = network;

        const contractForEnv = contracts[network];
        Object.keys(contractForEnv).map(name => {
            const Contract = contractForEnv[name];
            this[name] = new Contract(contractSettings);
        });

        const utils = new util(contractSettings);
        this.utils = { ...utils, ...ethers.utils };
        console.log("xxl LinearJs end");

    }
}

LinearJs.signers = signers;
