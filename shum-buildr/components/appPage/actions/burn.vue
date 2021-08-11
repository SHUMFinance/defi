<template>
    <div id="burn">
        <Tabs v-model="actionTabs" class="actionTabs">
            <TabPane name="m0">
                <div class="burnBox">
                    <div class="actionBodyWeb">
                        <div class="actionTitle">Burn</div>
                        <div class="actionDesc">
                            <template v-if="isEthereumNetwork">
                                Burn sUSD to unlock staked SHUM. You can perform
                                this on Binance Smart Chain network. &nbsp;<span
                                    class="step"
                                    @click="jumpToStep"
                                    >STEP<img src="@/static/arrow_right.svg"
                                /></span>
                                .
                            </template>
                            <template v-else>
                                Burn sUSD to unlock staked SHUM
                            </template>
                        </div>
                        <div class="actionRate" v-if="isBinanceNetwork">
                            1 SHUM = {{ floor(burnData.LINA2USD, 4) }} sUSD
                        </div>
                        <div
                            class="actionInputItem"
                            :class="{
                                error: errors.unStakeMsg
                            }"
                            @click="changeFocusItem(0)"
                        >
                            <div class="itemLeft">
                                <div class="itemIcon">
                                    <img src="@/static/LINA_logo.svg" />
                                </div>
                                <div class="itemType">
                                    <div class="itemTypeTitle">
                                        Unstake SHUM
                                        <Tooltip
                                            max-width="305"
                                            placement="top"
                                            class="tip globalInfoStyle"
                                            content="Amount of SHUM unstaked may vary due to block times and price fluctuations in pledge tokens."
                                            offset="0 4"
                                        >
                                            <img
                                                src="@/static/info_white.svg"
                                            />
                                        </Tooltip>
                                    </div>
                                    <div
                                        class="itemTypeBtn"
                                        :class="{ active: activeItemBtn == 0 }"
                                        @click="clickUnstakeMax"
                                    >
                                        Max
                                    </div>
                                </div>
                            </div>
                            <div class="itemRight">
                                <div class="inputRect">
                                    <InputNumber
                                        class="input"
                                        ref="itemInput0"
                                        :min="0"
                                        :max="100000000000"
                                        type="text"
                                        v-model="inputData.unStake"
                                        placeholder="0"
                                        @on-change="changeUnStake"
                                        @on-focus="inputFocus(0)"
                                        @on-blur="inputBlur(0)"
                                        :formatter="formatterInput"
                                    />
                                </div>
                            </div>

                            <div
                                class="itemErrMsg"
                                :style="{
                                    opacity: errors.unStakeMsg ? '1' : '0'
                                }"
                            >
                                {{ errors.unStakeMsg }}
                            </div>
                        </div>
                        <div
                            class="actionInputItem"
                            :class="{
                                error: errors.amountMsg
                            }"
                            @click="changeFocusItem(1)"
                        >
                            <div class="itemLeft">
                                <div class="itemIcon">
                                    <img src="@/static/currency/sUSD.svg" />
                                </div>
                                <div class="itemType">
                                    <div class="itemTypeTitle">Burn</div>
                                    <div
                                        class="itemTypeBtn"
                                        :class="{ active: activeItemBtn == 1 }"
                                        @click="clickBurnMax"
                                    >
                                        Max
                                    </div>
                                </div>
                            </div>
                            <div class="itemRight">
                                <div class="inputRect">
                                    <InputNumber
                                        class="input"
                                        ref="itemInput1"
                                        :min="0"
                                        :max="100000000000"
                                        type="text"
                                        v-model="inputData.amount"
                                        @on-change="changeAmount"
                                        @on-focus="inputFocus(1)"
                                        @on-blur="inputBlur(1)"
                                        placeholder="0"
                                        :formatter="formatterInput"
                                    />
                                </div>
                            </div>
                            <div
                                class="itemErrMsg"
                                :style="{
                                    opacity: errors.amountMsg ? '1' : '0'
                                }"
                            >
                                {{ errors.amountMsg }}
                            </div>
                        </div>
                        <div
                            class="actionInputItem"
                            :class="{
                                error: errors.ratioMsg
                            }"
                        >
                            <div class="itemLeft">
                                <div class="itemIcon">
                                    <img src="@/static/percentage.svg" />
                                </div>
                                <div class="itemType">
                                    <div class="itemTypeTitle">P Ratio</div>
                                    <div
                                        class="itemTypeBtn"
                                        :class="{ active: activeItemBtn == 2 }"
                                        @click="clickTargetRatio"
                                    >
                                        Target ratio
                                    </div>
                                </div>
                            </div>
                            <div class="itemRight">
                                <div class="inputRect">
                                    <InputNumber
                                        class="input"
                                        ref="itemInput2"
                                        :min="0"
                                        :max="100000000000"
                                        type="text"
                                        v-model="inputData.ratio"
                                        @on-change="changeRatio"
                                        @on-focus="inputFocus(2)"
                                        @on-blur="inputBlur(2)"
                                        :placeholder="
                                            inputData.ratio == 0 ? '0' : 'N/A'
                                        "
                                        :formatter="
                                            value => formatterInput(value, 0)
                                        "
                                    />
                                </div>
                            </div>
                            <div
                                class="itemErrMsg"
                                :style="{
                                    opacity: errors.ratioMsg ? '1' : '0'
                                }"
                            >
                                {{ errors.ratioMsg }}
                            </div>
                        </div>

                        <gasEditor
                            v-if="!isMobile && isBinanceNetwork"
                        ></gasEditor>
                    </div>

                    <div class="actionBodyMobile">
                        <div
                            class="errMsg"
                            :style="{
                                display:
                                    errors.unStakeMsg ||
                                    errors.ratioMsg ||
                                    errors.amountMsg
                                        ? 'flex'
                                        : 'none'
                            }"
                        >
                            <img src="@/static/error.svg" />
                            {{ errors.unStakeMsg }}
                            {{ errors.ratioMsg }}
                            {{ errors.amountMsg }}
                        </div>
                        <div class="actionRate">
                            1 SHUM = {{ floor(burnData.LINA2USD, 4) }} sUSD
                        </div>

                        <div class="inputGroupBox">
                            <div
                                class="actionInputItem"
                                :class="{
                                    error: errors.unStakeMsg
                                }"
                                @click="changeFocusItem(0)"
                            >
                                <div class="inputBox">
                                    <img
                                        class="showInfo"
                                        src="@/static/info_white.svg"
                                        @click="showIntroductActionModal"
                                    />

                                    <img
                                        class="logo"
                                        src="@/static/LINA_logo.svg"
                                    />

                                    <div class="itemTypeTitle">
                                        Unstake SHUM
                                    </div>

                                    <InputNumber
                                        class="input"
                                        ref="itemInput3"
                                        :min="0"
                                        :max="100000000000"
                                        type="text"
                                        v-model="inputData.unStake"
                                        placeholder="0"
                                        @on-change="changeUnStake"
                                        @on-focus="inputFocus(3)"
                                        @on-blur="inputBlur(3)"
                                        :formatter="
                                            value =>
                                                floor(value, DECIMAL_PRECISION)
                                        "
                                    />

                                    <div
                                        class="itemTypeBtn"
                                        :class="{ active: activeItemBtn == 3 }"
                                        @click="clickUnstakeMax"
                                    >
                                        Max
                                    </div>
                                </div>
                            </div>

                            <div
                                class="actionInputItem"
                                :class="{
                                    error: errors.amountMsg
                                }"
                                @click="changeFocusItem(1)"
                            >
                                <div class="inputBox">
                                    <img
                                        class="logo"
                                        src="@/static/currency/sUSD.svg"
                                    />

                                    <div class="itemTypeTitle">Burn sUSD</div>

                                    <InputNumber
                                        class="input"
                                        ref="itemInput4"
                                        :min="0"
                                        :max="100000000000"
                                        type="text"
                                        v-model="inputData.amount"
                                        @on-change="changeAmount"
                                        @on-focus="inputFocus(4)"
                                        @on-blur="inputBlur(4)"
                                        placeholder="0"
                                        :formatter="
                                            value =>
                                                floor(value, DECIMAL_PRECISION)
                                        "
                                    />

                                    <div
                                        class="itemTypeBtn"
                                        :class="{ active: activeItemBtn == 4 }"
                                        @click="clickBurnMax"
                                    >
                                        Max
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="actionInputItem"
                            :class="{
                                error: errors.ratioMsg
                            }"
                        >
                            <div class="ratioInputBox">
                                <div class="box">
                                    <div class="itemTypeTitle">P Ratio</div>
                                    <InputNumber
                                        class="input"
                                        ref="itemInput5"
                                        :min="0"
                                        :max="100000000000"
                                        type="text"
                                        v-model="inputData.ratio"
                                        @on-change="changeRatio"
                                        @on-focus="inputFocus(5)"
                                        @on-blur="inputBlur(5)"
                                        :placeholder="
                                            inputData.ratio == 0 ? '0' : 'N/A'
                                        "
                                        :formatter="value => floor(value, 0)"
                                    />
                                </div>

                                <div
                                    class="itemTypeBtn"
                                    :class="{ active: activeItemBtn == 5 }"
                                    @click="clickTargetRatio"
                                >
                                    Target ratio
                                </div>
                            </div>
                        </div>

                        <gasEditor
                            v-if="isMobile && isBinanceNetwork"
                        ></gasEditor>
                    </div>

                    <div
                        v-if="isBinanceNetwork"
                        class="burnBtn"
                        :class="{ disabled: burnDisabled }"
                        @click="clickBurn"
                    >
                        BURN NOW
                    </div>

                    <div v-else class="burnBtn switchToBSC">
                        Please switch to BSC network to burn your ℓusd
                    </div>

                    <Spin fix v-if="processing"></Spin>
                </div>
            </TabPane>
            <TabPane name="m1">
                <watingEnhance
                    class="waitingBox"
                    v-if="this.actionTabs == 'm1' && isBinanceNetwork"
                    :currentStep="confirmTransactionStep"
                    :currentHash="confirmTransactionHash"
                    :currentNetworkId="confirmTransactionNetworkId"
                    :currentConfirm="confirmTransactionStatus"
                    :currentErrMsg="transactionErrMsg"
                    :setupArray="waitProcessArray"
                    @tryAgain="waitTryAgain"
                    @close="setDefaultTab"
                ></watingEnhance>
            </TabPane>
        </Tabs>

        <Modal
            v-model="introductActionModal"
            :footer-hide="true"
            :closable="true"
            :transfer="false"
            :mask="true"
            class="introductActionModal"
        >
            <div class="title">Unstake SHUM</div>
            <div class="context">
                Amount of SHUM unstaked may vary due to block times and price
                fluctuations in pledge tokens.
            </div>
        </Modal>

    </div>
