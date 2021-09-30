<template>
  <div class="market-order">
    <Spin fix v-if="loading"></Spin>
    <div class="title">MARKET ORDER</div>
    <div class="floor">
      <div class="floor-continer buy-or-sell">
        <div
          :class="['btn', 'buy', buyOrSell && 'active']"
          @click="
            buyOrSell = true;
            changeValue = 0;
          "
        >
          BUY<span class="iconfont icon-s"></span> {{ currencyId }}
        </div>
        <div
          :class="['btn', 'sell', !buyOrSell && 'active']"
          @click="
            buyOrSell = false;
            changeValue = 0;
          "
        >
          SELL <span class="iconfont icon-s"></span> {{ currencyId }}
        </div>
      </div>
    </div>
    <div class="floor">
      
      <div class="floor-continer floor-title">
        Balance
        <span class="right">
              {{ buyOrSell ? USDTBalance : BTCBalance }}
              <span class="iconfont icon-s" style="font-size: 10px"></span>
              {{ buyOrSell ? "USD" : currencyId }}
            </span>
      </div>
      
      <Input class="suffix-currency" v-model="changeValue">
        <template v-slot:suffix>
          <span style="font-size: 14px">
            <span class="iconfont icon-s" style="font-size: 10px"></span>
            {{ buyOrSell ? "USD" : currencyId }}
          </span>
        </template>
      </Input>
      <div class="tag-box">
        <span class="tag" @click="slecetPrice(0.25)">25%</span>
        <span class="tag" @click="slecetPrice(0.5)">50%</span>
        <span class="tag" @click="slecetPrice(0.75)">75%</span>
        <span class="tag" @click="slecetPrice(1)">MAX</span>
      </div>
    </div>
    <div class="floor">
      <div class="floor-continer floor-title">Market Price</div>

      <Input :value="formatNumber('lastPrice')" disabled>
        <template v-slot:suffix>
          <img src="@/static/appPage/refresh.png" alt="" />
        </template>
      </Input>

    </div>
    <div class="floor">
      <div class="floor-continer floor-title">Receive</div>
      <Input :value="changed" class="suffix-currency" disabled>
        <template v-slot:suffix>
          <span style="font-size: 14px">
            <span class="iconfont icon-s" style="font-size: 10px"></span>
            {{ buyOrSell ? currencyId : "USD" }}
          </span>
        </template>
      </Input>
    </div>
    <div class="floor fee">
      <div class="floor-continer">
        <div class="fee-item">
          <span>Fee</span>
          <span>0 USD（0.25%)</span>
        </div>
        <div class="fee-item">
          <span>Gas Price</span>
          <span>5 GWEI</span>
        </div>
        <div class="fee-item">
          <span>
            Minimum Received
          </span>
          <span class="right">
            {{ changed }}<span class="iconfont icon-s" style="font-size: 10px"></span>{{ buyOrSell ? currencyId : "USD" }}
          </span>
        </div>
      </div>
    </div>
    <Button
      :class="[buyOrSell ? 'buy' : 'sell']"
      size="large"
      style="margin-top: 8px"
      @click="click"
    >
      {{ buyOrSell ? "BUY" : "SELL" }}<span class="iconfont icon-s"></span
      >{{ currencyId }}
    </Button>
  </div>
</template>

<script>

import { formatNumber } from "@/assets/linearLibrary/linearTools/format";
import lnrJSConnector, {
  selectedWallet,
} from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import {
  bn2n,
  bnSub,
  bnSub2N,
  n2bn,
  numberStrToBN,
  bnDiv2N,
} from "@/common/bnCalc";

import echarts from "echarts";
import {
  checkNetwork,
  SUPPORTED_NETWORKS_MAP,
  SUPPORTED_WALLETS_MAP,
  getNetworkSpeeds,
  formatGasPrice,
  unFormatGasPrice,
  isEthereumNetwork,
  bufferGasLimit,
  DEFAULT_GAS_LIMIT,
} from "@/assets/linearLibrary/linearTools/network";

import {abbreviateAddress} from '@/assets/linearLibrary/linearTools/format';
import Clipboard from 'clipboard';
// import lnrJSConnector, {
//    selectedWallet,
// } from '@/assets/linearLibrary/linearTools/lnrJSConnector';
import currencies from "@/common/currency";
import _ from "lodash";

