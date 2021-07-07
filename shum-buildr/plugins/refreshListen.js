/**
 * 用于循环更新钱包面板数据
 * */

import PubSub from "pubsub-js";
import { storeDetailsData } from "@/assets/linearLibrary/linearTools/request";

export default async function({ store }) {
    PubSub.subscribe("onWalletDetailsLoopRefreshStart", async msg => {
        await storeDetailsData();
    });

    PubSub.subscribe("onWalletDetailsLoopRefreshStop", async msg => {
        store.commit("setLoopRefreshStatus", false);
    });
}