</template>

<script>
import _ from "lodash";
import gasEditor from "@/components/gasEditor";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";

import {
    findParents,
    removeClass,
    addClass,
    formatterInput
} from "@/common/utils";

import {
    bufferGasLimit,
    DEFAULT_GAS_LIMIT,
    isBinanceNetwork,
    isEthereumNetwork
} from "@/assets/linearLibrary/linearTools/network";

import {
    formatEtherToNumber,
    formatNumber
} from "@/assets/linearLibrary/linearTools/format";

import { BigNumber, utils } from "ethers";

import {
    bnAdd,
    bnSub,
    bnMul,
    bnDiv,
    bnAdd2N,
    bnSub2N,
    bnMul2N,
    bnDiv2N,
    MAX_DECIMAL_LENGTH,
    n2bn,
    bn2n
} from "@/common/bnCalc";

import {
    storeDetailsData,
    getPriceRates,
    // getPriceRatesFromApi,
    getBuildRatio
} from "@/assets/linearLibrary/linearTools/request";

import {
    BUILD_PROCESS_SETUP,
    DECIMAL_PRECISION
} from "@/assets/linearLibrary/linearTools/constants/process";


export default {
    name: "burn",
    data() {
        return {
            DECIMAL_PRECISION,
            formatEtherToNumber,
            floor: _.floor, //向下取整
            actionTabs: "m0", //子页(m0默认,m1等待,m2成功,m3错误) Subpages(m0 default, m1 waiting)
            processing: false, //burn按钮防抖

            activeItemBtn: -1, //当前激活按钮 0 unstack max, 1 burn max

            confirmTransactionStep: -1, //当前交易进度
            confirmTransactionStatus: false, //当前交易确认状态
            confirmTransactionNetworkId: "", //当前交易确认网络id
            confirmTransactionHash: "", //当前交易hash
            transactionErrMsg: "", //交易错误信息
            waitProcessArray: [], //等待交易进度组
            waitProcessFlow: Function, //flow闭包函数

            introductActionModal: false,

            //输入框展示数据
            inputData: {
                unStake: null,
                amount: null,
                ratio: 0
            },

            //真实操作数据
            actionDatas: {
                unStake: n2bn("0"),
                amount: n2bn("0"),
                ratio: 0
            },

            errors: {
                unStakeMsg: "",
                amountMsg: "",
                ratioMsg: ""
            },

            burnData: {
                SHUM: 0,
                LINA2USD: 0,
                staked: 0,
                lock: 0,
                sUSD: 0,
                debt: 0,
                targetRatio: 500,
                currentRatio: 0
            },

            formatterInput,
            chainChangeFromSubscribe: ""
        };
    },
    components: {
        gasEditor,
    },

    watch: {
        walletAddress() {},
        isEthereumNetwork() {},
        isBinanceNetwork() {},
        walletNetworkId() {},
        isMobile() {}
    },
    computed: {
        //burn按钮禁止状态
        burnDisabled() {
            return (
                (_.lte(this.inputData.unStake, 0) &&
                    _.lte(this.inputData.amount, 0)) ||
                this.errors.unStakeMsg ||
                this.errors.amountMsg ||
                this.errors.ratioMsg ||
                this.processing ||
                (!this.burnData.staked && !this.burnData.lock)
            );
        },

        walletAddress() {
            return this.$store.state?.wallet?.address;
        },

        isEthereumNetwork() {
            return isEthereumNetwork(this.walletNetworkId);
        },

        isBinanceNetwork() {
            return isBinanceNetwork(this.walletNetworkId);
        },

        isEthDevNetwork() {
            return isEthDevNetwork(this.walletNetworkId);
        },

        walletNetworkId() {
            return this.$store.state?.walletNetworkId;
        },

        isMobile() {
            return this.$store.state?.isMobile;
        }
    },
    async created() {
        this.isBinanceNetwork && this.getBurnData(this.walletAddress);

        //监听链切换
        this.chainChangeFromSubscribe = this.$pub.subscribe(
            "onWalletChainChange",
            async () => {
                if (this.actionTabs == "m0") {
                    await this.getBurnData(this.walletAddress);
                }
            }
        );
    },
    destroyed() {
        if (this.chainChangeFromSubscribe) {
            this.$pub.unsubscribe(this.chainChangeFromSubscribe);
            this.chainChangeFromSubscribe = "";
        }
    },
    methods: {
        //获取数据
        async getBurnData(walletAddress) {
            try {
                this.processing = true;

                let LnProxy = lnrJSConnector.lnrJS.ShumFinance;
                // if (this.isEthereumNetwork) {
                //     LnProxy = lnrJSConnector.lnrJS.LnProxyERC20;
                // } else if (this.isBinanceNetwork) {
                //     LnProxy = lnrJSConnector.lnrJS.LnProxyBEP20;
                // }

                const {
                    lnrJS: {
                        ShumCollateralSystem,
                        sUSD,
                        ShumDebtSystem,
                        ShumRewardLocker
                    },
                    utils
                } = lnrJSConnector;

                const LINABytes = utils.formatBytes32String("SHUM");

                const results = await Promise.all([
                    ShumCollateralSystem.userCollateralData(
                        walletAddress,
                        LINABytes
                    ), //LINA抵押数量
                    ShumRewardLocker.balanceOf(walletAddress),
                    sUSD.balanceOf(walletAddress), //sUSD余额
                    ShumCollateralSystem.GetUserTotalCollateralInUsd(
                        walletAddress
                    ), //个人全部抵押物兑sUSD,用于计算pratio
                    getBuildRatio(), //目标抵押率
                    LnProxy.balanceOf(walletAddress), //LINA余额
                    ShumDebtSystem.GetUserDebtBalanceInUsd(walletAddress) //总债务
                ]);

                const [
                    stakingLina,
                    lockLina,
                    amountsUSD,
                    totalCollateralInUsd,
                    buildRatio,
                    avaliableLINA,
                    amountDebt
                ] = results.map(formatEtherToNumber);

                let currentRatioPercent = n2bn("0");

                if (results[3].gt("0") && results[6][0].gt("0")) {
                    currentRatioPercent = bnMul(
                        bnDiv(results[3], results[6][0]),
                        n2bn("100")
                    );
                }

                const targetRatioPercent = 100 / buildRatio; //目标抵押率

                const priceRates = await getPriceRates(["SHUM", "sUSD"]);
                // const priceRates = await getPriceRatesFromApi(["SHUM", "sUSD"]);

                const LINAPrice = priceRates.LINA / priceRates.sUSD;
                const LINAPriceBN = bnDiv(priceRates.LINA, priceRates.sUSD);

                this.burnData.LINA = _.floor(avaliableLINA, 2);
                this.burnData.LINABN = results[5];

                this.burnData.LINA2USD = _.floor(LINAPrice, 4);
                this.burnData.LINA2USDBN = LINAPriceBN;

                this.burnData.staked = _.floor(stakingLina, 2);
                this.burnData.stakedBN = results[0];

                this.burnData.lock = _.floor(lockLina, 2);
                this.burnData.lockBN = results[1];

                this.burnData.sUSD = _.floor(amountsUSD, 2);
                this.burnData.sUSDBN = results[2];

                this.burnData.debt = _.floor(amountDebt[0], 2);
                this.burnData.debtBN = results[6][0];

                this.burnData.targetRatio = targetRatioPercent;
                this.burnData.currentRatio = formatEtherToNumber(
                    currentRatioPercent
                );
                this.burnData.currentRatioBN = currentRatioPercent;

                //获取当前抵押率
                this.inputData.ratio = this.burnData.currentRatio;
            } catch (e) {
                console.log(e, "getBurnData err");
            } finally {
                this.processing = false;
            }
        },

        //点击 burn
        async clickBurn() {
            if (!this.burnDisabled) {
                try {
                    if (this.isEthereumNetwork) {
                        return;
                        // this.actionTabs = "m1"; //进入swap流程
                    } else if (this.isBinanceNetwork) {
                        this.processing = true;

                        //清空之前数据
                        this.waitProcessArray = [];

                        if (
                            this.actionDatas.amount.gte(n2bn("0.01")) &&
                            this.actionDatas.unStake.gte(n2bn("0.01"))
                        ) {
                            this.waitProcessArray.push(
                                BUILD_PROCESS_SETUP.BURN_UNSTAKING
                            );
                        } else {
                            if (this.actionDatas.amount.gte(n2bn("0.01"))) {
                                //需要先burn
                                this.waitProcessArray.push(
                                    BUILD_PROCESS_SETUP.BURN
                                );
                            }

                            if (this.actionDatas.unStake.gte(n2bn("0.01"))) {
                                this.waitProcessArray.push(
                                    BUILD_PROCESS_SETUP.UNSTAKING
                                );
                            }
                        }

                        this.confirmTransactionStep = 0;
                        this.actionTabs = "m1"; //进入等待页

                        this.waitProcessFlow = this.startFlow();

                        //开始逻辑流处理函数
                        await this.waitProcessFlow();
                    }
                } catch (e) {
                    this.transactionErrMsg =
                        "Something went wrong, please try again.";
                } finally {
                    this.processing = false;
                }
            }

            this.processing = false;
        },

        //开始逻辑流
        startFlow() {
            return async () => {
                try {
                    this.transactionErrMsg = "";

                    if (
                        this.waitProcessArray[this.confirmTransactionStep] ==
                        BUILD_PROCESS_SETUP.BURN_UNSTAKING
                    ) {
                        await this.burnAndUnstake({
                            burnAmount: this.actionDatas.amount,
                            unstakeAmount: this.actionDatas.unStake
                        });
                    } else if (
                        this.waitProcessArray[this.confirmTransactionStep] ==
                        BUILD_PROCESS_SETUP.BURN
                    ) {
                        await this.burn(this.actionDatas.amount);
                    } else if (
                        this.waitProcessArray[this.confirmTransactionStep] ==
                        BUILD_PROCESS_SETUP.UNSTAKING
                    ) {
                        await this.unstake(this.actionDatas.unStake);
                    }
                } catch (error) {
                    console.log(error, "startFlow");
                    //自定义错误
                    if (
                        _.has(error, "code") &&
                        [6100004, 6100005].includes(error.code)
                    ) {
                        this.transactionErrMsg = error.message;
                    } else {
                        //通用错误
                        this.transactionErrMsg =
                            "Something went wrong, please try again.";
                    }
                }
            };
        },

        //burn
        async burnAndUnstake(
            { burnAmount, unstakeAmount } = {
                burnAmount: n2bn("0"),
                unstakeAmount: n2bn("0")
            }
        ) {
            this.confirmTransactionStatus = false;
            this.confirmTransactionNetworkId = this.walletNetworkId;

            //burn多一点点,防止unstake出错
            let tempBurnAmount = n2bn(_.ceil(bn2n(burnAmount), 2));
            if (tempBurnAmount.lte(this.burnData.sUSDBN)) {
                burnAmount = tempBurnAmount;
            }

            //unstake少一点,防止出错
            unstakeAmount = n2bn(_.floor(bn2n(unstakeAmount), 2));

            const {
                lnrJS: { ShumCollateralSystem },
                utils
            } = lnrJSConnector;

            const burnGasLimit = await this.getBurnAndUnstakeGasEstimate(
                burnAmount,
                unstakeAmount
            );

            let transaction = await ShumCollateralSystem.burnAndUnstake(
                burnAmount,
                utils.formatBytes32String("SHUM"),
                unstakeAmount,
                {
                    gasPrice: this.$store.state?.gasDetails?.price,
                    gasLimit: burnGasLimit
                }
            );

            if (transaction) {
                this.confirmTransactionStatus = true;
                this.confirmTransactionHash = transaction.hash;

                // 发起右下角通知
                this.$pub.publish("notificationQueue", {
                    hash: this.confirmTransactionHash,
                    type: BUILD_PROCESS_SETUP.BURN,
                    networkId: this.walletNetworkId,
                    value: `Burn ${this.confirmTransactionStep + 1} / ${
                        this.waitProcessArray.length
                    }`
                });

                let status = await utils.waitForTransaction(transaction.hash);

                if (!status) {
                    throw {
                        code: 6100004,
                        message:
                            "Something went wrong while burn sUSD, please try again."
                    };
                }

                //成功后累加当前进度
                this.confirmTransactionStep += 1;
            }
        },

        //burn
        async burn(burnAmount) {
            this.confirmTransactionStatus = false;
            this.confirmTransactionNetworkId = this.walletNetworkId;

            let tempBurnAmount = n2bn(_.ceil(bn2n(burnAmount), 2));
            if (tempBurnAmount.lte(this.burnData.sUSDBN)) {
                burnAmount = tempBurnAmount;
            }

            const {
                lnrJS: { ShumBuildBurnSystem },
                utils
            } = lnrJSConnector;

            const burnGasLimit = await this.getBurnGasEstimate(burnAmount);

            let transaction = await ShumBuildBurnSystem.BurnAsset(burnAmount, {
                gasPrice: this.$store.state?.gasDetails?.price,
                gasLimit: burnGasLimit
            });

            if (transaction) {
                this.confirmTransactionStatus = true;
                this.confirmTransactionHash = transaction.hash;

                // 发起右下角通知
                this.$pub.publish("notificationQueue", {
                    hash: this.confirmTransactionHash,
                    type: BUILD_PROCESS_SETUP.BURN,
                    networkId: this.walletNetworkId,
                    value: `Burn ${this.confirmTransactionStep + 1} / ${
                        this.waitProcessArray.length
                    }`
                });

                let status = await utils.waitForTransaction(transaction.hash);

                if (!status) {
                    throw {
                        code: 6100004,
                        message:
                            "Something went wrong while burn sUSD, please try again."
                    };
                }

                //成功后累加当前进度
                this.confirmTransactionStep += 1;
            }
        },

        //unstake
        async unstake(unstakeAmount) {
            this.confirmTransactionStatus = false;
            this.confirmTransactionNetworkId = this.walletNetworkId;

            //unstake少一点,防止出错
            unstakeAmount = n2bn(_.floor(bn2n(unstakeAmount), 2));

            const {
                lnrJS: { ShumCollateralSystem },
                utils
            } = lnrJSConnector;

            const unstakeGasLimit = await this.getUnstakeGasEstimate(
                unstakeAmount
            );

            let transaction = await ShumCollateralSystem.Redeem(
                utils.formatBytes32String("SHUM"),
                unstakeAmount,
                {
                    gasPrice: this.$store.state?.gasDetails?.price,
                    gasLimit: unstakeGasLimit
                }
            );

            if (transaction) {
                this.confirmTransactionStatus = true;
                this.confirmTransactionHash = transaction.hash;

                // 发起右下角通知
                this.$pub.publish("notificationQueue", {
                    hash: this.confirmTransactionHash,
                    type: BUILD_PROCESS_SETUP.UNSTAKING,
                    networkId: this.walletNetworkId,
                    value: `Burn ${this.confirmTransactionStep + 1} / ${
                        this.waitProcessArray.length
                    }`
                });

                //等待交易结果返回
                let status = await utils.waitForTransaction(transaction.hash);

                if (!status) {
                    throw {
                        code: 6100005,
                        message:
                            "Something went wrong while unstaking your asset, please try again."
                    };
                }

                //成功后累加当前进度
                this.confirmTransactionStep += 1;
            }
        },

        //评估 二合一 gas
        async getBurnAndUnstakeGasEstimate(burnAmount, unstakeAmount) {
            try {
                const {
                    lnrJS: { ShumCollateralSystem },
                    utils
                } = lnrJSConnector;

                if (
                    burnAmount.lte("0") &&
                    unstakeAmount.lte("0") //小于等于0
                ) {
                    throw new Error("invalid input");
                }

                let gasEstimate = await ShumCollateralSystem.contract.estimateGas.burnAndUnstake(
                    burnAmount,
                    utils.formatBytes32String("SHUM"),
                    unstakeAmount
                );

                return bufferGasLimit(gasEstimate);
            } catch (e) {
                // console.log(e);
                return bufferGasLimit(DEFAULT_GAS_LIMIT.burn);
            }
        },

        //评估 burn gas
        async getBurnGasEstimate(burnAmount) {
            try {
                const {
                    lnrJS: { ShumBuildBurnSystem },
                    utils
                } = lnrJSConnector;

                let gasEstimate = await ShumBuildBurnSystem.contract.estimateGas.BurnAsset(
                    burnAmount
                );

                return bufferGasLimit(gasEstimate);
            } catch (e) {
                return bufferGasLimit(DEFAULT_GAS_LIMIT.burn);
            }
        },

        //评估 unstake gas
        async getUnstakeGasEstimate(unstakeAmount) {
            try {
                const {
                    lnrJS: { ShumCollateralSystem },
                    utils
                } = lnrJSConnector;

                let gasEstimate = await ShumCollateralSystem.contract.estimateGas.Redeem(
                    utils.formatBytes32String("SHUM"),
                    unstakeAmount
                );

                return bufferGasLimit(gasEstimate);
            } catch (e) {
                console.log(e);
                return bufferGasLimit(DEFAULT_GAS_LIMIT.unstake);
            }
        },

        async waitTryAgain() {
            await this.waitProcessFlow();
        },

        //重置错误信息
        resetErrorsMsg() {
            this.errors = {
                unStakeMsg: "",
                amountMsg: "",
                ratioMsg: ""
            };
        },

        //重置输入框状态
        resetInputData() {
            //输入框展示数据
            this.inputData = {
                unStake: null,
                amount: null,
                ratio: 0
            };

            //真实操作数据
            this.actionDatas = {
                unStake: n2bn("0"),
                amount: n2bn("0"),
                ratio: 0
            };
        },

        //改变激活元素
        changeFocusItem(index) {
            // this.activeItem = index;
            this.$nextTick(() => {
                this.$refs["itemInput" + index].$el
                    .querySelector("input")
                    .focus();
            });
        },

        //获取焦点
        //Choose current inputbox
        inputFocus(index) {
            this.$nextTick(() => {
                let currentElement = this.$refs["itemInput" + index].$el;
                let parentElement = findParents(
                    currentElement,
                    "actionInputItem"
                );
                addClass(parentElement, "active");
            });
        },

        //失去焦点
        inputBlur(index) {
            this.$nextTick(() => {
                let currentElement = this.$refs["itemInput" + index].$el;
                let parentElement = findParents(
                    currentElement,
                    "actionInputItem"
                );
                removeClass(parentElement, "active");
            });
        },

        test() {
            let overStaked = bnMul(
                this.burnData.stakedBN,
                bnDiv(
                    bnSub(
                        this.burnData.currentRatioBN,
                        n2bn(this.burnData.targetRatio.toString())
                    ),
                    this.burnData.currentRatioBN
                )
            );
        },

        //点击 Unstake Max 取回本金，不够sUSD就报错
        clickUnstakeMax() {
            try {
                this.activeItemBtn = 0;

                if (this.isBinanceNetwork) {
                    this.unstakeMax = true;
                    this.resetErrorsMsg();
                    this.resetInputData();

                    if (this.burnData.stakedBN.eq("0")) {
                        this.errors.unStakeMsg =
                            "There is no LINA staked on the contract.";
                        return;
                    }

                    if (this.burnData.lockBN.eq("0")) {
                        //没有lock lina
                        if (
                            this.burnData.sUSDBN.eq("0") &&
                            this.burnData.debtBN.gt("0")
                        ) {
                            this.errors.unStakeMsg =
                                "You don't have enough amount of sUSD.";
                            return;
                        }

                        if (this.burnData.sUSDBN.gte(this.burnData.debtBN)) {
                            //sUSD大于债务
                            //sUSD足够还清债务则销毁债务数量的sUSD则可取回所有LINA
                            this.inputData.unStake = formatEtherToNumber(
                                this.burnData.stakedBN
                            );
                            this.inputData.amount = formatEtherToNumber(
                                this.burnData.debtBN
                            );
                            this.inputData.ratio = null;

                            this.actionDatas.unStake = this.burnData.stakedBN;
                            this.actionDatas.amount = this.burnData.debtBN;
                            this.actionDatas.ratio = null;
                        } else {
                            //sUSD不足还清债务则报错
                            this.errors.unStakeMsg =
                                "You don't have enough amount of sUSD.";
                        }
                    } else {
                        //有lock lina
                        //计算当前价格的lock lina能生成多少sUSD
                        let lockLINATosUSDBN = this.burnData.lockBN.mul(
                            this.burnData.LINA2USDBN
                        );

                        let lockLINAToBuildsUSDBN = this.burnData.lockBN
                            .mul(this.burnData.LINA2USDBN)
                            .div(
                                n2bn(
                                    (this.burnData.targetRatio / 100).toString()
                                )
                            );
                        if (this.burnData.debtBN.lte(lockLINAToBuildsUSDBN)) {
                            //债务 <= lockLINATosUSDBN 时，则可以直接解锁所有stake shum

                            this.inputData.unStake = formatEtherToNumber(
                                this.burnData.stakedBN
                            );

                            this.inputData.amount = formatEtherToNumber(
                                this.burnData.debtBN
                            );

                            this.actionDatas.unStake = this.burnData.stakedBN;

                            this.actionDatas.amount = this.burnData.debtBN;

                            if (this.burnData.debtBN.eq("0")) {
                                //没有债务
                                this.inputData.ratio = 0;
                                this.actionDatas.ratio = n2bn(0);
                            } else {
                                //有债务
                                this.inputData.ratio = formatEtherToNumber(
                                    bnDiv(
                                        lockLINATosUSDBN,
                                        this.burnData.debtBN
                                    )
                                );
                                this.actionDatas.ratio = bnDiv(
                                    lockLINATosUSDBN,
                                    this.burnData.debtBN
                                );
                            }
                        } else {
                            let stakeDebt = this.burnData.debtBN.sub(
                                lockLINAToBuildsUSDBN
                            ); //取回所有stake所需还的债务

                            if (this.burnData.sUSDBN.gte(stakeDebt)) {
                                //sUSD足够还清债务则销毁债务数量的sUSD则可取回所有LINA
                                this.inputData.unStake = formatEtherToNumber(
                                    this.burnData.stakedBN
                                );
                                this.inputData.amount = formatEtherToNumber(
                                    stakeDebt
                                );
                                this.inputData.ratio =
                                    formatEtherToNumber(
                                        lockLINATosUSDBN.div(
                                            lockLINAToBuildsUSDBN
                                        )
                                    ) * 100;

                                this.actionDatas.unStake = this.burnData.stakedBN;
                                this.actionDatas.amount = stakeDebt;
                                this.actionDatas.ratio = bnDiv(
                                    lockLINATosUSDBN,
                                    lockLINAToBuildsUSDBN
                                );
                            } else {
                                //sUSD不足还清债务则报错
                                this.errors.unStakeMsg =
                                    "You don't have enough amount of sUSD.";
                            }
                        }
                    }
                }
            } catch (error) {}
        },

        //点击 Burn Max 销毁sUSD，取回能取回的最大本金
        clickBurnMax() {
            try {
                this.activeItemBtn = 1;

                if (this.isBinanceNetwork) {
                    this.resetErrorsMsg();
                    this.resetInputData();

                    if (
                        this.burnData.stakedBN.eq("0") &&
                        this.burnData.lockBN.eq("0")
                    ) {
                        this.errors.amountMsg =
                            "There is no SHUM staked on the contract.";
                        return;
                    }

                    if (this.burnData.sUSDBN.eq("0")) {
                        this.errors.amountMsg =
                            "You don't have enough amount of sUSD.";
                        return;
                    }

                    if (this.burnData.sUSDBN.gte(this.burnData.debtBN)) {
                        //sUSD >= debt
                        this.inputData.unStake = formatEtherToNumber(
                            this.burnData.stakedBN
                        );
                        this.inputData.amount = formatEtherToNumber(
                            this.burnData.debtBN
                        );
                        this.inputData.ratio = null;

                        this.actionDatas.unStake = this.burnData.stakedBN;
                        this.actionDatas.amount = this.burnData.debtBN;
                        this.actionDatas.ratio = null;
                    } else {
                        //sUSD < debt
                        this.inputData.amount = formatEtherToNumber(
                            this.burnData.sUSDBN
                        );
                        this.actionDatas.amount = this.burnData.sUSDBN;

                        let ratioAfterBurn = n2bn("0");

                        //sUSD不足还清所有债务，则计算销毁所有sUSD后的抵押率，大于目标则解锁大于部分，小于等于则不解锁LINA
                        ratioAfterBurn = bnMul(
                            bnDiv(
                                bnMul(
                                    bnAdd(
                                        this.burnData.stakedBN,
                                        this.burnData.lockBN
                                    ),
                                    this.burnData.LINA2USDBN
                                ),
                                bnSub(
                                    this.burnData.debtBN,
                                    this.burnData.sUSDBN
                                )
                            ),
                            n2bn("100")
                        );

                        if (
                            ratioAfterBurn.gt(
                                n2bn(this.burnData.targetRatio.toString())
                            )
                        ) {
                            //销毁后大于 target ratio
                            let allCanUnstakeAfterBurn = bnMul(
                                bnAdd(
                                    this.burnData.stakedBN,
                                    this.burnData.lockBN
                                ),
                                bnDiv(
                                    bnSub(
                                        ratioAfterBurn,
                                        n2bn(
                                            this.burnData.targetRatio.toString()
                                        )
                                    ),
                                    ratioAfterBurn
                                )
                            );

                            if (
                                allCanUnstakeAfterBurn.lte(
                                    this.burnData.stakedBN
                                )
                            ) {
                                // <= stake
                                this.inputData.unStake = formatEtherToNumber(
                                    allCanUnstakeAfterBurn
                                );
                                this.actionDatas.unStake = allCanUnstakeAfterBurn;
                            } else {
                                // > stake
                                this.inputData.unStake = formatEtherToNumber(
                                    this.burnData.stakedBN
                                );
                                this.actionDatas.unStake = this.burnData.stakedBN;
                            }
                        } else {
                            //销毁后小于等于 target ratio
                            this.inputData.unStake = 0;
                            this.actionDatas.unStake = n2bn("0");
                        }
                        // let pratioAfterBurnAndStake = bnMul(
                        //                                 bnDiv(
                        //                                     bnMul(
                        //                                         bnSub(
                        //                                             bnAdd(
                        //                                                 this.burnData.stakedBN,
                        //                                                 this.burnData.lockBN
                        //                                             ),
                        //                                             this.actionDatas.unStake
                        //                                         ),
                        //                                         this.burnData.LINA2USDBN
                        //                                     ),
                        //                                     bnSub(
                        //                                         this.burnData.debtBN,
                        //                                         this.burnData.sUSDBN
                        //                                     )
                        //                                 ),
                        //                                 n2bn('100')
                        //                             );

                        // this.inputData.ratio = formatEtherToNumber(pratioAfterBurnAndStake);
                        // this.actionDatas.ratio = pratioAfterBurnAndStake;

                        this.inputData.ratio = this.burnData.targetRatio;
                        this.actionDatas.ratio = n2bn(
                            this.burnData.targetRatio.toString()
                        );
                    }
                }
            } catch (error) {}
        },

        //点击target
        clickTargetRatio() {
            try {
                this.activeItemBtn = 2;

                if (this.isBinanceNetwork) {
                    this.resetErrorsMsg();
                    this.resetInputData();

                    //没有债务
                    if (this.burnData.debtBN.eq("0")) {
                        this.errors.ratioMsg = "There is no debt.";
                        return;
                    }

                    if (
                        this.burnData.currentRatioBN.gt(
                            n2bn(this.burnData.targetRatio.toString())
                        )
                    ) {
                        //下调抵押率，当前抵押率大于目标抵押率，销毁LINA到抵押率刚好
                        let needUnstake = bnMul(
                            bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
                            bnDiv(
                                bnSub(
                                    this.burnData.currentRatioBN,
                                    n2bn(this.burnData.targetRatio.toString())
                                ),
                                this.burnData.currentRatioBN
                            )
                        );

                        if (needUnstake.lte(this.burnData.stakedBN)) {
                            // <= stake
                            this.inputData.unStake = formatEtherToNumber(
                                needUnstake
                            );
                            this.actionDatas.unStake = needUnstake;
                        } else {
                            // > stake
                            this.inputData.unStake = formatEtherToNumber(
                                this.burnData.stakedBN
                            );
                            this.actionDatas.unStake = this.burnData.stakedBN;
                        }

                        this.inputData.amount = formatEtherToNumber(0);
                        this.inputData.ratio = this.burnData.targetRatio;

                        this.actionDatas.amount = n2bn("0");
                        this.actionDatas.ratio = this.burnData.targetRatio;
                    } else if (
                        this.burnData.currentRatioBN.lt(
                            n2bn(this.burnData.targetRatio.toString())
                        )
                    ) {
                        //上调抵押率，看当前抵押率上调到目标抵押率需要还多少债务，如果sUSD余额大于等于要还的则销毁，低于则报错
                        let retainsUSD = n2bn("0"),
                            burnsUSD = n2bn("0"); //上调抵押率需要保留/销毁多少sUSD

                        retainsUSD = bnDiv(
                            bnMul(
                                bnAdd(
                                    this.burnData.stakedBN,
                                    this.burnData.lockBN
                                ),
                                this.burnData.LINA2USDBN
                            ),
                            n2bn((this.burnData.targetRatio / 100).toString())
                        );

                        burnsUSD = bnSub(this.burnData.debtBN, retainsUSD);

                        if (this.burnData.sUSDBN.lt(burnsUSD)) {
                            this.errors.ratioMsg =
                                "You don't have enough amount of sUSD.";
                        }

                        this.inputData.unStake = 0;
                        this.inputData.amount = formatEtherToNumber(burnsUSD);
                        this.inputData.ratio = this.burnData.targetRatio;

                        this.actionDatas.unStake = n2bn("0");
                        this.actionDatas.amount = burnsUSD;
                        this.actionDatas.ratio = n2bn(
                            this.burnData.targetRatio.toString()
                        );
                    } else {
                        //抵押率刚好则不动
                        this.inputData.unStake = 0;
                        this.inputData.amount = 0;
                        this.inputData.ratio = this.burnData.currentRatio;
                    }
                }
            } catch (error) {}
        },

        //输入要解锁LINA数量
        changeUnStake(unstakedAmount) {
            try {
                if (this.isBinanceNetwork) {
                    this.resetErrorsMsg();
                    // this.resetInputData();

                    if (this.burnData.stakedBN.eq("0")) {
                        this.errors.unStakeMsg =
                            "There is no SHUM staked on the contract.";
                        return;
                    }

                    if (!unstakedAmount) {
                        this.errors.unStakeMsg =
                            "You can't unstake the amount of SHUM above.";
                        return;
                    } else {
                        this.errors.unStakeMsg = "";
                    }

                    //一个LINA都解锁不了
                    if (
                        n2bn(unstakedAmount.toString()).gt(
                            this.burnData.stakedBN
                        )
                    ) {
                        this.inputData.unStake = unstakedAmount;
                        this.errors.unStakeMsg =
                            "You can't unstake the amount of LINA above.";
                        return;
                    }

                    //一个LINA都解锁不了
                    if (
                        this.burnData.sUSDBN.eq("0") &&
                        this.burnData.currentRatioBN.lte(
                            n2bn(this.burnData.targetRatio.toString())
                        ) &&
                        this.burnData.currentRatioBN.gt(n2bn("0"))
                    ) {
                        this.inputData.unStake = unstakedAmount;
                        this.errors.unStakeMsg =
                            "You don't have enough amount of sUSD.";
                        return;
                    }

                    //没有债务直接解锁
                    if (this.burnData.debtBN.eq("0")) {
                        this.inputData.unStake = unstakedAmount;
                        this.actionDatas.unStake = n2bn(
                            unstakedAmount.toString()
                        );

                        return;
                    }

                    //当前价格的lock lina能生成多少sUSD
                    let lockLINAToBuildsUSDBN = bnDiv(
                        bnMul(this.burnData.lockBN, this.burnData.LINA2USDBN),
                        n2bn((this.burnData.targetRatio / 100).toString())
                    );
                    //取回所有stake所需还的债务
                    let stakeDebt = bnSub(
                        this.burnData.debtBN,
                        lockLINAToBuildsUSDBN
                    );

                    let allCanUnstakeAfterBurn = n2bn("0");

                    //判断输入的值是否超过能解锁的最大LINA
                    //够sUSD还债，则可以解锁所有LINA
                    if (this.burnData.sUSDBN.gte(stakeDebt)) {
                        allCanUnstakeAfterBurn = this.burnData.stakedBN;
                    } else {
                        //sUSD不足还清所有债务，则计算销毁所有sUSD后的抵押率，大于目标则解锁大于部分，小于等于则不解锁LINA
                        let ratioAfterBurn = bnMul(
                            bnDiv(
                                bnMul(
                                    bnAdd(
                                        this.burnData.stakedBN,
                                        this.burnData.lockBN
                                    ),
                                    this.burnData.LINA2USDBN
                                ),
                                bnSub(
                                    this.burnData.debtBN,
                                    this.burnData.sUSDBN
                                )
                            ),
                            n2bn("100")
                        );

                        //销毁所有sUSD后抵押率不超过目标抵押率，则不能解锁LINA
                        if (
                            ratioAfterBurn.lte(
                                n2bn(this.burnData.targetRatio.toString())
                            )
                        ) {
                            this.inputData.unStake = unstakedAmount;
                            this.errors.unStakeMsg =
                                "You don't have enough amount of sUSD.";
                            return;
                        }

                        //用销毁所有sUSD后超额的抵押率算
                        allCanUnstakeAfterBurn = bnMul(
                            bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
                            bnDiv(
                                bnSub(
                                    ratioAfterBurn,
                                    n2bn(this.burnData.targetRatio.toString())
                                ),
                                ratioAfterBurn
                            )
                        );
                    }

                    if (
                        n2bn(unstakedAmount.toString()).gt(
                            allCanUnstakeAfterBurn
                        )
                    ) {
                        this.inputData.unStake = unstakedAmount;
                        this.errors.unStakeMsg =
                            "You don't have enough amount of sUSD.";
                        return;
                    }

                    let overStaked = bnMul(
                        bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
                        bnDiv(
                            bnSub(
                                this.burnData.currentRatioBN,
                                n2bn(this.burnData.targetRatio.toString())
                            ),
                            this.burnData.currentRatioBN
                        )
                    );
                    if (overStaked.lt("0")) {
                        overStaked = n2bn("0");
                    }

                    let needFixRatio = n2bn("0");

                    //需要先修复抵押率
                    if (
                        this.burnData.currentRatioBN.lt(
                            n2bn(this.burnData.targetRatio.toString())
                        )
                    ) {
                        let retainsUSD = bnDiv(
                            bnMul(
                                bnAdd(
                                    this.burnData.stakedBN,
                                    this.burnData.lockBN
                                ),
                                this.burnData.LINA2USDBN
                            ),
                            n2bn((this.burnData.targetRatio / 100).toString())
                        );

                        needFixRatio = bnSub(this.burnData.debtBN, retainsUSD);
                    }

                    let needBurnAmount = n2bn("0");

                    if (n2bn(unstakedAmount.toString()).gt(overStaked)) {
                        needBurnAmount = bnDiv(
                            bnMul(
                                bnSub(
                                    n2bn(unstakedAmount.toString()),
                                    overStaked
                                ),
                                this.burnData.LINA2USDBN
                            ),
                            n2bn((this.burnData.targetRatio / 100).toString())
                        );
                    }

                    this.inputData.unStake = unstakedAmount;
                    this.actionDatas.unStake = n2bn(unstakedAmount.toString());

                    this.inputData.amount = formatEtherToNumber(
                        bnAdd(needBurnAmount, needFixRatio)
                    );
                    this.actionDatas.amount = bnAdd(
                        needBurnAmount,
                        needFixRatio
                    );

                    if (
                        n2bn(unstakedAmount.toString()).eq(
                            this.burnData.stakedBN
                        )
                    ) {
                        this.inputData.ratio = null;
                        this.actionDatas.ratio = n2bn("0");
                    } else {
                        let ratioAfterAction = bnMul(
                            bnDiv(
                                bnMul(
                                    bnSub(
                                        bnAdd(
                                            this.burnData.stakedBN,
                                            this.burnData.lockBN
                                        ),
                                        this.actionDatas.unStake
                                    ),
                                    this.burnData.LINA2USDBN
                                ),
                                bnSub(
                                    this.burnData.debtBN,
                                    this.actionDatas.amount
                                )
                            ),
                            n2bn("100")
                        );

                        //修复除不尽的显示错误
                        if (ratioAfterAction.lt(n2bn("500"))) {
                            ratioAfterAction = n2bn("500");
                        }

                        this.inputData.ratio = formatEtherToNumber(
                            ratioAfterAction
                        );
                        this.actionDatas.ratio = ratioAfterAction;

                        //this.inputData.ratio = this.burnData.targetRatio;
                        //this.actionDatas.ratio = n2bn(this.burnData.targetRatio.toString());
                    }
                }
            } catch (error) {
                this.errors.unStakeMsg = "Invalid number";
            }
        },

        //输入要销毁sUSD数量
        changeAmount(burnAmount) {
            try {
                if (this.isBinanceNetwork) {
                    this.resetErrorsMsg();
                    // this.resetInputData();

                    if (!burnAmount || this.burnData.sUSDBN.eq("0")) {
                        this.errors.amountMsg =
                            "You can't burn the amount of sUSD.";
                        return;
                    }

                    if (this.burnData.debtBN.eq("0")) {
                        this.errors.amountMsg = "There is no debt.";
                        return;
                    }

                    if (n2bn(burnAmount.toString()).gt(this.burnData.debtBN)) {
                        this.inputData.amount = burnAmount;
                        this.errors.amountMsg =
                            "The amount of sUSD is larger than your debt.";
                        // this.inputData.ratio = null;
                        return;
                    }

                    if (n2bn(burnAmount.toString()).gt(this.burnData.sUSDBN)) {
                        this.inputData.amount = burnAmount;
                        this.errors.amountMsg =
                            "You don't have enough amount of sUSD.";
                        this.inputData.ratio = null;
                        return;
                    }

                    let ratioAfterBurnInputAmount = bnMul(
                        bnDiv(
                            bnMul(
                                bnAdd(
                                    this.burnData.stakedBN,
                                    this.burnData.lockBN
                                ),
                                this.burnData.LINA2USDBN
                            ),
                            bnSub(
                                this.burnData.debtBN,
                                n2bn(burnAmount.toString())
                            )
                        ),
                        n2bn("100")
                    );

                    ////用输入的sUSD销毁后超额的抵押率算，不超过目标抵押率，则不能解锁LINA
                    if (
                        ratioAfterBurnInputAmount.lte(
                            n2bn(this.burnData.targetRatio.toString())
                        )
                    ) {
                        this.inputData.unStake = 0;
                        this.inputData.amount = burnAmount;
                        this.inputData.ratio = formatEtherToNumber(
                            ratioAfterBurnInputAmount
                        );

                        this.actionDatas.unStake = n2bn("0");
                        this.actionDatas.amount = n2bn(burnAmount.toString());
                        this.actionDatas.ratio = ratioAfterBurnInputAmount;
                        return;
                    }

                    //用输入的sUSD销毁后超额的抵押率算
                    let allCanUnstakedLINAAfterBurn = bnMul(
                        bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
                        bnDiv(
                            bnSub(
                                ratioAfterBurnInputAmount,
                                n2bn(this.burnData.targetRatio.toString())
                            ),
                            ratioAfterBurnInputAmount
                        )
                    );

                    if (
                        allCanUnstakedLINAAfterBurn.gt(this.burnData.stakedBN)
                    ) {
                        allCanUnstakedLINAAfterBurn = this.burnData.stakedBN;
                    }

                    // let pratioAfterBurnAndStake = bnMul(
                    //     bnDiv(
                    //         bnMul(
                    //             bnSub(
                    //                 bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
                    //                 allCanUnstakedLINAAfterBurn
                    //             ),
                    //             this.burnData.LINA2USDBN
                    //         ),
                    //         bnSub(this.burnData.debtBN, n2bn(burnAmount.toString()))
                    //     ),
                    //     n2bn("100")
                    // );

                    this.inputData.unStake = formatEtherToNumber(
                        allCanUnstakedLINAAfterBurn
                    );
                    this.actionDatas.unStake = allCanUnstakedLINAAfterBurn;

                    this.inputData.amount = burnAmount;
                    this.actionDatas.amount = n2bn(burnAmount.toString());

                    //this.inputData.ratio = formatEtherToNumber(pratioAfterBurnAndStake);
                    //this.actionDatas.ratio = pratioAfterBurnAndStake;
                    this.inputData.ratio = this.burnData.targetRatio;
                    this.actionDatas.ratio = n2bn(
                        this.burnData.targetRatio.toString()
                    );
                }
            } catch (error) {
                this.errors.amountMsg = "Invalid number";
            }
        },

        //输入想调成的抵押率
        changeRatio(ratioAmount) {
            try {
                //防止输入小数位引起的报错
                if (!ratioAmount || ratioAmount.countDecimals() > 0) {
                    return;
                }

                if (this.isBinanceNetwork) {
                    this.resetErrorsMsg();
                    // this.resetInputData();

                    if (this.burnData.debtBN.eq("0")) {
                        this.errors.ratioMsg = "There is no debt.";
                        return;
                    }

                    if (ratioAmount == 0) {
                        // this.inputData.unStake = 0;
                        // this.inputData.amount = 0;
                        this.inputData.ratio = ratioAmount;
                        this.errors.ratioMsg =
                            "The P-Ratio cant be below target ratio.";
                        return;
                    } else if (ratioAmount == this.burnData.currentRatio) {
                        //ratioAmount 等于 targetRatio，不需要操作
                        // this.inputData.unStake = 0;
                        // this.inputData.amount = 0;
                        this.inputData.ratio = ratioAmount;
                        return;
                    } else if (
                        (this.burnData.targetRatio >
                            this.burnData.currentRatio &&
                            ratioAmount < this.burnData.currentRatio) ||
                        (this.burnData.targetRatio <
                            this.burnData.currentRatio &&
                            ratioAmount < this.burnData.targetRatio)
                    ) {
                        //ratioAmount 不允许小于 targetRatio 与 currentRatio 之间较小那个
                        this.inputData.unStake = 0;
                        this.inputData.amount = 0;
                        this.inputData.ratio = ratioAmount;
                        this.errors.ratioMsg = "The P-Ratio is too low.";
                        return;
                    }

                    let maxRatioAfterBurnMax = n2bn("0");

                    if (this.burnData.sUSDBN.lt(this.burnData.debtBN)) {
                        maxRatioAfterBurnMax = bnMul(
                            bnDiv(
                                bnMul(
                                    bnAdd(
                                        this.burnData.stakedBN,
                                        this.burnData.lockBN
                                    ),
                                    this.burnData.LINA2USDBN
                                ),
                                bnSub(
                                    this.burnData.debtBN,
                                    this.burnData.sUSDBN
                                )
                            ),
                            n2bn("100")
                        );
                    }

                    if (
                        !maxRatioAfterBurnMax.eq("0") &&
                        n2bn(ratioAmount.toString()).gt(maxRatioAfterBurnMax)
                    ) {
                        this.errors.ratioMsg =
                            "The P-Ratio can't be larger than your staking amount of LINA.";
                        return;
                    }

                    if (ratioAmount > this.burnData.currentRatio) {
                        //上调抵押率，计算sUSD，LINA为0，调整抵押率最大为无限大，也就是销毁所有sUSD
                        //计算达成 ratioAmount 时，抵押的LINA价值多少sUSD
                        let retainsUSD = bnDiv(
                            bnMul(
                                bnAdd(
                                    this.burnData.stakedBN,
                                    this.burnData.lockBN
                                ),
                                this.burnData.LINA2USDBN
                            ),
                            n2bn((ratioAmount / 100).toString())
                        );
                        let burnsUSD = bnSub(this.burnData.debtBN, retainsUSD); //债务 - 抵押的LINA价值多少sUSD = 需要销毁的sUSD

                        this.inputData.unStake = 0;
                        this.actionDatas.unStake = n2bn("0");

                        this.inputData.amount = formatEtherToNumber(burnsUSD);
                        this.actionDatas.amount = burnsUSD;

                        this.inputData.ratio = ratioAmount;
                        this.actionDatas.ratio = n2bn(ratioAmount.toString());
                    } else if (
                        ratioAmount < this.burnData.currentRatio &&
                        ratioAmount >= this.burnData.targetRatio
                    ) {
                        if (
                            this.burnData.lockBN.gt("0") &&
                            this.burnData.stakedBN.eq("0")
                        ) {
                            this.errors.ratioMsg =
                                "Please reduce the P-Ratio through build.";
                            return;
                        }

                        //有lock lina时，在burn页面，抵押率最低只能调整到取回超额的stake lina
                        if (
                            this.burnData.lockBN.gt("0") &&
                            this.burnData.stakedBN.gt("0")
                        ) {
                            let overStaked = bnMul(
                                bnAdd(
                                    this.burnData.stakedBN,
                                    this.burnData.lockBN
                                ),
                                bnDiv(
                                    bnSub(
                                        this.burnData.currentRatioBN,
                                        n2bn(
                                            this.burnData.targetRatio.toString()
                                        )
                                    ),
                                    this.burnData.currentRatioBN
                                )
                            );

                            if (overStaked.gt(this.burnData.stakedBN)) {
                                overStaked = this.burnData.stakedBN;
                            }

                            let pratioMinAfterUnstake = bnDiv(
                                bnMul(
                                    bnSub(
                                        bnAdd(
                                            this.burnData.stakedBN,
                                            this.burnData.lockBN
                                        ),
                                        overStaked
                                    ),
                                    this.burnData.LINA2USDBN
                                ),
                                this.burnData.currentRatioBN
                            );

                            if (
                                utils
                                    .parseEther(ratioAmount.toString())
                                    .lt(pratioMinAfterUnstake)
                            ) {
                                this.inputData.unStake = 0;
                                this.inputData.amount = 0;
                                this.inputData.ratio = ratioAmount;
                                this.errors.ratioMsg =
                                    "Can not set this P-Ratio.";
                                return;
                            }
                        }

                        //下调抵押率，sUSD为0，计算LINA
                        //计算达成 ratioAmount 时，需要抵押多少LINA
                        let retainStake = bnDiv(
                            bnMul(
                                n2bn((ratioAmount / 100).toString()),
                                this.burnData.debtBN
                            ),
                            this.burnData.LINA2USDBN
                        );

                        //已抵押的LINA - 需要抵押多少LINA = 达成 ratioAmount 需要解锁的LINA
                        let unStake = bnSub(
                            bnAdd(this.burnData.stakedBN, this.burnData.lockBN),
                            retainStake
                        );

                        this.inputData.unStake = formatEtherToNumber(unStake);
                        this.actionDatas.unStake = unStake;

                        this.inputData.amount = 0;
                        this.actionDatas.amount = n2bn("0");

                        this.inputData.ratio = ratioAmount;
                        this.actionDatas.ratio = n2bn(ratioAmount.toString());
                    }
                }
            } catch (error) {
                this.errors.ratioMsg = "Invalid number";
            }
        },

        showIntroductActionModal() {
            this.introductActionModal = true;
        },

        etherscan() {
            //模拟跳到错误页
            this.actionTabs = "m3";
        },

        //回到默认状态
        setDefaultTab() {
            this.actionTabs = "m0";
            this.activeItemBtn = -1;

            this.isBinanceNetwork && this.getBurnData(this.walletAddress);

            this.resetInputData();
        },

        //重试
        tryAgain() {
            this.actionTabs = "m0";
        },

        //跳转到设置
        jumpToStep() {
            this.$store.commit("setSetupModal", true);
        }
    }
};
</script>

