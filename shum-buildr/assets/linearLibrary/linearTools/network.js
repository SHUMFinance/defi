import _ from "lodash";
import {
    NETWORK_SPEEDS_TO_KEY,
    GWEI_UNIT,
    GAS_LIMIT_BUFFER
} from "./constants/network";
import { URLS } from "./constants/urls";
import api from "@/api";

/**
 * ethererm网络
 */
export const ETHEREUM_NETWORKS = {
    1: "MAINNET",
    3: "ROPSTEN",
    //10001: "ETHDEV"
};

/**
 * bsc网络
 */
export const BINANCE_NETWORKS = {
    56: "BSCMAINNET",
    97: "BSCTESTNET",
    //10056: "BSCDEV"
};

/**
 * 主网网络
 */
export const MAINNET_NETWORKS = {
    1: "MAINNET",
    56: "BSCMAINNET"
};

/**
 * 测试网网络
 */
export const TESTNET_NETWORKS = {
    3: "ROPSTEN",
    97: "BSCTESTNET",
    //10001: "ETHDEV",
    //10056: "BSCDEV"
};

//xxl TODO need To change ...
export const ETHDEV_NETWORKS = {
    10001: "ETHDEV"
};

// export const BSCDEV_NETWORKS = {
//     10056: "BSCDEV"
// };
export const BSCDEV_NETWORKS = {
    10056: "BSCDEV",
    97: "BSCTESTNET",
};

export const DEV_NETWORKS = { ...ETHDEV_NETWORKS, ...BSCDEV_NETWORKS };

// const MAINNET_RELATIVE_NETWORKS = {
//     1: "MAINNET",
//     56: "BSCMAINNET"
// };

// const TESTNET_RELATIVE_NETWORKS = {
//     3: "ROPSTEN",
//     97: "BSCTESTNET"
// };

const DEV_RELATIVE_NETWORKS = {
    10001: "ETHDEV",
    10056: "BSCDEV"
};

//有liquidation的网络
export const LIQUIDATION_NETWORKS = {
    56: "BSCMAINNET",
    //xxl 00 add config
    //10056: "BSCDEV"
    97: "BSCTESTNET"
};

export const isEthereumNetwork = walletNetworkId =>
    ETHEREUM_NETWORKS.hasOwnProperty(walletNetworkId);
export const isBinanceNetwork = walletNetworkId =>
    BINANCE_NETWORKS.hasOwnProperty(walletNetworkId);
export const isMainnetNetwork = walletNetworkId =>
    MAINNET_NETWORKS.hasOwnProperty(walletNetworkId);
export const isTestnetNetwork = walletNetworkId =>
    TESTNET_NETWORKS.hasOwnProperty(walletNetworkId);
export const isDevNetwork = walletNetworkId =>
    DEV_NETWORKS.hasOwnProperty(walletNetworkId);
export const isEthDevNetwork = walletNetworkId =>
    ETHDEV_NETWORKS.hasOwnProperty(walletNetworkId);
export const isBscDevNetwork = walletNetworkId =>
    BSCDEV_NETWORKS.hasOwnProperty(walletNetworkId);
export const isSupportNetwork = walletNetworkId =>
    SUPPORTED_NETWORKS.hasOwnProperty(walletNetworkId);

/**
 * 获取所在网络其他网络id
 * @param walletNetworkId 网络Id
 */
export const getOtherNetworks = walletNetworkId => {
    let other = [];

    console.log("xxl getOtherNetworks :" + walletNetworkId);
    if (isMainnetNetwork(walletNetworkId)) {
        other = Object.keys(
            _.omit(MAINNET_RELATIVE_NETWORKS, [walletNetworkId])
        );
    } else if (isDevNetwork(walletNetworkId)) {
        other = Object.keys(_.omit(DEV_RELATIVE_NETWORKS, [walletNetworkId]));
    } else if (isTestnetNetwork(walletNetworkId)) {
        other = Object.keys(
            _.omit(TESTNET_RELATIVE_NETWORKS, [walletNetworkId])
        );
    }
    return other.join();
};

export const SUPPORTED_NETWORKS = { ...ETHEREUM_NETWORKS, ...BINANCE_NETWORKS };

export const SUPPORTED_NETWORKS_MAP = _.invert(SUPPORTED_NETWORKS);

