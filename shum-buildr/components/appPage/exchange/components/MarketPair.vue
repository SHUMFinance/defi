<template>
  <div class="market-pair">
    <Spin fix v-if="loading"></Spin>
    <div class="title">MARKET PAIR</div>
    <div class="name">
      <!-- <img src="@/static/appPage/round.png" alt=""/> -->
      <img v-if="currencyId" :src="currencies[`s${currencyId}`].icon" />
      <span style="font-size: 24px; color: #acb1c7">
        <span class="iconfont icon-s" style="font-size: 18px" />{{
          currencyId
        }}
        <span class="iconfont icon-s" style="font-size: 18px" />USD
      </span>
      <img src="@/static/appPage/star.png" alt="" />
    </div>
    <div class="info">
      <div class="item">
        <span>${{ formatNumber("highPrice") }}</span>
        <span>24H High</span>
      </div>
      <div class="item">
        <span>${{ formatNumber("lowPrice") }}</span>
        <span>24H Low</span>
      </div>
      <div class="item">
        <span>${{ formatNumber("volume") }}</span>
        <span>24H Volume</span>
      </div>
      <div class="item">
        <span>
          <template v-if="formatNumber('priceChangePercent') > 0">
            <img src="@/static/appPage/up.png" alt="" />
            <span style="color: #108c1c"
              >{{ formatNumber("priceChangePercent") }}%</span
            >
          </template>
          <template v-else>
            <img src="@/static/appPage/down.png" alt="" />
            <span style="color: #da3620"
              >{{ formatNumber("priceChangePercent") }}%</span
            >
          </template>
        </span>
        <span>% Changes</span>
      </div>
      <div class="price">${{ formatNumber("lastPrice") }}</div>
    </div>
    <div class="chart">
      <div class="draw-tool">
        <div>
          <img src="@/static/appPage/chart/1_off.svg" alt="" />
          <img src="@/static/appPage/chart/2.svg" alt="" />
          <img src="@/static/appPage/chart/3.svg" alt="" />
          <img src="@/static/appPage/chart/4.svg" alt="" />
          <img src="@/static/appPage/chart/5.svg" alt="" />
          <img src="@/static/appPage/chart/6.svg" alt="" />
          <img src="@/static/appPage/chart/7.svg" alt="" />
          <img src="@/static/appPage/chart/8.svg" alt="" />
        </div>
        <div>
          <img src="@/static/appPage/chart/9.svg" alt="" />
          <img src="@/static/appPage/chart/10.svg" alt="" />
        </div>
      </div>
      <div>
        <div class="chart-container" id="chart"></div>
        <div class="time-tool">
          <div class="time-range">
            <span  v-for="item in options" :key="item.value" :class="{active : current === item.value}" @click="select(item.value)">{{item.label}}</span>
            <!-- <span>All</span> -->
          </div>
          <div class="series-control">
            <span class="date"> 18:17:05（UTC+8） </span>
            <span>%</span>
            <span>log</span>
            <span style="color: #4b72f0">auto</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import currencies from "@/common/currency";
import { formatNumber } from "@/assets/linearLibrary/linearTools/format";
import echarts from "echarts";
import api from "@/api";

import moment from 'moment';

const options = [
  { value: 'days', label: 'Day' },
  { value: 'weeks', label: 'Week' },
  { value: 'months', label: 'Month' },
  { value: 'years', label: 'Year' },
]

