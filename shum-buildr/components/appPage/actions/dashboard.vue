<template>
   <div id="dashboard">
      <div class="topPage">
         <div class="staking">
            <div class="title">STAKING</div>
            <div class="cont">
               <div id="chartPie" class="pie-wrap"></div>
               <div class="datatotal">
                  <div class="one">
                     <img src="@/static/newPage/shum466a.svg" alt="">
                     <p>
                        <span>SHUM staked</span><br>
                        <span>56%</span>
                     </p>
                  </div>
                  <div class="two">
                     <img src="@/static/newPage/ratio466c.svg" alt="">
                     <p>
                        <span>Foundation</span><br>
                        <span>44%</span>
                     </p>
                  </div>
                  <div class="btn" @click="buildBtn">GO TO BUILD</div>
               </div>
            </div>
         </div>
         <div class="shum">
            <div class="tit">SHUM & sUSD APY</div>
            <div class="shumcont">
               <div class="shumleft">
                  <p><img src="@/static/newPage/shum466a.svg" alt="">
                     SHUM
                  </p>
                  <h1>{{ this.chartData1.value}}
                     <span>Average</span>
                  </h1>
                  <prosess :chartData="chartData1" style="width:136px;height:6px;padding:0 20px;"></prosess>
                  <div class="total">
                     <span>0 SHUM</span><br>
                     <span>Weekly Reward</span>
                  </div>
               </div>
               <div class="shumright">
                  <p><img src="@/static/newPage/usd466b.svg" alt="">
                     sUSD
                  </p>
                  <h1>{{ this.chartData2.value}}
                     <span>Est. APY</span>
                  </h1>
                  <prosess :chartData="chartData2" style="width:136px;height:6px;padding:0 20px;"></prosess>
                  <div class="total">
                     <span>0 sUSD </span><br>
                     <span>Weekly Reward</span>
                  </div>
               </div>
            </div>
         </div>
         <div class="rartio">
            <div class="tit">P Rartio</div>
            <div class="ratiocont">
               <p><img src="@/static/newPage/ratio466c.svg" alt="">
                  P Ratio
               </p>
               <h1>{{ this.chartData3.value}}
                  <span>Est. APY</span>
               </h1>
               <prosess :chartData="chartData3" style="width:136px;height:6px;padding:0 20px;"></prosess>
               <div class="total">
                  <span>500</span><br>
                  <span>Target</span>
               </div>
            </div>

         </div>
      </div>
      <div class="buttomPage">
         <div class="overview">
            <div class="toptit">
               <span class="timeone">24 Hours Overview</span>
               <span class="timetwo">{{nowTime}}</span>
            </div>
            <div class="topData">
               <div class="dataledt">
                  <div class="moneyleft">
                     <span class="numm">$6.28</span>
                     <span class="baif"><img src="" alt="">13%</span><br>
                     <p>SHUM Current Price</p>
                  </div>
                  <div class="moneyright">
                     <span>$11.36</span>
                     <p>Market Cap</p>
                  </div>
               </div>
               <div class="datacen">
                  <div class="up">
                     <img src="@/static/newPage/up.png" alt="">
                     <div class="updata">
                        <span>$13.98</span>
                        <p>24H High</p>
                     </div>
                  </div>
                  <div class="down">
                     <img src="@/static/newPage/down.png" alt="">
                     <div class="updata">
                        <span>$4.32</span>
                        <p>24H Low</p>
                     </div>
                  </div>
               </div>
               <div class="databtn" @click="toExchange">GO TO EXCHANGE</div>
            </div>
            <div class="echartimg">
               <div id="myChart" style="width:900px;height:202px;"></div>
            </div>
         </div>
         <div class="holder">
            <h1>SHUM Holder</h1>
            <p>Number of Holders</p>
         </div>
      </div>
   </div>
</template>

