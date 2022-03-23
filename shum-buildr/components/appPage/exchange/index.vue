<template>
  <div class="exchange">
    <div class="mian box">
      <Market v-model="currencyId" :list="currencyList" />
      <div class="left-box">
        <MarketPair :currencyId="currencyId" :currency="currency" :loading="loading" />
        <TradeOrder :list="tradeOrderList"/>
      </div>
    </div>
    <div class="left-side">
      <WalletAndAddressBox />
      <div class="trade-asset box">
        <WalletBalance />
      </div>
      <div class="order box">
        <MarketOrder :currencyId="currencyId" :currency="currency" :loading="loading" @addOrder="addOrder"/>
      </div>
    </div>
  </div>
</template>

<script>
import Market from "./components/Market.vue";
import MarketPair from "./components/MarketPair.vue";
import WalletAndAddressBox from "./components/WalletAndAddressBox.vue";
import WalletBalance from "./components/WalletBalance.vue";
import MarketOrder from "./components/MarketOrder.vue";
import TradeOrder from "./components/TradeOrder.vue";

import {
  formatNumber,
  formatNumberFromBigNumber,
} from "@/assets/linearLibrary/linearTools/format";
import {
  bn2n,
  bnSub,
  bnSub2N,
  n2bn,
  numberStrToBN,
  bnDiv2N,
} from "@/common/bnCalc";
import api from "@/api";

import currencies from "@/common/currency";

const marketMock = {
  data: {
    pricesLasts: [
      // {
      //   currentPrice: "57113377456570000000000",
      //   id: "USD",
      //   name: "sUSD",
      //   lastPrice: "16421342587570000000000",
      //   type: "crypto",
      // },
      {
        currentPrice: "2801397150000000000",
        id: "ADA",
        name: "sADA",
        lastPrice: "2812025310000000000",
        type: "crypto",
      },
      {
        currentPrice: "463075423110000000000",
        id: "XLM",
        name: "sXLM",
        lastPrice: "473963879190000000000",
        type: "crypto"
      },
      // {
      //   currentPrice: "47435231433850000000000",
      //   id: "ETH",
      //   name: "sETH",
      //   lastPrice: "47891750000000000000000",
      //   value: 4,
      // },
      {
        currentPrice: "23107583740000000000",
        id: "UNI",
        name: "sUNI",
        lastPrice: "24344089970000000000",
        type: "crypto"
      },
      {
        currentPrice: "4542617121000000000",
        id: "BTC",
        name: "sBTC",
        lastPrice: "4363827774000000000",
        type: "crypto",
      },
      {
        currentPrice: "28211140110000000000",
        id: "EUR",
        name: "sEUR",
        lastPrice: "24833428640000000000",
        type: "currencies"
      },
      // {
      //   currentPrice: "3337217203700000000000",
      //   id: "CHF",
      //   name: "sCHF",
      //   lastPrice: "3185079305240000000000",
      //   value: 1,
      // },
      // {
      //   currentPrice: "1183505000000000000",
      //   id: "DASH",
      //   name: "sDASH",
      //   lastPrice: "1179790000000000000",
      //   value: 1,
      // },
      // {
      //   currentPrice: "9096500000000000",
      //   id: "DAX",
      //   name: "sDAX",
      //   lastPrice: "9101000000000000",
      //   value: 2,
      // },
      // {
      //   currentPrice: "26069077720000000000",
      //   id: "DOGE",
      //   name: "sDOGE",
      //   lastPrice: "24883629290000000000",
      //   value: 3,
      // },
      {
        currentPrice: "87657120000000000",
        id: "ETH",
        name: "sETH",
        lastPrice: "87224840000000000",
        type: "crypto"
      },
      // {
      //   currentPrice: "28126027610000000000",
      //   id: "FTSE",
      //   name: "sFTSE",
      //   lastPrice: "26087196230000000000",
      //   value: 2,
      // },
      {
        currentPrice: "28126027610000000000",
        id: "YFI",
        name: "sYFI",
        lastPrice: "26087196230000000000",
        type: "crypto"
      },
      {
        currentPrice: "2000100000000000000",
        id: "DOT",
        name: "sDOT",
        lastPrice: "2000000000000000000",
        type: "crypto"
      },
      {
        currentPrice: "1000000000000000000",
        id: "BNB",
        name: "sBNB",
        lastPrice: "1000000000000000000",
        type: "crypto"
      },
      {
        currentPrice: "120100000000000000",
        id: "LINK",
        name: "sLINK",
        lastPrice: "119591770000000000",
        type: "crypto"
      },
      // {
      //   currentPrice: "24067241500000000000",
      //   id: "NEO",
      //   name: "sNEO",
      //   lastPrice: "24172983000000000000",
      //   value: 1,
      // },
      // {
      //   currentPrice: "1812720000000000000000",
      //   id: "OIL",
      //   name: "sOIL",
      //   lastPrice: "1817380000000000000000",
      //   value: 3,
      // },
      {
        currentPrice: "1362900202233000000000",
        id: "TRX",
        name: "sTRX",
        lastPrice: "1321099195405000000000",
        type: "crypto"
      },
      {
        currentPrice: "875510926927000000000",
        id: "VET",
        name: "sVET",
        lastPrice: "869580036982000000000",
        type: "crypto",
      },
      // {
      //   currentPrice: "37113577556570000000000",
      //   id: "XCU",
      //   name: "sXCU",
      //   lastPrice: "36471342587570000000000",
      //   value: 2,
      // },
    ],
  },
};