export default {
  name: "MarketPair",
  props: {
    currencyId: String,
    loading: Boolean,
    currency: Object,
  },
  data: function () {
    return {
      currencies,
      kData: [],
      options,
      current: options[0].value
    };
  },
  watch: {
    currency: {
      handler: function() {
        this.select(this.current);
      },
      immediate: true
    }
  },
  methods: {
    select(val) {
      this.current = val;
      if (!this.currency) {
        return;
      }
      let start, end, interval, format;
      switch (this.current) {
        case options[0].value:
          start = moment().startOf('day').valueOf(); //获取当天零点的时间
          end = moment().endOf('day').valueOf(); //获取当天23:59:59的时间
          interval = '1h';
          format = 'hA';
          break;
        case options[1].value:
          start = moment().startOf('week').valueOf(); 
          end = moment().endOf('week').valueOf();
          interval = '1h';
          format = 'ddd, hA';
          break;
        case options[2].value:
          start = moment().startOf('month').valueOf(); 
          end = moment().endOf('month').valueOf();
          interval = '1d';
          format = 'MM/DD';
          break;
        case options[3].value:
          start = moment().startOf('year').valueOf(); 
          end = moment().endOf('year').valueOf();
          interval = '1d';
          format = 'MM/DD';
          break;
        default:
          break;
      }
      this.getKData(start, end, interval)
        .then(res => {
          this.kData = res
          this.lineChart(format);
        })

    },
    getKData(start, end, interval) {
    
      const { symbol } = this.currency;
      return api.getklines(symbol, start, end, interval)
    },

    getHour: function (date) {
      const hour = new Date(date).getHours(); // ? getUTCHours()
      return this.time[hour];
    },

    formatNumber: function (attr) {
      if (!this.currency) {
        return 0;
      }
      return formatNumber(this.currency[attr], 4);
    },
    lineChart(format) {
      // [todo: 获取当前币种实际24hr 数据]
      // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
      // const data = splitData(this.kData);

      const upColor = "#ec0000";
      const upBorderColor = "#8A0000";
      const downColor = "#00da3c";
      const downBorderColor = "#008F28";

      const time = [];
      const data = [];
      this.kData.forEach(v => {
        time.push(v[0]);
        data.push([v[1], v[4], v[3], v[2]]);
      })

      this.myChart = echarts.init(document.getElementById("chart"));
      this.myChart.setOption({
        // title: {
        //   text: "1.8478",
        //   left: 0,
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          // formatter: function (params, ticket, callback) {
          //     console.log('1111111111111', params, ticket, callback)
          //     return 'Loading';
          // }

        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter',
          },
        ],
        xAxis: {
          type: "category",
          data: time,
          scale: false,
          boundaryGap: false,
          boundaryGap: false,
          min: 'dataMin',
          max: 'dataMax',
          axisLabel: {
            formatter: function (value) {
              return moment(Number(value)).format(format);        
            }
          }
        },
        yAxis: {
          scale: true,
          position: "right",
          axisLine: { show: false },
          minorTick: { show: false },
          axisTick: { show: false },
          minorSplitLine: { show: false },
          splitArea: {
            show: false,
          },
        },
        series: [
          {
            name: `${this.currencyId}`,
            type: "candlestick",
            data: data,
            // dimensions: ['date', 'open', 'highest', 'lowest', 'close'],
            itemStyle: {
              width: 2,
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor,
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.market-pair {
  position: relative;
  .title {
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
  }
  .name {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    img:first-child {
      margin-right: 16px;
      width: 32px;
      height: 32px;
    }

    img:last-child {
      margin-left: 6px;
      width: 14px;
      height: 14px;
    }
  }

  .info {
    margin-bottom: 24px;

    .item {
      display: inline-flex;
      flex-direction: column;
      margin-right: 8px;
      padding: 2px 14px;
      height: 40px;

      color: #4f4d51;
      letter-spacing: 0px;
      text-align: left;

      border: 1px solid #d5dceb;
      box-sizing: border-box;
      border-radius: 8px;
    }

    .price {
      float: right;
      font-family: Avenir Next;
      font-size: 24px;
      font-weight: 700;
      line-height: 32px;
      letter-spacing: 0;
      text-align: right;
    }
  }

  .chart {
    display: flex;
    box-sizing: border-box;
    margin-bottom: 24px;
    height: 344px;
    background: #ffffff;
    border: 1px solid #e0e5f0;

    .draw-tool {
      padding: 0 10px;
      width: 48px;
      border-right: 1px solid #e0e5f0;

      > div:first-child {
        height: 265px;
        border-bottom: 1px solid #e0e5f0;
      }

      > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
      }
    }

    > div:last-child {
      flex: 1;
    }

    .chart-container {
      box-sizing: border-box;
      height: 300px;
      border-bottom: 1px solid #e0e5f0;
    }

    .time-tool {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px 0 24px;
      height: 45px;

      .time-range {
        font-size: 14px;
        font-weight: 700;
        line-height: 32px;
        letter-spacing: 0.004em;
        text-align: center;

        span {
          display: inline-block;
          margin-right: 16px;
          cursor: pointer;
        }
        .active {
          color: #4b72f0
        }
      }

      .series-control {
        font-family: Avenir Next;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px;
        letter-spacing: 0.07em;
        text-align: left;

        span {
          display: inline-block;
          margin-left: 8px;
        }

        > span:first-child {
          padding-right: 8px;
          border-right: 1px solid #e0e5f0;
        }
      }
    }
  }
}
</style>