<script>
   import prosess from '@/components/prosess'
   import * as echarts from 'echarts';

   require('echarts/theme/macarons');//引入主题

   // vue文件中引入echarts工具
   require('echarts/lib/echarts')
   require('echarts/lib/chart/line')
   // 以下的组件按需引入
   require('echarts/lib/component/tooltip')   // tooltip组件
   require('echarts/lib/component/title')   //  title组件
   require('echarts/lib/component/legend')  // legend组件
   export default {
      name: "dashboard",
      components: {prosess},
      data() {
         return {
            chartPie: null,
            myChart: null,
            chartData1:
              {
                 name: "Est. APY",
                 value: "38%",
                 barObj: {
                    barData: ["38"],
                    color: "#A7B0FA",
                    barWidth: 10
                 }
              },
            chartData2:
              {
                 name: "Est. APY",
                 value: "22%",
                 barObj: {
                    barData: ["22"],
                    color: "#ED8D8B",
                    barWidth: 10
                 }
              },

            chartData3:
              {
                 name: "Average",
                 value: "38%",
                 barObj: {
                    barData: ["38"],
                    color: "#9DCB79",
                    barWidth: 10
                 }
              },

            nowTime: '2021 /8 /22',
         }
      },
      mounted() {
         this.$nextTick(() => {
            this.drawPieChart();
         });
         this.$nextTick(() => {
            this.lineChart();
         })
      },
      methods: {
         drawPieChart() {
            let mytextStyle = {
               color: "#0f0",
               fontSize: 28,
            };
            let innerStyle = {
               color: '#000',
               fontSize: 24,
               fontWeight: 400,
            };
            let innersubStyle = {
               color: '#000',
               fontSize: 11,
            };
            let mylabel = {
               show: false,
               position: "left",
               offset: [30, 40],
               formatter: '{b} : {c} ({d}%)',
               textStyle: mytextStyle
            };
            this.chartPie = echarts.init(document.getElementById('chartPie'), 'macarons');
            this.chartPie.setOption({
               title: {
                  text: '88',
                  subtext: 'Total SHUM Staking \n SHUM sTAKERS',
                  x: 'center',
                  y: 70,
                  textStyle: innerStyle,
                  subtextStyle: innersubStyle
               },
               tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)",
               },
               //类似于右侧效果
               // legend: {
               //    data: ['Foundation', 'SHUM staked'],
               //    left: "center",
               //    top: "center",
               //    orient: "horizontal",
               // },
               series: [
                  {
                     name: '',
                     type: 'pie',
                     radius: ['70%', '90%'],
                     center: ['50%', '50%'],
                     color: ['#AAE9A9', '#A7B0FA'],
                     data: [
                        {value: 44, name: 'Foundation'},
                        {value: 56, name: 'SHUM staked'}
                     ],
                     animationEasing: 'cubicInOut',
                     animationDuration: 1000,
                     label: {
                        emphasis: mylabel
                     },
                     itemStyle: {
                        borderRadius: 10,
                        borderColor: '#ddd',
                        borderWidth: 4
                     },
                     labelLine: {
                        normal: {
                           show: false
                        }
                     }
                  }
               ]
            });
         },
         lineChart() {
            this.myChart = echarts.init(document.getElementById('myChart'))
            this.myChart.setOption({
               xAxis: {
                  type: 'category',   // 还有其他的type，可以去官网喵两眼哦
                  data: ['10am', '12am', '2pm', '4pm', '6pm', '8pm', '10pm', '12pm', '2am', '4am', '6am', '8am', '10am'],   // x轴数据
                  axisLine: {
                     lineStyle: {
                        type: 'solid',
                        color: '#fff',//左边线的颜色
                        width: '2'//坐标线的宽度
                     }
                  },
                  axisLabel: {
                     textStyle: {
                        color: '#828999',//坐标值得具体的颜色

                     }
                  }
               },
               yAxis: {
                  type: 'value',
                  name: '',   // y轴名称
                  splitLine: {
                     show: true,
                     lineStyle: {
                        color: '#ddd',
                        width: 0.5,
                        type: 'solid',
                     }
                  },
                  axisLine: {
                     lineStyle: {
                        type: 'solid',
                        color: '#fff',//左边线的颜色
                        width: '50'//坐标线的宽度
                     }
                  },
                  axisLabel: {
                     textStyle: {
                        color: '#828999',//坐标值得具体的颜色

                     }
                  }
               }
               ,
               label: {}
               ,
               tooltip: {
                  trigger: 'axis'   // axis   item   none三个值
               }
               ,
               series: [{
                  name: 'High Price',
                  data: [5, 8, 6, 6.5, 5, 11.5, 5.2, 5.9, 13.98, 5.69, 8.12, 6.93],
                  type: 'line',
                  itemStyle: {
                     normal: {
                        color: '#A7B0FA',
                        lineStyle: {
                           color: '#A7B0FA',
                        }
                     }
                  },
                  areaStyle: {            // 折现下是否填充
                     color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                           offset: 0.5, color: 'rgba(75, 114, 240,0.1)' // 0% 处的颜色
                        }, {
                           offset: 1, color: 'rgba(75, 114, 240,.1)' // 100% 处的颜色
                        }],
                        global: true
                     }
                  },
               }]
            })
         },
         buildBtn() {
            this.$store.commit("setCurrentAction", 3);
            this.$router.push("/build");
         },
         toExchange() {
            this.$store.commit("setCurrentAction",2);
            this.$router.push("/exchange");
         }
      }
   }
