<template>
    <Modal
        id="referralModal"
        v-model="referralModal"
        :footer-hide="true"
        :closable="false"
        :transfer="false"
        :mask="false"
        scrollable
        fullscreen
        @on-visible-change="referralModalChange"
    >
        <div class="closeBtn" @click="referralModal = false">
            <closeSvg></closeSvg>
        </div>

        <Tabs v-model="referralTabs" class="referralTabs">
            <TabPane name="m0" class="m0">
                <div class="content">
                    <div
                        class="errMsgMobile"
                        :style="{
                            display:
                                codeInputErrorMsg && isMobile ? 'flex' : 'none'
                        }"
                    >
                        <img src="@/static/error.svg" />
                        {{ codeInputErrorMsg }}
                    </div>

                    <div class="contentTitle">Earn Shum with friends</div>
                    <div class="contentDesc">
                        Receive 10 USD worth Shum when a friend adds your code
                        and completes 10 transactions, up to 1000 quota for
                        phase 1 marketing
                    </div>
                    <div class="youCodeBox">
                        <div class="icon">
                            <img src="@/static/referral.svg" />
                        </div>
                        <div class="title">Your referral code</div>
                        <div class="code">{{ referralCode.self_code }}</div>

                        <Tooltip
                            class="globalInfoStyle"
                            :content="tooltipContent"
                            offset="0 6"
                            placement="bottom"
                            @on-popper-hide="resetTooltipContent"
                        >
                            <div
                                class="copyBtn"
                                :data-clipboard-text="referralCode.self_code"
                                data-clipboard-action="copy"
                                @click="copyYouCode"
                            >
                                <img src="@/static/copy_hover.svg" />Copy to
                                Clipboard
                            </div>
                        </Tooltip>
                    </div>

                    <div class="dashLine"></div>

                    <div
                        class="referralCodeBox"
                        :class="{
                            error: codeInputErrorMsg,
                            hasCode: addCodeFinish
                        }"
                        @click="codeInputFocus"
                    >
                        <div class="info">
                            <span v-if="addCodeFinish">Added</span>
                            <span v-else>Enter</span>&nbsp;referral code

                            <Tooltip
                                class="tip globalInfoStyle"
                                placement="top"
                                content="Referral code can only be submitted once."
                                offset="0 4"
                            >
                                <img src="@/static/info_white.svg" />
                            </Tooltip>

                            <img
                                class="showInfoMobile"
                                src="@/static/info_white.svg"
                                @click="showIntroductActionModal"
                            />
                        </div>
                        <input
                            :disabled="loading"
                            v-if="!addCodeFinish"
                            type="text"
                            class="codeInput"
                            ref="codeInput"
                            v-model="referralCode.referral_code"
                            placeholder="eg: 019fGa01"
                            @input="codeInputChange"
                        />

                        <div v-else class="codeInput">
                            {{ referralCode.referral_code }}
                        </div>

                        <div
                            class="itemErrMsg"
                            :style="{
                                opacity: codeInputErrorMsg ? '1' : '0'
                            }"
                        >
                            {{ codeInputErrorMsg }}
                        </div>
                    </div>
                </div>

                <div
                    v-show="!addCodeFinish"
                    class="submitBtn"
                    :class="{ disabled: disabledSubmitBtn }"
                    @click="checkReferralCode"
                >
                    Submit referral code
                </div>
            </TabPane>

            <TabPane name="m1" class="m1">
                <div class="titleMobile">Confirmation</div>
                <div class="icon"><img src="@/static/success.svg" /></div>
                <div class="title">
                    You are adding {{ referralCode.referral_code }}. Are you
                    sure?
                </div>
                <div class="desc">
                    Referral code can only be submitted once.
                </div>
                <div class="btns">
                    <div class="back" @click="referralTabs = 'm0'">
                        No, go back
                    </div>
                    <div
                        class="confirm"
                        :class="{ disabled: disabledSubmitBtn }"
                        @click="submitReferralCode"
                    >
                        Yes, I confirm
                    </div>
                </div>
            </TabPane>
        </Tabs>

        <Spin size="large" fix v-if="loading"></Spin>

        <Modal
            v-model="introductActionModal"
            :footer-hide="true"
            :closable="true"
            :transfer="true"
            :mask="true"
            class="introductActionModal"
        >
            <div class="title">Enter referral code</div>
            <div class="context">
                Referral code can only be submitted once.
            </div>
        </Modal>
    </Modal>
