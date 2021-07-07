<!-- pc/移动端单步交易 -->

<template>
    <div id="transferWating">
        <div class="title">Confirm with Wallet</div>

        <i-circle
            :size="140"
            :trail-width="6"
            :stroke-width="6"
            :percent="waitPercent"
            stroke-linecap="square"
            stroke-color="#1a38f8"
        >
            <div>
                <img
                    v-if="walletType == SUPPORTED_WALLETS_MAP.METAMASK"
                    src="@/static/metamask.svg"
                />
                <img
                    v-if="walletType == SUPPORTED_WALLETS_MAP.BINANCE_CHAIN"
                    src="@/static/binance.svg"
                />
            </div>
        </i-circle>

        <div class="loading">Loading…</div>

        <div class="descript">Your transaction is pending confirmation</div>

        <div class="btns">
            <div v-if="value" class="etherscan" @click="$emit('etherscan')">
                View on <template v-if="isEthereumNetwork">Etherscan</template>
                <template v-else> BSCscan</template>
                <span><img src="@/static/arrow_right.svg" /></span>
            </div>
            <div class="gap">&nbsp;</div>

            <div class="homepage" @click="$emit('homepage')">
                Go to Homepage
            </div>
        </div>
    </div>
</template>

<script>
import {
    isEthereumNetwork,
    SUPPORTED_WALLETS_MAP
} from "@/assets/linearLibrary/linearTools/network";
export default {
    name: "transferWating",
    props: ["value"], //实现v-model
    data() {
        return {
            waitPercent: 0, //等待进度
            waitPercentTimeId: 0, //等待进度计时器ID

            SUPPORTED_WALLETS_MAP
        };
    },
    watch: {
        walletType() {},
        isEthereumNetwork() {},
        walletNetworkId() {}
    },
    computed: {
        walletType() {
            return this.$store.state?.walletType;
        },

        isEthereumNetwork() {
            return isEthereumNetwork(this.walletNetworkId);
        },

        walletNetworkId() {
            return this.$store.state?.walletNetworkId;
        }
    },
    created() {
        this.$store.commit("setIsTransaction", true);
    },
    mounted() {
        this.waitPercentTimeId = setInterval(() => {
            this.waitPercent++;
        }, 50);
    },
    methods: {
        //实现v-model
        handleInput(e) {
            this.$emit("input", e.target.value);
        }
    },
    destroyed() {
        this.$store.commit("setIsTransaction", false);
        clearInterval(this.waitPercentTimeId);
    }
};
</script>

<style lang="scss">
#transferWating {
    .title {
        width: 400px;
        height: 40px;
        color: #5a575c;
        font-family: "Gilroy";
        font-size: 32px;
        font-weight: 400;
        line-height: 40px;
        text-align: center;
        margin: 64px auto 0 auto;
    }
    .ivu-chart-circle {
        margin: 150px 0 0 50%;
        transform: translateX(-50%);

        img {
            width: 80px;
            height: 80px;
        }
    }
    .loading {
        width: 103px;
        height: 32px;
        color: #5a575c;
        font-family: "Gilroy";
        font-size: 24px;
        font-weight: 400;
        line-height: 32px;
        text-align: center;
        margin: 40px auto 0 auto;
    }

    .descript {
        width: 315px;
        height: 24px;
        color: #5a575c;
        font-family: "Gilroy-Regular";
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        text-align: center;
        margin: 8px auto 0 auto;
    }
    .btns {
        width: 400px;
        height: 24px;
        display: flex;
        margin: 32px auto 0 auto;
    }
    .etherscan {
        flex: 1;
        width: 193px;
        height: 40px;
        border-radius: 20px;
        border: solid 1px #1a38f8;
        color: #1a38f8;
        font-family: "Gilroy";
        font-size: 12px;
        font-weight: 400;
        line-height: 40px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        cursor: pointer;

        img {
            display: none;
        }
    }
    .gap {
        width: 16px;
    }
    .homepage {
        flex: 1;
        width: 193px;
        height: 40px;
        border-radius: 20px;
        background: #1a38f8;
        color: #ffffff;
        font-family: "Gilroy";
        font-size: 12px;
        font-weight: 400;
        line-height: 40px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        cursor: pointer;
        transition: $animete-time linear;

        &:hover {
            background-color: #1a38f8;
        }
    }
}

@media only screen and (max-width: $max-phone-width) {
    #transferWating {
        width: 74.6vw;
        margin: 0 auto;

        .title {
            width: unset;
            height: unset;
            font-family: "Gilroy-Bold";
            font-size: 16px;
            line-height: 16px;
            text-align: left;
            margin: 24px 0 0;
        }
        .ivu-chart-circle {
            margin: 50px 0 0 50%;
            transform: translateX(-50%);

            img {
                width: 80px;
                height: 80px;
            }
        }
        .loading {
            width: unset;
            height: unset;
            color: #5a575c;
            font-size: 16px;
            line-height: 16px;
            margin: 40px auto 0 auto;
        }

        .descript {
            width: unset;
            height: unset;
            font-size: 12px;
            line-height: 12px;
            margin: 8px auto 0 auto;
        }
        .btns {
            width: unset;
            height: unset;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            margin: 50px auto 0 auto;
        }
        .etherscan {
            flex: 1;
            width: 100%;
            height: 12px;
            border-radius: unset;
            border: unset;
            color: #1a38f8;
            font-family: "Gilroy-Bold";
            font-size: 12px;
            font-weight: 400;
            line-height: 12px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            cursor: pointer;

            img {
                display: inline;
                display: inline;
                position: relative;
                top: 4px;
            }
        }
        .gap {
            width: 16px;
        }
        .homepage {
            flex: 1;
            width: 100%;
            height: 40px;
            border-radius: 20px;
            background: #1a38f8;
            color: #ffffff;
            font-family: "Gilroy-Bold";
            font-size: 12px;
            font-weight: 400;
            line-height: 40px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            cursor: pointer;
            transition: $animete-time linear;

            &:hover {
                background-color: #1a38f8;
            }
        }
    }
}
</style>
