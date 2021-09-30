<template>
  <div class="trade-order">
    <div class="title">TRADE ORDER</div>
    <div class="customTable">
      <div class="tabelHeader">
        <div class="th sort time">
          <img src="@/static/appPage/sort.png" alt="" />Date/Time
        </div>
        <div class="th sort pair">
          <img src="@/static/appPage/sort.png" alt="" />Pair
        </div>
        <div class="th sort buying">
          <img src="@/static/appPage/sort.png" alt="" />Buying
        </div>
        <div class="th sort selling">
          <img src="@/static/appPage/sort.png" alt="" />Selling
        </div>
        <div class="th sort free">
          <img src="@/static/appPage/sort.png" alt="" />Free
        </div>
        <div class="th sort s">
          <img src="@/static/appPage/sort.png" alt="" /> S
        </div>
      </div>
      <div class="hasData">
        <div class="tableBody" v-if="list.length">
          <div class="tr" v-for="(item, key) in list" :key="key">
            <div class="td time">{{item.time}}</div>
            <div class="td pair">
              <span style="font-size: 14px; color: #acb1c7">
                {{item.currency}}
                <span class="iconfont icon-s" style="font-size: 10px"></span>USD
              </span>
            </div>
            <div class="td buying">${{item.buying}}</div>
            <div class="td selling">${{item.selling}}</div>
            <div class="td free">${{item.free}}</div>
            <div class="td s">
                <img v-if="item.s > 0" src="@/static/appPage/up.png" alt="" />
                <img v-else src="@/static/appPage/down.png" alt="" />
                <span :style="`color: #${item.s > 0 ? '108c1c' : 'da3620'}`">{{item.s}}%</span>
            </div>
          </div>
        </div>
        <div v-else class="notData">
            No Data
        </div>
         <!-- <div class="tableBody " v-else>
           <div class="tr">
              <div class="td time">No Trade History</div>
              <div class="td pair">
                Once you place the orders, they will be displayed here. Live orders can be edited or cancelled.
              </div>
           </div>
         </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TradeOrder",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data: function () {
    return {};
  },
};
</script>

<style lang='scss' scoped>
.trade-order {
  .title {
    margin-left: 3px;
    margin-bottom: 16px;
  }
  .title {
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
  }

  .customTable {
    margin-left: 10px;
    white-space: nowrap;
    .tableBody {
      height: 95px;
    }

    .tabelHeader,
    .tableBody .tr {
      padding: 0 14px;
    }

    .tabelHeader .s {
      display: inline-flex;
      justify-content: center;
    }

    .time {
      width: 129px;
    }

    .pair {
      width: 131px;
    }

    .buying,
    .selling,
    .free {
      flex: 1;
    }

    .s {
      width: 71px;
      text-align: center;
    }
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
</style>