export default {
  name: "Exchange",
  components: {
    Market,
    MarketPair,
    WalletAndAddressBox,
    WalletBalance,
    MarketOrder,
    TradeOrder,
  },
  props: {},
  data: function () {
    return {
      currencyList: [],
      currencyId: undefined,
      currency: undefined,
      loading: false,

      tradeOrderList: []
    };
  },
  watch: {
    currencyId: {
      handler: function (id) {
        if (!id) {
          return;
        }
        this.loading = true;
        this.currency = undefined;

        api.getHK24hr(id).then(res => {

          const currency = this.currencyList.find(v => v.id === id);
          currency.price = formatNumber(res.data.lastPrice, 4);
          currency.change = formatNumber(res.data.priceChangePercent, 4);

          this.currency = res.data;
          this.loading = false;
        }).catch(error => {
          this.$Message.error(error.message);
          this.loading = false;
        })
        //   const res = {
        //     symbol: `${id}USDT`,
        //     priceChange: "-94.99999800",
        //     priceChangePercent: "-95.960",
        //     weightedAvgPrice: "0.29628482",
        //     prevClosePrice: "0.10002000",
        //     lastPrice: "41717.83000200",
        //     lastQty: "200.00000000",
        //     bidPrice: "4.00000000",
        //     askPrice: "4.00000200",
        //     openPrice: "99.00000000",
        //     highPrice: "100.00000000",
        //     lowPrice: "0.10000000",
        //     volume: "8913.30000000",
        //     quoteVolume: "15.30000000",
        //     openTime: 1499783499040,
        //     closeTime: 1499869899040,
        //     firstId: 28385, // 首笔成交id
        //     lastId: 28460, // 末笔成交id
        //     count: 76, // 成交笔数
        //   };

      },
      immediate: true,
    },
  },
  mounted() {
    this.getCurrencyList();
    this.currencyId = this.currencyList[0].id;
    this.getTradeOrderList();
  },
  methods: {
    formatItem(v) {
      const currentPrice = numberStrToBN(v.currentPrice);
      const lastPrice = numberStrToBN(v.lastPrice);
      return {
        ...v,
        price: formatNumberFromBigNumber(numberStrToBN(v.currentPrice), 4),
        change: formatNumber(
          bnDiv2N(bnSub(currentPrice, lastPrice), lastPrice) * 100,
          4
        ),
        active: false,
        like: Math.random() > 0.5,
      };
    },
    getCurrencyList() {
      // [todo: 从服务器获取]
     this.currencyList = marketMock.data.pricesLasts.map(this.formatItem);
    },

    getTradeOrderList() {
      // [todo: 从服务器获取交易信息]
      this.tradeOrderList = [];
      // this.tradeOrderList.push({
      //   time: '2021/07/28 16:30:26',
      //   currency: 'ADA',
      //   buying: '1.555',
      //   selling: '1.555',
      //   free: '1.555',
      //   s: '2.55'
      // })
    },
    addOrder(item) {
      this.tradeOrderList.push(item);
    }
  },
};
</script>

<style lang='scss' scoped>
.exchange {
  position: absolute;
  top: 0;
  left: -132px;
  display: flex;
  height: 753px;
  font-family: Arial;
  font-size: 12px;
  font-style: normal;

  .mian {
    display: flex;
    margin-right: 24px;
    padding: 11px 0;
    width: 1120px;
    height: 100%;
    box-shadow: 0px 4px 20px rgba(227, 230, 237, 0.2);
    .left-box {
      flex: 1;
      padding: 5px 31px 0 28px;
      display: flex;
      flex-direction: column;
    }
  }

  .left-side {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 320px;
    height: 100%;
    .box {
      padding: 16px 24px 16px 25px;
    }

    .title {
      margin-bottom: 16px;
    }

    .walletAndAddressBox {
      position: absolute;
      z-index: 2;
      top: -120px;
      left: -54px;
    }
    .order {
      margin-top: 24px;
      height: 553px;
    }
  }
  .box {
    border-radius: 16px;
    background: #fff;
  }
  .title {
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
  }
}
</style>
