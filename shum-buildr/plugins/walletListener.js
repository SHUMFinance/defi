//已在selectedWallet内实现,此处不用时可删


import PubSub from "pubsub-js";
import { storeDetailsData } from "@/assets/linearLibrary/linearTools/request";

export default async function({ store }) {
    PubSub.subscribe("onWalletAccountChange", (msg, wallet) => {
        //设置siger放到selectedWallet的onMetamaskAccountChange
        //存储数据
        storeDetailsData();
    });

    PubSub.subscribe("onWalletChainChange", (msg, wallet) => {
        // console.log("onWalletChainChange walletlistener");
        //xxl99 TODO
        //return;

        //存储数据
        storeDetailsData();
    });
}