import {
  EXCHANGE_PROCESS_SETUP
} from "@/assets/linearLibrary/linearTools/constants/process";

import api from "@/api";

export default {
  name: "MarketOrder",
  props: {
    loading: Boolean,
    currencyId: String,
    currency: Object,
  },
  data: function () {
    return {
      buyOrSell: true, // buy: true/sell: false
      changeValue: 0,

      USDTBalance: 0, // 用户当前余额
      BTCBalance: 0, // 用户BTC当前余额
      sUSD: undefined,
      shouldApprove: true,
      exchangeStep: 1,
    };
  },
  computed: {
    changed: function () {
      if (!this.currency) {
        return 0;
      }
      if (this.buyOrSell) {
        return formatNumber(this.changeValue / this.currency.lastPrice, 4);
      } else {
        return formatNumber(this.changeValue * this.currency.lastPrice, 4);
      }
    },
    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },
    //add by xxl
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
  },
  watch: {
    walletNetworkId() {
    },
    //add by xxl
    walletAddress() {
    },
    
    currencyId: {
      handler: async function(id) {

        console.log("xxl13 watch currencyID : " + id);
        if (!id) {
          return;
        }
        // [todo: 更具后台获取当前币种余额]

        //xxl 默认值是最大的余额
        this.changeValue = bn2n(await this.getUSDTBalance());

        // id 当前币种id (ADA)
        console.log("xxl13 currencyId ... ");
        this.USDTBalance = bn2n(await this.getUSDTBalance());
        console.log("xxl13 this.USDTBalance : " + this.USDTBalance);

        this.BTCBalance =  bn2n(await this.getBTCBalance());
        console.log("xxl13 this.BTCBalance : " + this.BTCBalance);

      },
      immediate: true
    },

  },
  async mounted() {

    console.log("xxl13 currencyId : " + this.currencyId);
    //xxl add exchange 
    const {
      lnrJS: {ShumExchangeSystem, sUSD},
      utils
    } = lnrJSConnector;

    this.sUSD = sUSD;
    this.ShumExchangeSystem = ShumExchangeSystem;
    this.shouldApprove = !(await api.isExchangeApproved(this.walletAddress));

    console.log("xxl14 shouldApprove is : " + this.shouldApprove);

    if(this.shouldApprove){
      this.exchangeStep = 2
    }else{
      this.exchangeStep = 1
    }

  },
  methods: {
    slecetPrice: function (n) {
      this.changeValue = (this.buyOrSell ? this.USDTBalance : this.BTCBalance) * n;
    },
    formatNumber: function (attr) {
      if (!this.currency) {
        return 0;
      }
      return formatNumber(this.currency[attr], 4);
    },
    click: function () {
      // this.currencyId 当前币种id 例如: ADA
      // 目标默认USD
      // [todo: 需要生成交易]
      this.exchangeTokens()
      // [todo: 确认交易以后加入交易流水信息]
      this.$emit('addOrder', { /** 此对象是交易信息实体 */});
    },

    async selectedWallet(walletType) {
      console.log("xxl index.vue 00 selectedWallet " + walletType);
      const status = await checkNetwork();

      console.log("xxl index.vue 01 selectedWallet " + status);

      if (status) {
        await selectedWallet(walletType);
      } else {
        try {
          await addEthereumChain(SUPPORTED_NETWORKS_MAP.BSCMAINNET);
          this.$store.commit("setAutoConnect", true);
          this.$store.commit("setWalletType", walletType);
          location.reload();
        } catch (error) {
          this.$store.commit("setSetupModal", true);
        }
      }
    },

    //xxl12 1 需要从界面传入币种
    async exchangeTokens() {
      try {
        console.log("xxl myTest ");
        this.waitProcessFlow = this.startFlow();
        //开始逻辑流处理函数
        await this.waitProcessFlow();
      } catch (error) {
        console.log(error);
      } finally {
        console.log("xxl finally");
      }
    },

    //xxl11
    startFlow() {
      return async () => {
        try {
          this.transactionErrMsg = "";

          if (this.shouldApprove) {
            await this.startApproveContract(n2bn(Number.MAX_SAFE_INTEGER));
          }

          console.log("xxl14 curreny : " + this.currencyId);
          console.log("after approve : " );

          const {
            lnrJS: { ShumExchangeSystem },
            utils,
          } = lnrJSConnector;

          let sourceKey = "",destKey="";

          if (this.buyOrSell) {
            sourceKey =  "sUSD";
            destKey =  "s" + this.currencyId;
          } else {
            sourceKey =  "s" + this.currencyId;
            destKey =  "sUSD";
          }

          console.log("xxl ShumExchangeSystem.exchange sourceKey :" + sourceKey + " : destKey " + destKey);
 
          //TODO need to change ...
          let transaction = await ShumExchangeSystem.exchange(
            utils.formatBytes32String(sourceKey),               // sourceKey
            n2bn(this.changeValue),                             // sourceAmount xxl12 2 需要充界面传入
            this.walletAddress,                                 // destAddr
            utils.formatBytes32String(destKey),                 // destKey      xxl12 3 需要充界面传入
            {}
          );
          console.log("xxl exhange end ");

          if (transaction) {
            this.confirmTransactionStatus = true;
            this.confirmTransactionHash = transaction.hash;

            //替换货币名称
            let setupProcess = _.replace(
                EXCHANGE_PROCESS_SETUP.PROCESS,
                "[REPLACE_CURRENCY]",
                this.currencyId                     
            );


            // 发起右下角通知
            this.$pub.publish("notificationQueue", {
              hash: this.confirmTransactionHash,
              type: setupProcess,
              networkId: this.walletNetworkId,
              value: `Do exchange / ${this.exchangeStep}`,
            });

            let status = await utils.waitForTransaction(transaction.hash);

            if (!status) {
              throw {
                code: 6100001,
                message:
                  "Something went wrong while gaining approval from the contract, please try again.",
              };
            }

            console.log("xxl abc ...");
            await api.setExchangeRecord(
              this.walletNetworkId,
              transaction.hash,
              sourceKey,                             // sourceKey
              this.changeValue,                        
              this.walletAddress,                  
              destKey                               // destAddr
            )

            console.log("xxl efg ...");

          }

        } catch (error) {
          console.log("xxl startFlow error");
          console.log(error);
        }
      };
    },

    //开始Approve合约调用
    async startApproveContract(approveAmountSHUM) {
      this.shouldApprove = false;
      this.confirmTransactionStatus = false;

      console.log(11);
      const {
        lnrJS: { ShumExchangeSystem, sUSD },
        utils,
      } = lnrJSConnector;

      console.log("xxl ShumExchangeSystem start ...");
      console.log(ShumExchangeSystem);
      console.log("xxl ShumExchangeSystem end");

      //取合约地址
      const ShumExchangeSystemAddress = ShumExchangeSystem.contract.address;

      const transactionSettings = {
        gasPrice: this.$store.state?.gasDetails?.price,
        gasLimit: this.gasLimit,
      };

      if (transactionSettings.gasPrice == 0) {
        console.log(getNetworkSpeeds(this.walletNetworkId));
        transactionSettings.gasPrice = getNetworkSpeeds(
          this.walletNetworkId
        ).price;
      }


      this.confirmTransactionNetworkId = this.walletNetworkId;
      console.log("xxl10 startApproveContract :" + this.walletNetworkId);
      console.log(
        "xxl10 gasPrice :" +
          transactionSettings.gasPrice +
          " gasPrice : " +
          transactionSettings.gasLimit
      );

      transactionSettings.gasLimit = await this.getGasEstimateFromApprove(
        ShumExchangeSystemAddress,
        approveAmountSHUM
      );
      console.log(
        "xxl10 gasPrice :" +
          transactionSettings.gasPrice +
          " gasPrice : " +
          transactionSettings.gasLimit
      );

      let transaction = await sUSD.approve(
        ShumExchangeSystemAddress,
        approveAmountSHUM,
        transactionSettings
      );
      console.log(33);

      if (transaction) {
        this.confirmTransactionStatus = true;
        this.confirmTransactionHash = transaction.hash;

        // 发起右下角通知
        this.$pub.publish("notificationQueue", {
          hash: this.confirmTransactionHash,
          type: EXCHANGE_PROCESS_SETUP.APPROVE,
          networkId: this.walletNetworkId,
          value: `Approve exchange / ${this.exchangeStep}`,
        });

        let status = await utils.waitForTransaction(transaction.hash);

        if (!status) {
          throw {
            code: 6100001,
            message:
              "Something went wrong while gaining approval from the contract, please try again.",
          };
        }
        
        console.log("tx is : " + transaction.hash);
        await api.setExchangeApprove(transaction.hash,this.walletAddress);
        this.shouldApprove = false;

      }
    },

    //评估Approve的gas
    async getGasEstimateFromApprove(contractAddress, approveAmountSHUM) {
      try {
        const {
          utils,
          lnrJS: { ShumFinance },
        } = lnrJSConnector;

        if (
          approveAmountSHUM.isZero() ||
          approveAmountSHUM.lt("0") //小于等于0
        ) {
          throw new Error("invalid approveAmountSHUM");
        }

        let gasEstimate = await ShumFinance.contract.estimateGas.approve(
          contractAddress,
          approveAmountSHUM
        );

        return bufferGasLimit(gasEstimate);
      } catch (e) {
        return bufferGasLimit(DEFAULT_GAS_LIMIT.approve);
      }
    },

    //xxl11
    async getUSDTBalance() {
      console.log("xxl13 wallet : " + this.walletAddress);
      let usdtBalance = await this.sUSD.balanceOf(this.walletAddress);
      
      console.log("xxl13 usdtBalance 0: " + usdtBalance);
      console.log("xxl13 usdtBalance 1: " + bn2n(usdtBalance));
      return usdtBalance;
    },

    async getBTCBalance() {
      const {
        lnrJS: { sBTC },
      } = lnrJSConnector;

      let usdtBalance = await sBTC.balanceOf(this.walletAddress);
      console.log("xxl11 sBTC : " + usdtBalance);

      return usdtBalance;
    },
  },
};
</script>

