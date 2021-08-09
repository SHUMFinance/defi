import {
    getEthereumNetwork,
    getBinanceNetwork,
    SUPPORTED_WALLETS_MAP,
    INFURA_PROJECT_ID,
    onMetamaskAccountChange,
    onBinanceAccountChange,
    onWalletConnectAccountChange,
    onBinanceChainChange,
    onMetamaskChainChange,
    onWalletConnectChainChange,
    onWalletConnectDisconnect,
    CHAIN_CHANGE_TYPE,
    INFURA_JSON_RPC_URLS,
    SUPPORTED_NETWORKS
} from "./network";
import { LinearJs } from "../linearJs";
import $pub from "pubsub-js";
import { storeDetailsData } from "./request";
import { RPC_URL } from "../linearJs/contractSettings";
import { UpdateWalletConnectSigner } from "../linearJs/lib/signers/walletConnectSigner";

let lnrJSConnector = {
    signers: LinearJs.signers,
    setContractSettings: function(contractSettings) {

        console.log("xxl lnrJSConnector 01");
        console.log(contractSettings);
        
        this.lnrJS = new LinearJs(contractSettings);
        console.log(this.lnrJS.contractSettings);

        this.signer = this.lnrJS.contractSettings.signer;  
        this.provider = this.lnrJS.contractSettings.provider;
        this.utils = this.lnrJS.utils;
    }
};

export const defaultNetwork = {
    name: "MAINNET",
    networkId: 1
};

export const connectToWallet = async networkType => {
    try {
        console.log("xxl come to connectToWallet networkType");

        let network;
        let registeredWalletConnectEvents =
            $nuxt.$store.state?.registeredWalletConnectEvents;
        if (networkType == SUPPORTED_WALLETS_MAP.BINANCE_CHAIN) {
            return {};
            network = await getBinanceNetwork();
        } else if (networkType == SUPPORTED_WALLETS_MAP.METAMASK) {
            network = await getEthereumNetwork();
        } else if (networkType == SUPPORTED_WALLETS_MAP.WALLET_CONNECT) {
            if (registeredWalletConnectEvents) {
                //当连接到walletconnect 时获取网络id的方式
                network = {
                    name:
                        SUPPORTED_NETWORKS[
                            lnrJSConnector.signer.provider.provider.chainId
                        ],
                    networkId: lnrJSConnector.signer.provider.provider.chainId
                };
            } else {
                //设置一个默认的网络类型
                network = defaultNetwork;
            }
        }

        const { name, networkId } = network;

        console.log("xxl name : " + name + " networkId : " + networkId);

        //  [1, 56].includes(networkId)
        if (!SUPPORTED_NETWORKS[networkId]) {
            $nuxt.$store.commit("setAutoConnect", false);
            $nuxt.$store.commit("setWalletType", "");
            await lnrJSConnector?.signer?.provider?.provider?.disconnect();
            location.reload();
            throw new Error("not support network");
        }

        //当连接方式为wallet_connect 且已经设置监听方式时,不要再去重新生成signer，改用updateWalletConnectWeb3Provider去更新provider
        if (!registeredWalletConnectEvents) {
            setSigner({ type: networkType, networkId });
        }

        //setSigner({ type: networkType, networkId });
        switch (networkType) {
            case SUPPORTED_WALLETS_MAP.METAMASK:
                return connectToMetamask(networkId, name);
            case SUPPORTED_WALLETS_MAP.BINANCE_CHAIN:
                return connectToBinance(networkId, name);
            case SUPPORTED_WALLETS_MAP.WALLET_CONNECT:
                return connectToWalletConnect(networkId, name);
            default:
                return {};
        }

    } catch (error) {
        console.log(error, "connectToWallet error");
        return {};
    }
};

const connectToMetamask = async (networkId, networkName) => {

    console.log("xxl come to connectToMetamask networkType networkName");


    const walletState = {
        walletType: SUPPORTED_WALLETS_MAP.METAMASK
    };
    try {
        if (window.ethereum) {
            // window.ethereum.autoRefreshOnNetworkChange = true;
            await window.ethereum.enable();
        }

        const accounts = await lnrJSConnector.signer.getNextAddresses();

        console.log("xxl the accounts is :");
        console.log(accounts);


        if (accounts && accounts.length > 0) {
            return {
                ...walletState,
                currentWallet: accounts[0],
                networkId,
                networkName: networkName.toLowerCase()
            };
        } else {
            return {
                ...walletState
            };
        }
    } catch (e) {
        console.log(e);
        return {
            ...walletState,
            msg: e
        };
    }
};

const connectToBinance = async (networkId, networkName) => {

    console.log("xxl come to connectToWallet connectToBinance");
    const walletState = {
        walletType: SUPPORTED_WALLETS_MAP.BINANCE_CHAIN
    };
    try {
        if (window.BinanceChain) {
            // window.BinanceChain.autoRefreshOnNetworkChange = true;
            await window.BinanceChain.enable();
        }
        const accounts = await lnrJSConnector.signer.getNextAddresses();
        if (accounts && accounts.length > 0) {
            return {
                ...walletState,
                currentWallet: accounts[0],
                networkId,
                networkName: networkName.toLowerCase()
            };
        } else {
            return {
                ...walletState
            };
        }
    } catch (e) {
        console.log(e);
        return {
            ...walletState,
            msg: e
        };
    }
};