export const SUPPORTED_WALLETS_MAP = {
    METAMASK: "MetaMask",
    BINANCE_CHAIN: "BinanceChain",
    WALLET_CONNECT: "WalletConnect"
};

/**
 * PC端钱包安装地址
 */
export const WALLET_EXTENSIONS = {
    METAMASK:
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
    BINANCE:
        "https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp"
};

/**
 * 区块链浏览器地址
 */
export const BLOCKCHAIN_BROWSER = {
    1: "https://etherscan.io/tx/",
    3: "https://ropsten.etherscan.io/tx/",
    56: "https://bscscan.com/tx/",
    97: "https://testnet.bscscan.com/tx/",
    10001: "https://master.explorer.eth.dev.linear.finance/tx/",
    10056: "https://master.explorer.bsc.dev.linear.finance/tx/"
};

export const BLOCKCHAIN_BROWSER_API = {
    1: "https://api.etherscan.io/api",
    3: "https://api-ropsten.etherscan.io/api",
    56: "https://api.bscscan.com/api",
    97: "https://api-testnet.bscscan.com/api",
    10001: "https://master.explorer.eth.dev.linear.finance/api",
    10056: "https://master.explorer.bsc.dev.linear.finance/api"
};

export const TOKEN_BRIDGE_API = {
    1: process.env.TOKEN_BRIDGE_MAINNET,
    3: process.env.TOKEN_BRIDGE_TESTNET,
    56: process.env.TOKEN_BRIDGE_MAINNET,
    97: process.env.TOKEN_BRIDGE_TESTNET,
    10001: process.env.TOKEN_BRIDGE_DEV,
    10056: process.env.TOKEN_BRIDGE_DEV
};

/**
 * 链切换类型
 * network 钱包内切换网络
 * wallet 切换钱包
 */
export const CHAIN_CHANGE_TYPE = {
    NETWORK: "network",
    WALLET: "wallet"
};

/**
 * 默认gas 限制
 */
export const DEFAULT_GAS_LIMIT = {
    approve: 300000,
    staking: 300000,
    build: 500000,
    burn: 500000,
    unstake: 500000,
    claim: 140000,
    exchange: 22000,
    freeze: 200000,
    unfreeze: 200000
};

/**
 * 钱包信息更新状态
 */
export const WALLET_STATUS = {
    UNINIT: -1, //未初始化
    UPDATING: 0, //更新中
    FINISH: 1, //更新完成
    ERROR: 2 //更新失败
};

//infura project id
export const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