<style lang='scss' scoped>
.market-order {
  position: relative;
  .title {
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
  }

  /deep/.ivu-input-wrapper {
    .ivu-input-suffix {
      display: flex;
      align-items: center;
    }
    .ivu-input {
      padding: 5px 8px 4px 16px;
      height: 36px;
      border-radius: 8px;
    }
    &.suffix-currency {
      .ivu-input-suffix {
        width: 52px;
      }
      .ivu-input {
        padding-right: 52px;
      }
    }
  }

  .buy-or-sell {
    margin-top: 16px;
    display: flex;
    justify-content: space-around;
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 32px;
      width: 114px;
      font-weight: 700;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      color: #8b8b8c;
      background: #f2f2f2;
      border-radius: 16px;
      cursor: pointer;
      &.buy.active {
        color: #4b72f0;
        background: #ecf1ff;
      }
      &.sell.active {
        background-color: rgba(249, 217, 219, 0.2);
        color: #df434c;
      }
    }
  }

  .tag-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 9px;

    .tag {
      display: inline-block;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      width: 43px;
      font-size: 11px;
      line-height: 19px;
      color: #b9c0cd;
      background: #e0e5f0;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        color: #5a575c;
      }

      &:nth-of-type(n + 2) {
        margin-left: 10px;
      }
    }
  }

  .ivu-btn {
    width: 100%;
    height: 48px;
    font-size: 14px;
    line-height: 16px;
    border-radius: 8px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    &.sell {
      background-color: #df434c;
      border-color: #df434c;
    }
    &.buy {
      background-color: #4b72f0;
      border-color: #4b72f0;
    }
  }

  .floor.fee {
    margin-top: -8px;
    margin-bottom: 16px;

    .fee-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #8b8b8c;
      line-height: 24px;
    }
  }

  .floor {
    margin-bottom: 18px;

    .floor-continer {
      padding: 0 8px;
    }

    .floor-title {
      margin-bottom: 6px;
      font-weight: 700;
      line-height: 24px;
      .right {
        float: right;
      }
    }
  }
}
</style>
