<template>
  <div
    class="c_chart"
    ref="progressChartRef"
  ></div>
</template>

<script lang='js'>
import echarts from "echarts";

export default {
   name: 'Prosess',
   props: {
      chartData: {
         type: Object
      }
   },
   data: function() {
      return {
         chart: null,
      };
   },
   computed: {
      barObj: function() {
         return this.chartData &&
            this.chartData.barObj;
      },
      barData: function() {
         const num = this.barObj &&
            this.barObj.barData && 
            this.barObj.barData[0] || 0;
         return Number(num) || 0;
      },
      barWidth: function() {
         return this.barObj &&
            this.barObj.barWidth || 10;
      },
      color: function() {
         return this.barObj &&
            this.barObj.color || '#ED8D8B';
      },
   },
   mounted() {
      this.initChart();
   },
   beforeDestroy() {
      if (this.chart) {
         this.chart.clear();
         this.chart.dispose();
      }
   },
   methods: {
      initChart() {
         const color = "#eee";
         this.chart = echarts.init(this.$refs.progressChartRef);
         const option = {
            grid: {
               top: 0,
               bottom: 0,
               left: 0,
               right: 0,
            },
            color: [this.color, color],
            xAxis: {
               show: false,
               type: "value",
               boundaryGap: [0, 0],
            },
            yAxis: [
               {
                  type: "category",
                  data: [""],
                  axisLine: { show: false },
                  axisTick: [
                     {
                     show: false,
                     },
                  ],
               },
            ],
            series: [
               {
                  type: "bar",
                  name: "已完成",
                  stack: "总量",
                  barMaxWidth: 20,
                  itemStyle: {
                     barBorderRadius: [10, 10, 10, 10],
                  },
                  data: [this.barData],
               },
               {
                  type: "bar",
                  name: "未完成",
                  stack: "总量",
                  barMaxWidth: 20,
                  showBackground: true,
                  backgroundStyle: {
                     color: color,
                     barBorderRadius: [10, 10, 10, 10],
                  },
                  itemStyle: {
                     color: color,
                     barBorderRadius: [0, 10, 10, 0],
                  },
                  silent: true,
                  data: [100 - this.barData],
               },
            ],
         };
         this.chart.setOption(option);
      },
   }
};

</script>

<style lang='less' scoped></style>