export const INFURA_JSON_RPC_URLS = {
    1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    3: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`
};

// export const BLOCKCHAIN = {
//     ETHEREUM: "ethereum",
//     BINANCE: "binance"
// };

//RPC网络配置
export const ETHEREUM_CHAIN_OPTIONS = {
    56: {
        chainName: "BSC Mainnet",
        rpcUrls: ["https://bsc-dataseed1.binance.org/"],
        chainId: "0x38",
        nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18
        },
        blockExplorerUrls: ["https://bscscan.com"]
    }
};

export async function getEthereumNetwork() {
    const isMobile = $nuxt.$store.state?.isMobile;
    if (!window.ethereum && !isMobile) {
        window.open(WALLET_EXTENSIONS.METAMASK);
        return {};
    }
    let networkId = 1;
    try {
        if (window.ethereum?.chainId) {
            networkId = Number(window.ethereum?.chainId);
            return {
                name: SUPPORTED_NETWORKS[networkId],
                networkId: networkId
            };
        } else if (window.ethereum?.networkVersion) {
            networkId = Number(window.ethereum?.networkVersion);
            return {
                name: SUPPORTED_NETWORKS[networkId],
                networkId: networkId
            };
        }
    } catch (e) {
        console.log(e);
    }
}

export async function getBinanceNetwork() {
    const isMobile = $nuxt.$store.state?.isMobile;
    if (!window.BinanceChain && !isMobile) {
        window.open(WALLET_EXTENSIONS.BINANCE);
        return {};
    }
    let networkId = 56;
    try {
        if (window.BinanceChain?.chainId) {
            networkId = Number(window.BinanceChain?.chainId);
            return {
                name: SUPPORTED_NETWORKS[networkId],
                networkId: networkId
            };
        }
    } catch (e) {
        console.log(e);
    }
}

export const getNetworkSpeeds = async walletNetworkId => {
    !walletNetworkId && (walletNetworkId = $nuxt.$store.state?.walletNetworkId);

    if (isDevNetwork(walletNetworkId)) {
        return {
            [NETWORK_SPEEDS_TO_KEY.SLOW]: {
                price: 10,
                time: 1
            },
            [NETWORK_SPEEDS_TO_KEY.MEDIUM]: {
                price: 15,
                time: 0.5
            },
            [NETWORK_SPEEDS_TO_KEY.FAST]: {
                price: 20,
                time: 0.2
            }
        };
    } else if (isEthereumNetwork(walletNetworkId)) {
        let result = await fetch(URLS.ETH_GAS_STATION, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        });
        if (result?.status != 200) {
            result = await fetch(URLS.DEFI_PULSE_STATION, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });
        }
        const networkInfo = await result.json();
        return {
            [NETWORK_SPEEDS_TO_KEY.SLOW]: {
                price: networkInfo.safeLow / 10,
                time: networkInfo.safeLowWait
            },
            [NETWORK_SPEEDS_TO_KEY.MEDIUM]: {
                price: networkInfo.average / 10,
                time: networkInfo.avgWait
            },
            [NETWORK_SPEEDS_TO_KEY.FAST]: {
                price: networkInfo.fast / 10,
                time: networkInfo.fastWait
            }
        };
    } else if (isBinanceNetwork(walletNetworkId)) {
        let currentGasPrice = 20;
        const res = await api.getBSCGasPrice(walletNetworkId);
        if (res?.result) {
            currentGasPrice = unFormatGasPrice(res.result);
        }

        return {
            [NETWORK_SPEEDS_TO_KEY.SLOW]: {
                price: currentGasPrice * 0.75,
                time: 1
            },
            [NETWORK_SPEEDS_TO_KEY.MEDIUM]: {
                price: currentGasPrice,
                time: 0.5
            },
            [NETWORK_SPEEDS_TO_KEY.FAST]: {
                price: currentGasPrice * 1.25,
                time: 0.2
            }
        };
    }
};

export const formatGasPrice = gasPrice => gasPrice * GWEI_UNIT;

export const unFormatGasPrice = gasPrice => gasPrice / GWEI_UNIT;

export function onMetamaskAccountChange(cb) {
    if (!window.ethereum) return;
    const listener = _.throttle(cb, 2000);
    window.ethereum.on("accountsChanged", listener);
}

export function onMetamaskChainChange(cb) {
    if (!window.ethereum) return;
    const listener = _.throttle(cb, 2000);
    window.ethereum.on("chainChanged", listener);
}

export function onBinanceAccountChange(cb) {
    if (!window.BinanceChain) return;
    const listener = _.throttle(cb, 2000);
    window.BinanceChain.on("accountsChanged", listener);
}

export function onBinanceChainChange(cb) {
    if (!window.BinanceChain) return;
    const listener = _.throttle(cb, 2000);
    window.BinanceChain.on("chainChanged", listener);
}

export function onWalletConnectAccountChange(provider, cb) {
    if (!provider) return;
    const listener = _.throttle(cb, 2000);
    provider.on("accountsChanged", listener);
}

export function onWalletConnectChainChange(provider, cb) {
    if (!provider) return;
    const listener = _.throttle(cb, 2000);
    provider.on("chainChanged", listener);
}

export function onWalletConnectDisconnect(provider, cb) {
    if (!provider) return;
    const listener = _.throttle(cb, 2000);
    provider.on("disconnect", listener);
}

export const bufferGasLimit = gasLimit =>
    Math.round(Number(gasLimit) * (1 + GAS_LIMIT_BUFFER));

/**
 * 添加网络到metamask
 * @param {*} networkId  网络ID
 */
export const addEthereumChain = async networkId => {
    await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{ ...ETHEREUM_CHAIN_OPTIONS[networkId] }]
    });
};

/**
 * 检查连接的网络ID
 * @returns
 */
export const checkNetwork = async (networkId = null) => {
    if (!networkId) {
        const network = await getEthereumNetwork();
        networkId = network?.networkId;
    }
    return isSupportNetwork(networkId);
};
