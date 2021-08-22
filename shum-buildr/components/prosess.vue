<template>
   <div>
      <div class="c_chart" ref="progressChartRef"></div>

   </div>
</template>
<script>
   import echarts from "echarts";

   export default {
      name: 'prosess',
      props: {
         chartData1: {
            type: Object
         },
         chartData2: {
            type: Object
         },
         chartData3: {
            type: Object
         },
      },
      data() {
         return {
            chart: null,
         };
      },
      computed: {
         queryChartData() {
            debugger
            return this.chartData1;
         },

      },
      mounted() {
         this.initChart();
      },
      methods: {
         initChart() {
            // 基于准备好的dom，初始化echarts
            this.chart = echarts.init(this.$refs.progressChartRef);
            let option = {
               grid: {
                  left: "0",
                  right: "0",
                  top: "0",
                  bottom: "0"
               },
               xAxis: {
                  type: "value",
                  show: false,
               },
               yAxis: [
                  {
                     inverse: true,
                     type: 'category',
                     splitLine: {//设置网格
                        show: false,
                     },
                     axisTick: {//设置刻度朝向
                        show: false,
                     },
                     axisLine: {//设置箭头
                        show: false,
                     },
                     data: [""], //数据点名称
                  },
               ],
               legend: {
                  orient: "horizontal",
                  x: "left",
                  show: true,
               },
               series: [
                  {
                     name: "38888888888",
                     type: "bar",
                     silent: true, //取消点击高亮
                     zlevel: 1,
                     itemStyle: {
                        normal: {
                           // color: "#A7B0FA",
                           barBordeRadius: 3
                        },
                     },
                     barWidth: 6,
                     data: [this.chartData1], //值
                  },
                  {
                     name: "2222222",
                     type: "bar",
                     silent: true, //取消点击高亮
                     zlevel: 1,
                     itemStyle: {
                        normal: {
                           // color: "#ED8D8B",
                           barBordeRadius: 3
                        },
                     },
                     barWidth: 6,
                     data: [this.chartData2], //值
                  },
                  {
                     name: "38888888",
                     type: "bar",
                     silent: true, //取消点击高亮
                     zlevel: 1,
                     itemStyle: {
                        normal: {
                           // color: "#9DCB79",
                           barBordeRadius:3
                        },
                     },
                     barWidth: 6,
                     data: [this.chartData3], //值
                  }
               ],
            };
            this.chart.setOption(option);
         },
      },
      beforeDestroy() {
         if (this.chart) {
            this.chart.clear();
            this.chart.dispose();
         }
      },
   };
</script>
<style lang="scss" scoped>
   .c_chart {
      margin-top: 50px;
      padding: 50px 0;
   }
</style>

