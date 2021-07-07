<template>
    <v-chart
        :options="option"
        :manualUpdate="manualUpdate"
        :autoresize="autoResize"
        ref="chart"
    />
</template>

<style>
.echarts {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>

<script>
/**
 * 展示折线数据图
 * 按需引入echarts组件
 */
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import _ from "lodash";

export default {
    props: {
        data: {
            //数据
            type: Array,
            default: []
        },
        color: {
            //自定义颜色
            type: Object
        },
        area: {
            //开启区域
            type: Boolean,
            default: false
        },
        tooltip: {
            //是否显示提示组件
            type: Boolean,
            default: false
        },
        animation: {
            //是否显示动画
            type: Boolean,
            default: true
        },
        smooth: {
            //平滑折线
            type: Boolean,
            default: false
        },
        formatter: {
            //tooltip显示内容格式化
            type: String,
            default: "{c0}"
        },
        manualUpdate: {
            //是否手动更新data,否则需手动调用updateData
            type: Boolean,
            default: false
        },
        autoResize: {
            //是否自动更新大小,否则需手动调用resize
            type: Boolean,
            default: true
        }
    },
    watch: {
        //监视data变动
        data(newData) {
            //非手动
            if (!this.manualUpdate) {
                this.updateData(newData);
            }
        }
    },
    methods: {
        //更新数据
        updateData(newData) {
            this.$refs.chart.mergeOptions({
                xAxis: { data: newData },
                series: { data: newData }
            });
        },

        //显示加载
        showLoading() {
            this.$refs.chart.showLoading();
        },

        //隐藏加载
        hideLoading() {
            this.$refs.chart.hideLoading();
        },

        //重新更新大小
        resize() {
            this.$refs.chart.resize();
        },

        //重新渲染组件
        refresh() {
            this.$refs.chart.refresh();
        },

        //清空
        clear() {
            this.$refs.chart.clear();
        },

        //销毁
        dispose() {
            this.$refs.chart.dispose();
        }
    },
    data() {
        /**
         *  初始化颜色配置
         *  不在props里面验证是因为data更新时会重新调用验证方法,导致重复赋值
         */
        let innerColor = {};

        innerColor.lineColor = _.has(this.color, "lineColor")
            ? this.color.lineColor
            : "#11BA97";

        innerColor.backgroundColor = _.has(this.color, "backgroundColor")
            ? this.color.backgroundColor
            : "#FFFFFF";

        innerColor.areaColorTop = _.has(this.color, "areaColorTop")
            ? this.color.areaColorTop
            : "#C7EFE7";

        innerColor.areaColorBottom = _.has(this.color, "areaColorBottom")
            ? this.color.areaColorBottom
            : "#FFFFFF";

        innerColor.tooltipLineColor = _.has(this.color, "tooltipLineColor")
            ? this.color.tooltipLineColor
            : innerColor.lineColor;

        /* 初始化颜色配置 */
        return {
            option: {
                animation: this.animation, //动画
                animationDurationUpdate: false, //数据更新时动画(线性动态数据需关闭)
                backgroundColor: innerColor.backgroundColor, //背景色
                grid: {
                    //边距
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                },
                xAxis: {
                    type: "category",
                    show: false, //不显示横坐标栏
                    data: this.data //横坐标数据,用于显示tooltip
                },
                yAxis: {
                    type: "value",
                    show: false //不显示竖坐标栏
                },
                tooltip: {
                    show: this.tooltip, //是否显示
                    trigger: "axis",
                    formatter: this.formatter, //输入内容
                    confine: true, //不显示在图标外
                    axisPointer: {
                        animation: this.animation, //关闭动画
                        lineStyle: {
                            color: innerColor.tooltipLineColor //竖线颜色
                        }
                    }
                },
                series: [
                    {
                        data: this.data, //数据
                        type: "line", //图表类型
                        areaStyle: this.area
                            ? {
                                  //线内区域样式
                                  color: {
                                      //从上往下过渡色
                                      type: "linear",
                                      x: 0,
                                      y: 0,
                                      x2: 0,
                                      y2: 1,
                                      colorStops: [
                                          {
                                              offset: 0,
                                              color: innerColor.areaColorTop // 0% 处的颜色
                                          },
                                          {
                                              offset: 1,
                                              color: innerColor.areaColorBottom // 100% 处的颜色
                                          }
                                      ]
                                  }
                              }
                            : null,
                        smooth: this.smooth, //平滑曲线
                        lineStyle: {
                            //折线颜色
                            color: innerColor.lineColor
                        },
                        showSymbol: false, //不显示拐点
                        symbol: "circle", //拐点样式,实心
                        symbolSize: 6, //拐点大小
                        itemStyle: {
                            color: innerColor.lineColor, //拐点颜色
                            borderColor: "#FFF", //边框颜色
                            borderWidth: 2, //边框宽度
                            emphasis: {
                                color: innerColor.lineColor //hover时拐点颜色
                            }
                        }

                        // hoverAnimation: this.animation //hover动画
                    }
                ]
            }
        };
    }
};
</script>