</template>

<script>
import _ from "lodash";
import Clipboard from "clipboard";
import api from "@/api";
import closeSvg from "@/components/svg/close";

export default {
    name: "referralModal",
    components: {
        closeSvg
    },
    data() {
        return {
            referralTabs: "m0",

            referralModal: false,

            referralCode: { self_code: "--------", referral_code: "" },

            addCodeFinish: false,

            codeInputErrorMsg: "",

            loading: false,

            introductActionModal: false,

            tooltipContent: "Copy to clipboard"
        };
    },
    created() {
        //订阅组件改变事件
        this.$pub.subscribe("referralModalChange", (msg, params) => {
            this.referralModal = params;
        });
    },
    watch: {
        disabledSubmitBtn() {},
        walletAddress() {},
        isMobile() {}
    },
    computed: {
        //提交按钮禁止
        disabledSubmitBtn() {
            return (
                this.referralCode.referral_code?.length != 8 ||
                this.codeInputErrorMsg ||
                this.loading
            );
        },

        walletAddress() {
            return this.$store.state?.wallet?.address;
        },

        isMobile() {
            return this.$store.state?.isMobile;
        }
    },
    methods: {
        /**
         * 窗口打开关闭事件
         */
        referralModalChange(status) {
            if (status) {
                this.loading = true;
                api.getReferralCode(this.walletAddress)
                    .then(res => {
                        if (_.has(res, "data")) {
                            this.referralCode = res.data;
                            this.addCodeFinish =
                                this.referralCode.referral_code != null;
                        }
                    })
                    .catch(err => {
                        this.referralCode.self_code = "--------";
                        this.codeInputErrorMsg = _.has(err.data, "msg")
                            ? err.data.msg
                            : "unknown error";
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                this.$pub.publish("referralModalCloseEvent");

                _.delay(() => {
                    this.referralTabs = "m0";
                    this.codeInputErrorMsg = "";
                }, 200);
            }
        },

        /**
         * 复制自己的code
         */
        copyYouCode() {
            var clipboarda = new Clipboard(".copyBtn");
            clipboarda.on("success", e => {
                this.tooltipContent = "Copied";
                e.clearSelection();
            });
            clipboarda.on("error", function(e) {
                this.tooltipContent = "Error";
            });
        },

        /**
         * code输入框自动获取焦点
         */
        codeInputFocus() {
            //未添加时
            if (!this.addCodeFinish) {
                this.$nextTick(() => {
                    this.$refs.codeInput.focus();
                });
            }
        },

        /**
         * 输入code改变事件
         */
        codeInputChange(e) {
            if (
                this.referralCode.referral_code &&
                this.referralCode.referral_code?.length != 8
            ) {
                this.codeInputErrorMsg = "The referral code is 8 characters";
            } else if (
                this.referralCode.self_code == this.referralCode.referral_code
            ) {
                this.codeInputErrorMsg = "Can't add self referral code";
            } else {
                this.codeInputErrorMsg = "";
            }
        },

        /**
         * 检查code是否有效
         */
        checkReferralCode() {
            if (!this.disabledSubmitBtn) {
                this.loading = true;
                api.checkReferralCode(
                    this.walletAddress,
                    this.referralCode.referral_code
                )
                    .then(res => {
                        this.referralTabs = "m1";
                    })
                    .catch(err => {
                        this.codeInputErrorMsg = _.has(err.data, "msg")
                            ? err.data.msg
                            : "unknown error";
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },

        /**
         * 确认添加code
         */
        submitReferralCode() {
            if (!this.disabledSubmitBtn) {
                this.loading = true;
                api.addReferralCode(
                    this.walletAddress,
                    this.referralCode.referral_code
                )
                    .then(res => {
                        this.addCodeFinish = true;
                    })
                    .catch(err => {
                        this.codeInputErrorMsg = _.has(err.data, "msg")
                            ? err.data.msg
                            : "unknown error";
                    })
                    .finally(() => {
                        this.loading = false;
                        this.referralTabs = "m0";
                    });
            }
        },

        showIntroductActionModal() {
            this.introductActionModal = true;
        },

        //重置复制提示框的文本
        resetTooltipContent() {
            setTimeout(() => {
                this.tooltipContent = "Copy to clipboard";
            }, 300);
        }
    }
};
</script>

<style lang="scss">
#referralModal {
    .ivu-modal-wrap {
        position: absolute;

        .ivu-modal-body {
            border-radius: 16px;
            background: #ffffff;
            box-shadow: 0px 2px 6px #deddde;
            position: relative;
            padding: 0;
            height: 100%;
            overflow: hidden;

            .closeBtn {
                z-index: 1;
                position: absolute;
                top: 24px;
                right: 24px;
            }

            .referralTabs {
                height: 100%;

                .ivu-tabs-bar {
                    display: none;
                }

                .ivu-tabs-content {
                    height: 100%;
                }

                .m0 {
                    .content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 64px 193px;

                        .errMsgMobile {
                            display: none;
                        }

                        .contentTitle {
                            color: #5a575c;
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

                        .contentDesc {
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
                        }

                        .youCodeBox {
                            margin-top: 53px;
                            border-radius: 8px;
                            background: rgba($color: #7eb5ff, $alpha: 0.1);
                            width: 100%;
                            padding: 40px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;

                            .icon {
                                width: 56px;
                                height: 56px;
                                img {
                                    height: 100%;
                                    width: 100%;
                                }
                            }

                            .title {
                                color: #5a575c;
                                font-family: Gilroy-Bold;
                                font-size: 16px;
                                font-weight: bold;
                                font-stretch: normal;
                                font-style: normal;
                                line-height: 1.5;
                                letter-spacing: normal;
                                text-align: center;
                                margin: 24px 0 8px;
                            }

                            .code {
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

                            .copyBtn {
                                margin-top: 16px;
                                padding: 6px 16px;
                                display: flex;
                                align-items: center;
                                text-transform: uppercase;
                                cursor: pointer;
                                font-family: Gilroy-Bold;
                                font-size: 10px;
                                font-weight: bold;
                                font-stretch: normal;
                                font-style: normal;
                                line-height: 1.6;
                                letter-spacing: 1.25px;
                                color: #1a38f8;
                                transition: $animete-time linear;
                                border-radius: 16px;
                                border: solid 1px #e5e5e5;

                                img {
                                    margin-right: 10px;
                                }

                                &:hover {
                                    border-color: #1a38f8;
                                }

                                &.success {
                                    border-color: greenyellow;
                                }

                                &.error {
                                    border-color: #df434c;
                                }
                            }
                        }

                        .dashLine {
                            margin: 48px 0;
                            width: 786px;
                            display: inline-block;
                            height: 1px;
                            // border: 1px dashed #deddde;
                            background-image: linear-gradient(
                                to right,
                                #ccc 0%,
                                #ccc 50%,
                                transparent 50%
                            );
                            background-size: 12px 1px;
                            background-repeat: repeat-x;
                        }

                        .referralCodeBox {
                            width: 100%;
                            padding: 23px 80px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            border-radius: 8px;
                            border: solid 1px #deddde;
                            transition: $animete-time linear;
                            position: relative;

                            &.hasCode {
                                background: rgba(126, 181, 255, 0.1);
                                border: none;
                            }

                            &:hover {
                                &:not(.hasCode) {
                                    box-shadow: 0px 2px 12px #deddde;
                                }

                                &:not(.error) {
                                    border-color: white;
                                }
                            }

                            &.error {
                                border-color: #df434c;
                            }

                            .info {
                                display: flex;
                                align-items: center;
                                font-family: Gilroy-Bold;
                                font-size: 16px;
                                font-weight: bold;
                                font-stretch: normal;
                                font-style: normal;
                                line-height: 1.5;
                                letter-spacing: normal;
                                text-align: center;
                                color: #5a575c;

                                .tip {
                                    margin-left: 8px;

                                    img {
                                        margin-top: -3px;
                                    }
                                }

                                .showInfoMobile {
                                    display: none;
                                }
                            }

                            .codeInput {
                                margin-top: 8px;
                                width: 100%;
                                color: #5a575c;
                                border: none;
                                box-shadow: none;
                                text-align: center;
                                outline: none;
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
                        }
                    }

                    .submitBtn {
                        cursor: pointer;
                        width: 100%;
                        position: absolute;
                        bottom: 0;
                        height: 80px;
                        background: #1a38f8;
                        color: #ffffff;
                        font-family: Gilroy;
                        font-size: 24px;
                        font-weight: 700;
                        line-height: 80px;
                        text-align: center;
                        text-transform: uppercase;
                        letter-spacing: 3px;
                        transition: $animete-time linear;

                        &:hover {
                            &:not(.disabled) {
                                background-color: #7eb5ff;
                            }
                        }

                        &.disabled {
                            opacity: 0.1;
                            cursor: not-allowed;
                        }
                    }
                }

                .m1 {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .titleMobile {
                        display: none;
                    }

                    .title {
                        margin: 40px 0 8px;
                        font-family: Gilroy-Bold;
                        font-size: 24px;
                        font-weight: bold;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.33;
                        letter-spacing: normal;
                        text-align: center;
                        color: #5a575c;
                    }

                    .desc {
                        color: #5a575c;
                        font-family: Gilroy-Regular;
                        font-size: 16px;
                        font-weight: 400;
                        line-height: 24px;
                        text-align: center;
                    }

                    .btns {
                        margin-top: 48px;
                        display: flex;
                        .back,
                        .confirm {
                            font-family: Gilroy;
                            font-size: 12px;
                            font-weight: 700;
                            line-height: 16px;
                            text-align: center;
                            text-transform: uppercase;
                            letter-spacing: 1.5px;
                            border-radius: 20px;
                            padding: 13px 25px 11px;
                            cursor: pointer;
                            margin: 0 8px;
                        }

                        .back {
                            border: solid 1px #1a38f8;
                            color: #1a38f8;
                        }

                        .confirm {
                            color: white;
                            background: #1a38f8;

                            &:hover {
                                &:not(.disabled) {
                                    background-color: #7eb5ff;
                                }
                            }

                            &.disabled {
                                opacity: 0.1;
                                cursor: not-allowed;
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: $max-phone-width) {
    body {
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
                        border-radius: 6px;

                        .ivu-modal-body {
                            height: 100%;
                            padding: 24px;
                            box-shadow: unset;

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

    #referralModal {
        min-height: 550px;

        .ivu-modal-wrap {
            .ivu-modal-body {
                .closeBtn {
                    top: 7px;
                    right: 7px;

                    #closeSvg {
                        width: 26px !important;
                        height: 26px !important;
                    }
                }

                .referralTabs {
                    height: 100%;

                    .ivu-tabs-bar {
                        display: none;
                    }

                    .ivu-tabs-content {
                        height: 100%;
                    }

                    .m0 {
                        .content {
                            padding: 0;

                            .errMsgMobile {
                                text-transform: uppercase;
                                display: flex;
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

                            .contentTitle {
                                margin-top: 24px;
                                font-family: Gilroy;
                                font-size: 16px;
                                font-weight: 500;
                                color: #99999a;
                            }

                            .contentDesc {
                                display: none;
                            }

                            .youCodeBox {
                            }

                            .youCodeBox {
                                width: 74.6vw;
                                margin-top: 16px;
                                padding: 20px;

                                .title {
                                    font-size: 14px;
                                    font-weight: bold;
                                }

                                .code {
                                    font-size: 24px;
                                }
                            }

                            .dashLine {
                                margin: 30px 0 !important;
                                width: 786px;
                                display: inline-block;
                                height: 1px;
                                // border: 1px dashed #deddde;
                                background-image: linear-gradient(
                                    to right,
                                    #ccc 0%,
                                    #ccc 50%,
                                    transparent 50%
                                );
                                background-size: 12px 1px;
                                background-repeat: repeat-x;
                            }

                            .referralCodeBox {
                                width: 74.6vw;
                                padding: 16px 24px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                border-radius: 8px;
                                border: solid 1px #deddde;
                                transition: $animete-time linear;
                                position: relative;

                                &.hasCode {
                                    background: rgba(126, 181, 255, 0.1);
                                    border: none;
                                }

                                &:hover {
                                    &:not(.hasCode) {
                                        box-shadow: 0px 2px 12px #deddde;
                                    }

                                    &:not(.error) {
                                        border-color: white;
                                    }
                                }

                                &.error {
                                    border-color: #df434c;
                                }

                                .info {
                                    display: flex;
                                    align-items: center;
                                    font-family: Gilroy-Bold;
                                    font-size: 12px;
                                    font-weight: unset;
                                    font-stretch: normal;
                                    font-style: normal;
                                    line-height: 1.5;
                                    letter-spacing: normal;
                                    text-align: center;
                                    color: #5a575c;

                                    .tip {
                                        display: none;
                                    }

                                    .showInfoMobile {
                                        display: block;
                                        position: absolute;
                                        top: 9px;
                                        right: 9px;
                                    }
                                }

                                .codeInput {
                                    margin-top: 8px;
                                    width: 100%;
                                    color: #5a575c;
                                    border: none;
                                    box-shadow: none;
                                    text-align: center;
                                    outline: none;
                                    font-family: Gilroy-Bold;
                                    font-size: 24px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    font-style: normal;
                                    line-height: 1.25;
                                    letter-spacing: normal;

                                    &::placeholder {
                                        color: #99999a;
                                    }
                                }

                                .itemErrMsg {
                                    display: none;
                                }
                            }
                        }

                        .submitBtn {
                            height: 12.8vw !important;
                            font-size: 16px;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            &:hover {
                                &:not(.disabled) {
                                    background-color: #7eb5ff;
                                }
                            }

                            &.disabled {
                                opacity: 0.1;
                                cursor: not-allowed;
                            }
                        }
                    }

                    .m1 {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 24px 30px 0;

                        .titleMobile {
                            position: absolute;
                            top: 24px;
                            left: 30px;
                            display: block;
                            font-family: Gilroy-Bold;
                            font-size: 16px;
                            color: #5a575c;
                        }

                        .title {
                            margin: 40px 0 8px;
                            font-family: Gilroy-Bold;
                            font-size: 24px;
                            font-weight: bold;
                            font-stretch: normal;
                            font-style: normal;
                            line-height: 1.33;
                            letter-spacing: normal;
                            text-align: center;
                            color: #5a575c;
                        }

                        .desc {
                            color: #5a575c;
                            font-family: Gilroy-Regular;
                            font-size: 16px;
                            font-weight: 400;
                            line-height: 24px;
                            text-align: center;
                        }

                        .btns {
                            width: 100%;
                            margin-top: 48px;
                            display: flex;
                            flex-direction: column-reverse;

                            .back,
                            .confirm {
                                font-family: Gilroy;
                                font-size: 12px;
                                font-weight: 700;
                                line-height: 16px;
                                text-align: center;
                                text-transform: uppercase;
                                letter-spacing: 1.5px;
                                border-radius: 20px;
                                padding: 13px 25px 11px;
                                cursor: pointer;
                                margin: 0 0;
                            }

                            .back {
                                margin-top: 16px;
                                border: solid 1px #1a38f8;
                                color: #1a38f8;
                            }

                            .confirm {
                                color: white;
                                background: #1a38f8;

                                &:hover {
                                    &:not(.disabled) {
                                        background-color: #7eb5ff;
                                    }
                                }

                                &.disabled {
                                    opacity: 0.1;
                                    cursor: not-allowed;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
