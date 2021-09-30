<template>
  <div class="market">
    <div class="title">MARKET</div>
    <div class="handler">
      <Select v-model="listValue">
        <Option v-for="item in options" :value="item.value" :key="item.value"
          >{{ item.label }}
        </Option>
      </Select>
      <Input v-model.trim="currency" placeholder="SEARCH" prefix="md-search" />
    </div>
    <div class="customTable">
      <div class="tabelHeader">
        <div class="th sort pair">
          <img src="@/static/appPage/sort.png" alt="" />Pair
        </div>
        <div class="th sort price">
          <img src="@/static/appPage/sort.png" alt="" />Price
        </div>
        <div class="th sort change">
          <img src="@/static/appPage/sort.png" alt="" />Change
        </div>
        <div class="th star">
          <img src="@/static/appPage/star.png" alt="" />
        </div>
      </div>
      <div class="hasData">
        <div class="tableBody" v-if="currentList.length">
          <div
            v-for="(item, i) in currentList"
            :class="['tr', item.active && 'active']"
            :key="i"
            @mouseover="item.active = true"
            @mouseout="item.active = false"
            @click="changeCurrency(item.id)"
          >
            <div class="td pair">
              <img v-if="value === item.id || item.active" :src="currencies[item.name].icon" />
              <img v-else :src="currencies[item.name].icon_inactive" />
              <span class="iconfont icon-s">{{ item.id }}</span>
              <span
                class="iconfont icon-s"
                style="color: #acb1c7; margin-left: 4px"
                >USD</span
              >
            </div>
            <div class="td price">${{ item.price }}</div>
            <div class="td change">
              <template v-if="item.change > 0">
                <img src="@/static/appPage/up.png" alt="" />
                <span style="color: #108c1c">{{ item.change }}%</span>
              </template>
              <template v-else>
                <img src="@/static/appPage/down.png" alt="" />
                <span style="color: #da3620">{{ item.change }}%</span>
              </template>
            </div>
            <div class="td star">
              <img v-if="item.like" src="@/static/appPage/star.png" alt="" />
              <img v-else src="@/static/appPage/star1.png" alt="" />
            </div>
          </div>
        </div>
        <div v-else class="notData">
            No Data
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import currencies from "@/common/currency";

export default {
  name: "Market",
  props: {
    value: String,
    list: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {
      currencies,
      currency: undefined,
      listValue: 0,
      // [todo: 需要获取实际的类型分类 这是模拟数据]
      listOptions: [
        { label: "All", value: 0 },
        { label: "Crypto", value: 1 },
        { label: "Commodities", value: 2 },
        { label: "Currencies", value: 3 },
        { label: "Indices", value: 4 },
      ],
    };
  },
  computed: {
    currentList: function () {
      return this.list
        .filter((v) => {
          if (this.listValue === 0) {
            return true;
          }
          return v.value === this.listValue;
        })
        .filter((v) => (this.currency ? v.id.includes(this.currency.toLocaleUpperCase()) : true));
    },
    options: function () {
      return this.listOptions.map((option) => {
        if (option.value === 0) {
          return {
            ...option,
            label: `${option.label}  (${this.list.length})`,
          };
        } else {
          return {
            ...option,
            label: `${option.label}  (${
              this.list.filter((v) => option.value === v.value).length
            })`,
          };
        }
      });
    },
  },
  methods: {
    changeCurrency: async function (id) {
      this.$emit('input', id);
      // const c = this.list.find((v) => v.id == id);
      // const res = await api.getTickerPrice(`${id}USDT`);
      // console.log("res...........", res);
    },
  },
};
</script>

<style lang='scss' scoped>
.market {
  padding: 5px 10px 14px 24px;
  width: 369px;
  border-right: 1px solid #e0e5f0;

  .title {
    margin-left: 8px;
    margin-bottom: 16px;
  }
  .title {
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
  }

  .handler {
    display: flex;
    padding: 0 12px;

    .ivu-select-selection span,
    .ivu-select-dropdown-list .ivu-select-item {
      font-family: Gilroy-Bold;
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: 1.25px;
      color: #99999a;
    }

    .ivu-input-wrapper {
      margin-left: 10px;
    }
  }

  .customTable {
    .td,
    .th {
      flex: 1;
      display: flex;
      align-items: center;
      word-break: keep-all;
    }

    .sort img {
      margin-right: 4px;
    }

    .tableBody {
      padding-right: 10px;
      height: 568px;
    }
    .th.pair,
    .td.pair {
      flex: unset;
      display: flex;
      align-items: center;
      width: 120px;
      word-break: keep-all;
    }

    .td.pair > img {
      margin-right: 8px;
      width: 24px;
      height: 24px;
    }

    // .price {
    // 	padding: 0 4px;
    // }
    // .change {
    // 	flex: 1;
    // 	padding: 0 4px;
    // }
    .th.star,
    .td.star {
      flex: unset;
      width: 30px;
    }
  }

  .customTable {
    color: #343b55;

    .tabelHeader {
      display: flex;
      height: 40px;
      padding: 0 16px;
      padding-right: 15px + 16px;

      .th {
        display: flex;
        align-items: center;
        color: #acb1c7;
      }
    }

    .hasData {
      .tableBody {
        overflow: auto;
        padding: 2px 12px;

        .tr {
          display: flex;
          align-items: center;
          padding: 0 16px;
          margin-bottom: 8px;
          height: 40px;
          cursor: default;
          background: #f9faff;
          border-radius: 8px;
          &:hover {
          	box-shadow: 0 2px 12px 0 #deddde;
          	border-color: #fff;
          }
          .td {
            word-break: keep-all !important;
          }
        }
      }
    }

    .notData {
      min-height: 48px;
      text-align: center;
      font-family: Gilroy;
      font-size: 14px;
      line-height: 48px;
      color: #c1c1c1;
    }
  }
}
</style>
