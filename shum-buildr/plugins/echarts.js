import Vue from "vue";
import ECharts from "vue-echarts"; // 在 webpack 环境下指向 components/ECharts.vue

//组件内仍需手动引入需要的ECharts模块,不全局引入减少体积

// 注册组件后即可使用
Vue.component("v-chart", ECharts);