const connectToWalletConnect = async (networkId, networkName) => {

    console.log("xxl come to connectToWalletConnect");
    const walletState = {
        walletType: SUPPORTED_WALLETS_MAP.WALLET_CONNECT
    };
    try {
        //启动
        if (!lnrJSConnector.signer.provider.provider.connected) {
            //每次刷新界面的时候断开walletConnect 连接
            //await lnrJSConnector.signer.provider.provider.disconnect();
            await lnrJSConnector.signer.provider.provider.enable();
            $nuxt.$store.commit("setWalletConnect", {
                qrcode: false
            });
        }

        //这里存在的原因是当enable时会改变chainId
        networkId = lnrJSConnector.signer.provider.provider.chainId;

        if (!SUPPORTED_NETWORKS[networkId]) {
            $nuxt.$store.commit("setAutoConnect", false);
            $nuxt.$store.commit("setWalletType", "");
            await lnrJSConnector.signer.provider.provider.disconnect();
            location.reload();
            throw new Error("not support network");
        }

        networkName = SUPPORTED_NETWORKS[networkId];
        //更新web3Provider,不然会出现调用合约方法出错的问题
        updateWalletConnectWeb3Provider({
            type: walletState.walletType,
            networkId
        });

        const accounts = await lnrJSConnector.signer.getNextAddresses();
        if (accounts && accounts.length > 0) {
            return {
                ...walletState,
                currentWallet: accounts[0],
                networkId,
                networkName: networkName.toLowerCase()
            };
        }
    } catch (e) {
        console.log(e);
        return {
            ...walletState,
            msg: e
        };
    }
};

//更新wallect connect signer
const updateWalletConnectWeb3Provider = ({ type, networkId }) => {
    if (type !== SUPPORTED_WALLETS_MAP.WALLET_CONNECT) {
        return;
    }

    let signer = UpdateWalletConnectSigner({
        provider: lnrJSConnector.signer.provider.provider
    });
    lnrJSConnector.setContractSettings({
        networkId,
        signer
    });
};

export const setSigner = ({ type, networkId }) => {

    console.log("xxl set signer type :" + type + " networkId:" + networkId);

    const signer = new lnrJSConnector.signers[type](
        getSignerConfig({ type, networkId })
    );

    console.log("xxl signer ...");
    console.log(signer);
    console.log("xxl signer end ");

    lnrJSConnector.setContractSettings({
        networkId,
        signer
    });

    console.log("xxl setContractSettings end ");

};

const getSignerConfig = ({ type, networkId }) => {
    if (type === SUPPORTED_WALLETS_MAP.WALLET_CONNECT) {
        let rpc = { ...INFURA_JSON_RPC_URLS, ...RPC_URL };
        return {
            chainId: networkId,
            infuraId: INFURA_PROJECT_ID,
            rpc
        };
    }
    return {};
};

/**
 * 选择钱包
 * @param walletType 钱包类型
 * @param waitStore  是否等待数据获取完成
 */
