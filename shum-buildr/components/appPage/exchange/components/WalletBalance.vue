<template>
  <div class="wallet-balance">
    <div class="box-continer">
      <div class="title">Wallet Balance</div>
    </div>
    <Button @click="bayUsd" type="primary" size="large" style="margin-top: 8px">
      BUY<span class="iconfont icon-s"></span>USD
    </Button>
    <Button @click="buildUsd" type="primary" size="large" style="margin-top: 8px">
      BUILD<span class="iconfont icon-s"></span>USD
    </Button>
  </div>
</template>

<script>
export default {
  name: "WalletBalance",
  props: {},
  data: function () {
    return {};
  },
  methods: {
    bayUsd: function () {
      window.open("https://pancakeswap.finance/swap#/swap", "_blank");
    },
    buildUsd: function () {
      let routeUrl = this.$router.resolve({
        path: "/build",
      });
      window.open(routeUrl.href, "_blank");
    },
  },
};
</script>

<style lang='scss' scoped>
.wallet-balance {
  .title {
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0px;
    text-align: left;
  }
  .ivu-btn {
    width: 100%;
    height: 48px;
    font-size: 14px;
    line-height: 16px;
    border-radius: 8px;
  }
}
</style>
