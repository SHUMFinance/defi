<template>
    <div>
        <notificationQueue> </notificationQueue>

        <!-- <watingEnhance
            :currentStep="confirmTransactionStep"
            :currentHash="confirmTransactionHash"
            :currentConfirm="confirmTransactionStatus"
            :currentNetworkId="walletNetworkId"
            :currentErrMsg="transactionErrMsg"
            :setupArray="waitProcessArray"
        ></watingEnhance> -->
    </div>
</template>

<script>
//通知测试页, 无用时删除本页

import { BUILD_PROCESS_SETUP } from "@/assets/linearLibrary/linearTools/constants/process";
import notificationQueue from "@/components/notification/notificationQueue.vue";
export default {
    components: {
        notificationQueue
    },
    name: "",
    data() {
        return {
            waitProcessArray: ["Confirm Staking", "Confirm Building"],
            transactionErrMsg: null,
            confirmTransactionStep: 0,
            confirmTransactionHash:"0x5eb146eb55ce95345e96f88b03139d34bde5d4f0caf4c6427119e07fd5315c0e",
            confirmTransactionStatus: false,
            walletNetworkId: 1
        };
    },
    mounted() {
        this.$pub.publish("notificationQueue", {
            hash: "0x5eb146eb55ce95345e96f88b03139d34bde5d4f0caf4c6427119e07fd5315c0e",
            type: BUILD_PROCESS_SETUP.FREEZE,
            networkId: "1",
            value: "Building 1/4",
            unit: 1
        });
        this.$pub.publish("notificationQueue", {
            hash: "0x1744414c0e1211a89d178b3b6310950e5956fd0de9a26bb5a0e88d1b851a11c3",
            type: BUILD_PROCESS_SETUP.UNFREEZE,
            networkId: "3",
            value: "Building 2/4",
            unit: 1
        });
        this.$pub.publish("notificationQueue", {
            hash: "0x5eb146eb55ce95345e96f88b03139d34bde5d4f0caf4c6427119e07fd5315c0e",
            type: BUILD_PROCESS_SETUP.UNSTAKING,
            networkId: "56",
            value: "Building 3/4",
            unit: 2
        });
        /* setTimeout(() => {
            this.$pub.publish("notificationQueue", {
                hash: "0x5eb146eb55ce95345e96f88b03139d34bde5d4f0caf4c6427119e07fd5315c0e",
                type: BUILD_PROCESS_SETUP.BURN,
                 networkId: 97,
                value: "Building 4/4",
                unit: 0
            });
        }, 1500); */
    }
};
</script>

<style lang="scss" scoped></style>