export const selectedWallet = async (walletType, waitStore = true) => {


    console.log("xxl selectedWallet ...");

    //walletType = SUPPORTED_WALLETS_MAP.WALLET_CONNECT;
    try {
        //连接钱包
        const walletStatus = await connectToWallet(walletType);
        $nuxt.$Spin.show();
        const store = $nuxt.$store;

        //连接成功
        if (walletStatus && walletStatus.currentWallet) {
            store.commit(
                "setWalletNetworkName",
                walletStatus?.networkName.toUpperCase()
            );
            store.commit(
                "setWalletNetworkId",
                walletStatus.networkId.toString()
            );

            store.commit("setAutoConnect", true);

            //防止onWalletAccountChange内数据未更新时,太快进入功能子页获取不到wallet的问题
            store.commit("mergeWallet", {
                address: walletStatus?.currentWallet
            });

            store.commit("setWalletType", walletType);

            //不重复注册事件,防止事件叠加
            let registeredMetamaskWalletEvents =
                store.state?.registeredMetamaskWalletEvents;
            let registeredBinanceWalletEvents =
                store.state?.registeredBinanceWalletEvents;
            let registeredWalletConnectEvents =
                store.state?.registeredWalletConnectEvents;

            //绑定事件
            if (
                walletType == SUPPORTED_WALLETS_MAP.METAMASK &&
                !registeredMetamaskWalletEvents
            ) {
                onMetamaskAccountChange(async accounts => {
                    //当前链的钱包切换时才执行更新
                    if (
                        store.state.walletType == SUPPORTED_WALLETS_MAP.METAMASK
                    ) {
                        $nuxt.$Spin.show();
                        let { networkId } = await getEthereumNetwork();

                        const address = await lnrJSConnector.signer.getNextAddresses();
                        const signer = new lnrJSConnector.signers[
                            SUPPORTED_WALLETS_MAP.METAMASK
                        ]({});

                        lnrJSConnector.setContractSettings({
                            networkId,
                            signer
                        });

                        store.commit("mergeWallet", {
                            address: address[0]
                        });

                        store.commit("setWalletDetails", {}); //清理数据
                        await storeDetailsData();
                        $pub.publish("onWalletAccountChange");
                        $nuxt.$Spin.hide();
                    }
                });

                //切换网络刷新页面
                onMetamaskChainChange(async chainId => {
                    if (
                        store.state.walletType == SUPPORTED_WALLETS_MAP.METAMASK
                    ) {
                        store.commit("setWalletDetails", {}); //清理数据
                        const status = await selectedWallet(
                            SUPPORTED_WALLETS_MAP.METAMASK
                        );
                        status &&
                            $pub.publish(
                                "onWalletChainChange",
                                CHAIN_CHANGE_TYPE.NETWORK
                            );
                    }
                });

                store.commit("setRegisteredMetamaskWalletEvents", true);
            } else if (
                walletType == SUPPORTED_WALLETS_MAP.BINANCE_CHAIN &&
                !registeredBinanceWalletEvents
            ) {
                onBinanceAccountChange(async accounts => {
                    //当前链的钱包切换时才执行更新
                    if (
                        store.state.walletType ==
                        SUPPORTED_WALLETS_MAP.BINANCE_CHAIN
                    ) {
                        $nuxt.$Spin.show();

                        const address = await lnrJSConnector.signer.getNextAddresses();
                        const signer = new lnrJSConnector.signers[
                            SUPPORTED_WALLETS_MAP.BINANCE_CHAIN
                        ]({});

                        lnrJSConnector.setContractSettings({
                            networkId: walletStatus.networkId,
                            signer
                        });

                        store.commit("mergeWallet", {
                            address: address[0]
                        });

                        await storeDetailsData();
                        $pub.publish("onWalletAccountChange");
                        $nuxt.$Spin.hide();
                    }
                });

                //切换网络刷新页面
                onBinanceChainChange(chainId => {
                    if (
                        store.state.walletType ==
                        SUPPORTED_WALLETS_MAP.BINANCE_CHAIN
                    ) {
                        location.reload();
                        // $pub.publish("onBinanceChainChange");
                    }
                });

                store.commit("setRegisteredBinanceWalletEvents", true);
            } else if (
                walletType == SUPPORTED_WALLETS_MAP.WALLET_CONNECT &&
                !registeredWalletConnectEvents
            ) {
                onWalletConnectAccountChange(
                    lnrJSConnector.signer.provider.provider,
                    async accounts => {
                        //当前链的钱包切换时才执行更新
                        if (
                            store.state.walletType ==
                                SUPPORTED_WALLETS_MAP.WALLET_CONNECT &&
                            store.state?.wallet.address != accounts[0]
                        ) {
                            $nuxt.$Spin.show();
                            let networkId =
                                lnrJSConnector.signer.provider.provider.chainId;

                            updateWalletConnectWeb3Provider({
                                type: SUPPORTED_WALLETS_MAP.WALLET_CONNECT,
                                networkId
                            });
                            const address = await lnrJSConnector.signer.getNextAddresses();

                            store.commit("mergeWallet", {
                                address: address[0]
                            });

                            store.commit("setWalletDetails", {}); //清理数据
                            await storeDetailsData();
                            $pub.publish("onWalletAccountChange");
                            $nuxt.$Spin.hide();
                        }
                    }
                );

                //切换网络刷新页面
                onWalletConnectChainChange(
                    lnrJSConnector.signer.provider.provider,
                    async chainId => {
                        if (
                            store.state.walletType ==
                            SUPPORTED_WALLETS_MAP.WALLET_CONNECT
                        ) {
                            store.commit("setWalletDetails", {}); //清理数据

                            const status = await selectedWallet(
                                SUPPORTED_WALLETS_MAP.WALLET_CONNECT
                            );
                            status &&
                                $pub.publish(
                                    "onWalletChainChange",
                                    CHAIN_CHANGE_TYPE.NETWORK
                                );
                        }
                    }
                );

                //断开连接
                onWalletConnectDisconnect(
                    lnrJSConnector.signer.provider.provider,
                    async (code, reason) => {
                        if (
                            store.state.walletType ==
                            SUPPORTED_WALLETS_MAP.WALLET_CONNECT
                        ) {
                            store.commit("setAutoConnect", false);
                            if (registeredWalletConnectEvents) {
                                await lnrJSConnector.signer.provider.provider.disconnect();
                                store.commit(
                                    "setRegisteredWalletConnectEvents",
                                    false
                                );
                            }
                            location.reload();
                        }
                    }
                );

                store.commit("setRegisteredWalletConnectEvents", true);
            }

            waitStore ? await storeDetailsData() : storeDetailsData();

            return true;
        } else {
            console.log("Connect wallet fail");
        }

        return false;
    } catch (error) {
        console.log(error, "selectedWallet error");
        return false;
    } finally {
        $nuxt.$Spin.hide();
    }
};

export default lnrJSConnector;
