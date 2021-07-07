<template>
    <div
        id="notification"
        :class="{
            normal: status == 0,
            success: status == 1,
            error: status == 2
        }"
    >
        <div class="statusIcon">
            <div class="icon">
                <img
                    v-if="status == 0"
                    class="loading"
                    src="@/static/transferProgress/loading.svg"
                />
                <img
                    v-if="status == 1"
                    src="@/static/transferProgress/completed.svg"
                />
                <img
                    v-if="status == 2"
                    src="@/static/transferProgress/failed.svg"
                />
            </div>
        </div>
        <div class="text" v>
            <div class="title">
                {{ handleTypeName }}
                <template v-if="status == 1">Completed</template
                ><template v-if="status == 2">Failed</template>
            </div>
            <div class="description">
                <span class="info">{{ value }} &nbsp;</span>
                <span class="view" @click="openBlockchainBrowser(hash,networkId)">view</span>
            </div>
        </div>
        <div class="btns">
            <Icon type="ios-close" @click="close" />
        </div>

        <div
            class="loadingBar"
            :class="{ error: status == 2 }"
            :style="{ width: sliderPercent + '%' }"
        ></div>
    </div>
</template>

<script>
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { openBlockchainBrowser } from "@/common/utils";
import { BUILD_PROCESS_SETUP } from '@/assets/linearLibrary/linearTools/constants/process';

export default {
    name: "notification",
    data() {
        return {
            status: 0, //0执行中,1执行完成,2执行失败
            openBlockchainBrowser,
            stepRegex: /[\s]*[0-9]{1,}[\s]*\/[\s]*[0-9]{1,}[\s]*/i, //获取进度正则(允许数字前后有空格),例:1/5
            sliderPercent: 100 //当前进度百分比
        };
    },
    props: {
        // 交易hash, 操作类型, 当前步骤提示和单位
        hash: "",
        type: "",
        value: "",
        networkId:"",
        unit: "" //测试用,无用时删除
    },
    watch: {
        handleTypeName() {}
    },
    computed: {
        //处理操作名
        handleTypeName() {
            let typeName = this.type;
            if (typeName == BUILD_PROCESS_SETUP.CLAIM) {
                return "Claim";
            }

            if ([1, 2].includes(this.status)) {
                //去掉开头的Confirm
                typeName = typeName.replace(/^Confirm/i, "");
            }
            return typeName;
        }
    },
    created() {
        this.onListen();
    },
    methods: {
        async onListen() {
            try {
                //计算当前步骤进度条百分数
                const step = this.value.match(this.stepRegex);
                if (step && step.length == 1) {
                    this.sliderPercent = eval(step[0]) * 100;
                    this.sliderPercent < 0 && (this.sliderPercent = 100);
                }

                // this.status = this.unit; //测试用,无用时删除
                const status = await lnrJSConnector.utils.waitForTransaction(
                    this.hash
                );

                if (status === null) {
                    this.status = 0;
                } else if (status) {
                    this.status = 1;
                } else {
                    this.status = 2;
                }
            } catch (error) {
                this.status = 2;
            }
        },
        async close() {
            this.$emit("closeNotification", this.hash);
        }
    }
};
</script>

<style lang="scss">
#notification {
    width: 100%;
    min-height: 64px;
    box-shadow: 0 2px 6px 0 #deddde;
    border-radius: 4px;
    display: flex;
    background: #fff;
    padding: 14px 16px;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    position: relative;
    overflow: hidden;

    .statusIcon {
        margin-right: 8px;
        .icon {
            img {
                width: 32px;
                height: 32px;
                
            }

            .loading {
                animation: rotate 3s linear infinite;
            }
        }
    }
    .text {
        flex: 1;

        .title {
            font-family: Gilroy-Bold;
            font-size: 12px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #5a575c;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 280px;
        }
        .description {
            display: flex;
            align-items: center;
            .info {
                font-family: Gilroy-Medium;
                font-size: 12px;
                font-weight: 500;
                line-height: 16px;
                color: #99999a;
                max-width: 248px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .view {
                font-family: Gilroy-Bold;
                font-size: 10px;
                font-weight: bold;
                line-height: 16px;
                letter-spacing: 1.25px;
                color: #1a38f8;
                transition: $animete-time linear;
                cursor: pointer;

                &:hover {
                    color: #7eb5ff;
                }
            }
        }
    }
    .btns {
        width: 20px;
        i {
            color: #deddde;
            font-size: 30px;
            cursor: pointer;
            transition: $animete-time linear;
            &:hover {
                color: #1a38f8;
            }
        }
    }

    .loadingBar {
        height: 6px;
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: #1a38f8;
        overflow: hidden;

        &.error {
            background-color: #df434c;
        }
    }
}
</style>