<style lang="scss">
#burn {
    .actionTabs {
        border-radius: 16px;
        box-shadow: 0px 2px 6px #deddde;

        .ivu-tabs-bar {
            display: none;
        }

        .ivu-tabs-content {
            background: #fff;

            .ivu-tabs-tabpane {
                width: 786px;
                height: 840px !important;

                .burnBox,
                .waitingBox,
                .successBox,
                .wrongBox {
                    width: 100%;
                    height: 100%;
                }

                .burnBox {
                    position: relative;

                    .actionBodyWeb {
                        padding: 64px 193px 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        .actionTitle {
                            font-family: Gilroy-Bold;
                            font-size: 32px;
                            font-weight: bold;
                            font-stretch: normal;
                            font-style: normal;
                            line-height: 1.25;
                            letter-spacing: normal;
                            text-align: center;
                            color: #5a575c;
                        }

                        .actionDesc {
                            margin-top: 8px;
                            font-family: Gilroy-Regular;
                            font-size: 14px;
                            font-weight: normal;
                            font-stretch: normal;
                            font-style: normal;
                            line-height: 1.29;
                            letter-spacing: normal;
                            text-align: center;
                            color: #99999a;
                            margin-bottom: 40px;

                            .step {
                                text-transform: uppercase;
                                font-family: Gilroy-Bold;
                                font-weight: bold;
                                line-height: 1.6;
                                letter-spacing: 1.25px;
                                color: #1a38f8;
                                cursor: pointer;
                            }
                        }

                        .actionRate {
                            margin: 0 0 16px;
                            border-radius: 12px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            padding: 4px 16px;
                            font-family: Gilroy-Medium;
                            font-size: 12px;
                            font-weight: 500;
                            font-stretch: normal;
                            font-style: normal;
                            line-height: 1.33;
                            letter-spacing: normal;
                            text-align: center;
                            width: 100%;
                            background-color: rgba(#7eb5ff, 0.1);
                            color: #1a38f8;
                        }

                        .actionInputItem {
                            margin-bottom: 24px;
                            border-radius: 8px;
                            border: solid 1px #deddde;
                            padding: 39px 24px;
                            display: flex;
                            justify-content: space-between;
                            width: 100%;
                            transition: $animete-time linear;
                            position: relative;

                            &:hover,
                            &.active {
                                border-color: white;
                                box-shadow: 0px 2px 12px #deddde;
                            }

                            .itemLeft {
                                display: flex;
                                margin-right: 16px;
                                align-items: center;

                                .itemIcon {
                                    margin-right: 16px;
                                    width: 40px;
                                    height: 40px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 50%;
                                    background: #ffffff;

                                    img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }

                                .itemType {
                                    .itemTypeTitle {
                                        font-family: Gilroy-Bold;
                                        font-size: 16px;
                                        font-weight: bold;
                                        font-stretch: normal;
                                        font-style: normal;
                                        line-height: 1.5;
                                        letter-spacing: normal;
                                        color: #5a575c;

                                        .tip {
                                            margin-left: 8px;

                                            img {
                                                margin-top: -3px;
                                            }
                                        }
                                    }

                                    .itemTypeBtn {
                                        transition: $animete-time linear;
                                        cursor: pointer;
                                        display: flex;
                                        opacity: 0.2;
                                        text-transform: uppercase;
                                        font-family: Gilroy-Bold;
                                        font-size: 12px;
                                        font-weight: bold;
                                        font-stretch: normal;
                                        font-style: normal;
                                        line-height: 1.33;
                                        letter-spacing: 1.5px;
                                        text-align: center;
                                        color: #1a38f8;

                                        img {
                                            margin-left: 6px;
                                        }

                                        &:hover {
                                            &:not(.default) {
                                                opacity: 1;
                                            }
                                        }

                                        &.active {
                                            opacity: 1;
                                        }

                                        &.default {
                                            cursor: default;
                                        }
                                    }
                                }
                            }

                            .itemRight {
                                flex: 1;
                                display: flex;

                                .inputRect {
                                    display: flex;
                                    align-items: center;
                                    justify-content: flex-end;
                                    // margin-bottom: 8px;
                                    .input {
                                        width: 100%;
                                        border: none;
                                        box-shadow: none;

                                        .ivu-input-number-handler-wrap {
                                            display: none;
                                        }

                                        .ivu-input-number-input {
                                            text-align: right;
                                            font-family: Gilroy-Bold;
                                            font-size: 32px;
                                            font-weight: bold;
                                            font-stretch: normal;
                                            font-style: normal;
                                            line-height: 1.25;
                                            letter-spacing: normal;

                                            &::placeholder {
                                                color: #99999a;
                                            }
                                        }
                                    }

                                    .unit {
                                        color: #5a575c;
                                        font-family: Gilroy-Regular;
                                        font-size: 16px;
                                        font-weight: 400;
                                        line-height: 24px;
                                        text-transform: uppercase;
                                    }
                                }

                                .avaliable {
                                    color: #c6c4c7;
                                    font-family: Gilroy;
                                    font-size: 12px;
                                    font-weight: 500;
                                    line-height: 16px;
                                    text-align: right;
                                }
                            }

                            .itemErrMsg {
                                transition: opacity $animete-time linear;
                                position: absolute;
                                left: 0;
                                bottom: -20px;
                                height: 16px;
                                color: #df434c;
                                font-family: Gilroy;
                                font-size: 10px;
                                font-weight: 700;
                                line-height: 16px;
                                text-transform: uppercase;
                                letter-spacing: 1.25px;
                            }

                            &.error {
                                border-color: #df434c;
                            }
                        }

                        #gasEditor {
                            margin-top: 20px;
                        }
                    }

                    .actionBodyMobile {
                        display: none;
                    }

                    .burnBtn {
                        width: 100%;
                        position: absolute;
                        bottom: 0px;
                        height: 80px;
                        cursor: pointer;
                        background: #1a38f8;
                        color: #ffffff;
                        text-transform: uppercase;
                        transition: $animete-time linear;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: Gilroy-Bold;
                        font-size: 24px;
                        font-weight: bold;
                        font-stretch: normal;
                        font-style: normal;
                        letter-spacing: 3px;
                        text-align: center;

                        &:hover {
                            &:not(.disabled) {
                                background-color: #7eb5ff;
                            }
                        }

                        &.disabled {
                            cursor: not-allowed;
                            opacity: 0.1;
                        }

                        &.switchToBSC {
                            font-family: Gilroy-Bold;
                            font-size: 16px;
                            font-weight: bold;
                            font-stretch: normal;
                            font-style: normal;
                            line-height: 1.5;
                            letter-spacing: normal;
                            color: #1a38f8;
                            cursor: not-allowed;
                            background-color: #eff6ff;
                            text-transform: none;
                            &:hover {
                                &:not(.disabled) {
                                    background-color: #eff6ff;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: $max-phone-width) {
    #burn {
        border-radius: 16px;
        box-shadow: 0px 2px 6px #deddde;
        min-height: 550px;

        .actionTabs {
            border-radius: 16px;
            box-shadow: 0px 2px 6px #deddde;
            min-height: 550px;

            .ivu-tabs-bar {
                display: none;
            }

            .ivu-tabs-content {
                background: #fff;

                .ivu-tabs-tabpane {
                    width: 100%;
                    height: 88vh !important;
                    min-height: 550px;
                    background: white;

                    .burnBox,
                    .waitingBox,
                    .successBox,
                    .wrongBox {
                        width: 100%;
                        height: 100%;
                        min-height: 550px;
                    }

                    .burnBox {
                        position: relative;

                        .actionBodyWeb {
                            display: none;
                        }

                        .actionBodyMobile {
                            display: flex;
                            flex-direction: column;
                            align-items: center;

                            .errMsg {
                                align-items: center;
                                height: 14.6vw;
                                width: 74.4vw;
                                padding: 12px 16px;
                                margin-top: 24px;
                                border-radius: 8px;
                                background-color: rgba(223, 67, 76, 0.05);
                                font-size: 12px;
                                color: #df434c;

                                img {
                                    margin-right: 16px;
                                }
                            }

                            .actionRate {
                                width: 74.4vw;
                                margin: 32px 0 28px;
                                border-radius: 12px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                padding: 4px 16px;
                                font-family: Gilroy-Medium;
                                font-size: 12px;
                                font-weight: 500;
                                font-stretch: normal;
                                font-style: normal;
                                line-height: 1.33;
                                letter-spacing: normal;
                                text-align: center;
                                background-color: rgba(#7eb5ff, 0.1);
                                color: #1a38f8;
                            }

                            .inputGroupBox {
                                width: 74.4vw;
                                display: flex;
                                justify-content: space-between;

                                .actionInputItem {
                                    position: relative;
                                    margin-bottom: 24px;
                                    border-radius: 8px;
                                    border: solid 1px #deddde;
                                    transition: $animete-time linear;

                                    &.active {
                                        border-color: white;
                                        box-shadow: 0px 2px 12px #deddde;
                                    }

                                    .inputBox {
                                        height: 52.1vw;
                                        width: 35.2vw;
                                        position: relative;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;

                                        .showInfo {
                                            position: absolute;
                                            top: 8px;
                                            right: 8px;
                                        }

                                        .logo {
                                            width: 40px;
                                            margin: 24px 0 16px;
                                        }

                                        .itemTypeTitle {
                                            margin: 0 0 4px;
                                            font-family: Gilroy;
                                            font-size: 12px;
                                            font-weight: 500;
                                            text-align: center;
                                            color: #99999a;
                                        }

                                        .input {
                                            width: 100%;
                                            height: 24px;
                                            border: none;
                                            box-shadow: none;

                                            .ivu-input-number-handler-wrap {
                                                display: none;
                                            }

                                            .ivu-input-number-input {
                                                text-align: center;
                                                font-family: Gilroy-Bold;
                                                font-size: 16px;
                                                font-weight: bold;
                                                font-stretch: normal;
                                                font-style: normal;
                                                line-height: 1.25;
                                                letter-spacing: normal;

                                                &::placeholder {
                                                    color: #99999a;
                                                }
                                            }
                                        }

                                        .itemTypeBtn {
                                            height: 32px;
                                            width: 100%;
                                            position: absolute;
                                            bottom: 0;
                                            border-top: solid 1px #e5e5e5;
                                            font-family: Gilroy;
                                            text-align: center;
                                            font-size: 10px;
                                            line-height: 32px;
                                            font-weight: bold;
                                            color: #1a38f8;
                                        }
                                    }

                                    &.error {
                                        border-color: #df434c;
                                    }
                                }
                            }

                            .actionInputItem {
                                margin-bottom: 24px;
                                border-radius: 8px;
                                border: solid 1px #deddde;
                                transition: $animete-time linear;

                                &.active {
                                    border-color: white;
                                    box-shadow: 0px 2px 12px #deddde;
                                }

                                .ratioInputBox {
                                    width: 74.4vw;
                                    position: relative;

                                    .box {
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        padding: 0 16px;
                                        height: 21.6vw;

                                        .itemTypeTitle {
                                            font-family: Gilroy;
                                            font-size: 12px;
                                            font-weight: 500;
                                            text-align: center;
                                            color: #99999a;
                                        }

                                        .input {
                                            width: 53.33vw;
                                            height: 32px;
                                            border: none;
                                            box-shadow: none;
                                            padding: 0;

                                            .ivu-input-number-handler-wrap {
                                                display: none;
                                            }

                                            .ivu-input-number-input {
                                                text-align: right;
                                                font-family: Gilroy-Bold;
                                                font-size: 16px;
                                                font-weight: bold;
                                                font-stretch: normal;
                                                font-style: normal;
                                                line-height: 1.25;
                                                letter-spacing: normal;

                                                &::placeholder {
                                                    color: #99999a;
                                                }
                                            }
                                        }
                                    }

                                    .itemTypeBtn {
                                        height: 32px;
                                        width: 100%;
                                        position: relative;
                                        bottom: 0;
                                        border-top: solid 1px #e5e5e5;
                                        font-family: Gilroy;
                                        text-align: center;
                                        font-size: 10px;
                                        line-height: 32px;
                                        font-weight: bold;
                                        color: #1a38f8;
                                    }
                                }

                                &.error {
                                    border-color: #df434c;
                                }
                            }
                        }

                        .burnBtn {
                            width: 100%;
                            position: absolute;
                            bottom: 0px;
                            height: 12.8vw !important;
                            cursor: pointer;
                            background: #1a38f8;
                            color: #ffffff;
                            text-transform: uppercase;
                            transition: $animete-time linear;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-family: Gilroy-Bold;
                            font-size: 16px;
                            font-weight: bold;
                            font-stretch: normal;
                            font-style: normal;
                            letter-spacing: 3px;
                            text-align: center;

                            &:hover {
                                &:not(.disabled) {
                                    background-color: #7eb5ff;
                                }
                            }

                            &.disabled {
                                cursor: not-allowed;
                                opacity: 0.1;
                            }
                        }
                    }
                }
            }
        }

        .introductActionModal {
            .ivu-modal-mask {
                z-index: 10000 !important;
            }

            .ivu-modal-wrap {
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000 !important;

                .ivu-modal {
                    width: 74.66vw !important;
                    height: 36.8vw;
                    top: 0 !important;

                    .ivu-modal-content {
                        height: 100%;

                        .ivu-modal-body {
                            height: 100%;
                            padding: 24px;

                            .title {
                                font-family: Gilroy-Bold;
                                font-size: 16px;
                                margin-bottom: 9px;
                            }

                            .context {
                                font-family: Gilroy;
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