</script>

<style lang="scss">
   #dashboard {
      height: 850px;
      box-shadow: none !important;
      border-radius: 0;

      .topPage {
         width: 1200px;
         height: 320px;
         display: flex;
         flex-direction: row;
         justify-content: space-between;

         .staking {
            background-color: #FFFFFF;
            display: flex;
            width: 520px;
            height: 320px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(227, 230, 237, 0.2);
            margin: 0 24px 24px 0;

            .title {
               position: relative;
               width: 54px;
               height: 24px;
               left: 24px;
               right: 32px;
               top: calc(50% - 24px / 2 - 124px);

               font-family: Arial;
               font-style: normal;
               font-weight: bold;
               font-size: 12px;
               line-height: 24px;
               display: flex;
               align-items: center;

               color: #4F4D51;
            }

            .cont {
               padding: 50px 20px 50px 0;
               margin-top: 20px;
               display: flex;
               flex-direction: row;

               #chartPie {
                  width: 200px;
                  height: 200px;
                  /*position: relative;*/
                  /*top: 12px;*/
                  /*left: 12px;*/
               }

               .datatotal {
                  margin: 50px 10px;

                  .one {
                     display: flex;
                     flex-direction: row;
                     margin-bottom: 10px;

                     img {
                        width: 20px;
                        height: 20px;
                        margin: 10px 10px;
                        color: #A7B0FA;
                     }
                  }

                  .two {
                     display: flex;
                     flex-direction: row;

                     img {
                        width: 20px;
                        height: 20px;
                        margin: 10px 10px;
                        color: #AAE9A9;
                     }

                  }

                  .btn {
                     width: 100px;
                     height: 34px;
                     display: flex;
                     flex-direction: row;
                     justify-content: center;
                     align-items: center;
                     padding: 10px;
                     margin: 10px;
                     font-family: Arial;
                     font-style: normal;
                     font-weight: bold;
                     font-size: 12px;
                     line-height: 24px;
                     color: #FFFFFF;
                     cursor: pointer;
                     background: #4B72F0;
                     border-radius: 8px;
                  }
               }
            }
         }

         .shum {
            background-color: #FFFFFF;
            display: flex;
            flex-direction: column;
            width: 448px;
            height: 320px;
            margin: 0 24px 24px 0;
            box-shadow: 0 4px 20px rgba(227, 230, 237, 0.2);
            border-radius: 16px;

            .tit {
               width: 114px;
               height: 24px;
               position: relative;
               left: 32px;
               top: 24px;
               font-family: Arial;
               font-style: normal;
               font-weight: bold;
               font-size: 12px;
               line-height: 24px;
               display: flex;
               align-items: center;
               color: #4F4D51;
            }

            .shumcont {
               display: flex;
               flex-direction: row;

               .shumleft, .shumright {
                  width: 170px;
                  height: 216px;
                  margin-right: 20px;
                  position: relative;
                  top: 45px;
                  left: 32px;
                  border-radius: 16px;
                  background: #FFFFFF;
                  border: 1px solid #E7EBF0;
                  box-sizing: border-box;

                  p {
                     margin: 24px 20px;

                     img {
                        margin-right: 10px;
                     }
                  }

                  h1 {
                     height: 24px;
                     font-family: Arial;
                     font-style: normal;
                     font-weight: bold;
                     font-size: 20px;
                     line-height: 24px;
                     margin-left: 24px;
                     display: flex;
                     align-items: center;
                     color: #4E5568;

                     span {
                        font-family: Arial;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 11px;
                        line-height: 24px;
                        margin-left: 10px;
                        display: flex;
                        align-items: center;

                        color: #828999;
                     }
                  }

                  .total {
                     position: absolute;
                     bottom: 36px;
                     left: 20px;

                  }
               }


            }

         }

         .rartio {
            background-color: #FFFFFF;
            display: flex;
            flex-direction: column;
            width: 248px;
            height: 320px;
            margin: 0 0 24px 0;
            box-shadow: 0 4px 20px rgba(227, 230, 237, 0.2);
            border-radius: 16px;

            .tit {
               width: 114px;
               height: 24px;
               position: relative;
               left: 32px;
               top: 24px;

               font-family: Arial;
               font-style: normal;
               font-weight: bold;
               font-size: 12px;
               line-height: 24px;
               display: flex;
               align-items: center;
               color: #4F4D51;
            }

            .ratiocont {
               width: 170px;
               height: 216px;
               margin-right: 20px;
               position: relative;
               top: 45px;
               left: 32px;
               border-radius: 16px;
               background: #FFFFFF;
               border: 1px solid #E7EBF0;
               box-sizing: border-box;

               p {
                  margin: 24px 20px;

                  img {
                     margin-right: 10px;
                  }
               }

               h1 {
                  height: 24px;
                  font-family: Arial;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 20px;
                  line-height: 24px;
                  margin-left: 24px;
                  display: flex;
                  align-items: center;
                  color: #4E5568;

                  span {
                     margin-left: 10px;

                     font-family: Arial;
                     font-style: normal;
                     font-weight: normal;
                     font-size: 11px;
                     line-height: 24px;

                     display: flex;
                     align-items: center;

                     color: #828999;
                  }
               }

               .total {
                  position: absolute;
                  bottom: 36px;
                  left: 20px;

               }
            }
         }
      }

      .buttomPage {
         display: flex;
         flex-direction: row;
         margin-top: 24px;

         .overview {
            width: 942px;
            height: 400px;
            background-color: #FFFFFF;
            margin: 0 24px 24px 0;
            border-radius: 16px;

            .toptit {
               height: 24px;
               margin: 24px 0 24px 32px;

               .timeone {
                  font-family: Arial;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 24px;
                  display: inline-block;
                  margin-right: 19px;
                  color: #4F4D51;
               }

               .timetwo {
                  font-family: Arial;
                  font-style: normal;
                  font-weight: normal;
                  font-size: 11px;
                  line-height: 24px;
                  display: inline-block;
                  color: #828999;

               }
            }

            .topData {
               display: flex;
               flex-direction: row;

               .dataledt {
                  width: 337px;
                  height: 88px;
                  margin: 16px 24px;
                  background: #FFFFFF;
                  border: 1px solid #E7EBF0;
                  box-sizing: border-box;
                  border-radius: 16px;
                  display: flex;
                  flex-direction: row;

                  .moneyleft {
                     margin: 16px 24px;

                     .numm {
                        font-family: Avenir Next;
                        font-style: normal;
                        font-weight: 600;
                        font-size: 24px;
                        line-height: 32px;
                        color: #1E1F26;
                     }

                     .baif {
                        display: inline-block;
                        width: 48px;
                        height: 18px;
                        background: #108C1C;
                        border-radius: 9px;
                        font-family: Arial;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 11px;
                        line-height: 18px;
                        text-align: center;
                        color: #FFFFFF;

                        img {
                           width: 0;
                           height: 0;
                           border-bottom: 5px solid #FFFFFF;
                           border-left: 5px solid transparent;
                           border-right: 5px solid transparent;
                        }
                     }

                     p {
                        font-family: Arial;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 11px;
                        line-height: 24px;

                        display: flex;
                        align-items: center;

                        color: #828999;
                     }
                  }

                  .moneyright {
                     margin: 16px 36px;

                     span {
                        font-family: Avenir Next;
                        font-style: normal;
                        font-weight: 600;
                        font-size: 16px;
                        line-height: 32px;

                        display: flex;
                        align-items: center;
                        text-align: right;

                        color: #1E1F26;
                     }

                     p {
                        font-family: Arial;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 11px;
                        line-height: 24px;

                        display: flex;
                        align-items: center;

                        color: #828999;
                     }

                  }
               }

               .datacen {
                  width: 312px;
                  height: 88px;
                  margin: 16px 24px 16px 0;
                  background: #FFFFFF;
                  border: 1px solid #E7EBF0;
                  box-sizing: border-box;
                  border-radius: 16px;
                  display: flex;
                  flex-direction: row;

                  .up, .down {
                     display: flex;
                     flex-direction: row;

                     img {
                        width: 21px;
                        height: 21px;
                        margin: 38px 20px 32px 40px;
                     }

                     .updata {
                        width: 57px;
                        height: 49px;
                        margin: 19px 0;

                        span {
                           font-family: Avenir Next;
                           font-style: normal;
                           font-weight: 600;
                           font-size: 16px;
                           line-height: 32px;

                           display: flex;
                           align-items: center;
                           text-align: right;

                           color: #1E1F26;
                        }

                        p {
                           font-family: Arial;
                           font-style: normal;
                           font-weight: normal;
                           font-size: 11px;
                           line-height: 24px;

                           display: flex;
                           align-items: center;

                           color: #828999;
                        }
                     }
                  }
               }

               .databtn {
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  padding: 10px 0;
                  margin: 41px 50px 16px;
                  width: 130px;
                  height: 34px;
                  cursor: pointer;
                  background: #4B72F0;
                  border-radius: 8px;
                  color: #FFFFFF;
                  font-family: Arial;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 24px;
               }
            }

            .echartimg {
               width: 900px;
               height: 202px;
               margin: 0 36px;
            }
         }

         .holder {
            width: 248px;
            height: 240px;
            background-color: #FFFFFF;
            border-radius: 16px;

            h1 {
               width: 77px;
               height: 24px;
               position: relative;
               top: 24px;
               left: 32px;
               font-family: Arial;
               font-style: normal;
               font-weight: bold;
               font-size: 12px;
               line-height: 24px;
               display: flex;
               align-items: center;
               color: #4F4D51;
            }

            p {
               width: 103px;
               height: 24px;
               position: relative;
               top: 36px;
               left: 32px;
               font-family: Arial;
               font-style: normal;
               font-weight: normal;
               font-size: 11px;
               line-height: 24px;
               display: flex;
               align-items: center;
               text-align: left;
               color: #828999;
            }
         }
      }
   }
</style>
