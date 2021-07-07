<template>
    <div id="demo" :class="theme">
        <areachart
            :data="data"
            area
            tooltip
            ref="chart1"
            manualUpdate
            :autoResize="false"
        ></areachart>

        <areachart
            :data="data2"
            tooltip
            area
            :color="{ lineColor: '#0ff00f', areaColorTop: '#00f00f' }"
            formatter="USDT : {a0}-{b0}-{c0}"
        ></areachart>

        <div>主题:<themeSwitch></themeSwitch></div>
        <div>多语言:<language></language></div>

        <div v-for="(item, index) in $t('home.tabMenu')" :key="index">
            多语言:{{ item }}
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import areachart from "@/components/echarts/areachart";
import style from "@/assets/css/global.scss";
import themeSwitch from "@/components/themeSwitch";
import language from "@/components/languageDropdown";

export default {
    name: "demo",
    components: { areachart, themeSwitch, language },
    data() {
        return {
            data: [],
            data2: [],
            timeId: 0,
            style
        };
    },
    created() {
        this.randomData();
        this.timeId = setInterval(this.dynamicData, 1000);
    },
    watch: {
        theme() {}
    },
    computed: {
        theme() {
            return this.$store.state.theme;
        }
    },
    methods: {
        randomData() {
            let arr = [];
            _.times(100, index => {
                arr.push(_.random(500, 1100));
            });
            this.data = arr;
            this.data2 = _.shuffle(this.data);
        },

        dynamicData() {
            this.data.shift();
            this.data.push(_.random(500, 1100));

            //手动刷新
            this.$refs.chart1.updateData(this.data);
            // this.$refs.chart1.showLoading();

            this.data2.shift();
            this.data2.push(_.random(500, 1100));
        }
    },
    destroyed() {
        clearInterval(this.timeId);
    }
};
</script>

<style lang="scss">
#demo {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
    padding: 50px;

    .ivu-col {
        height: 200px;
        position: relative;
    }

    &.ligt {
        background-color: $lightBackgroundColor;
    }

    &.dark {
        background-color: $darkBackgroundColor;
    }
}
</style>
