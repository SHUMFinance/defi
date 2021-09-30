<template>
  <div class="walletAndAddressBox">
    <div class="info">
      <img class="network" v-if="isEthereumNetwork" src="@/static/ETH.svg" />
      <img class="network" v-else src="@/static/binance.svg" />

      <div class="wallet">
        {{ walletNetworkName }}
      </div>
      <div class="address">
        {{ abbreviateAddress }}
      </div>
      <Tooltip
        class="globalInfoStyle"
        :content="tooltipContent"
        offset="0 6"
        placement="bottom"
        @on-popper-hide="resetTooltipContent"
      >
        <svg
          class="copyBtn"
          :data-clipboard-text="walletAddress"
          data-clipboard-action="copy"
          @click="copyAddress()"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns="http://www.w3.org/2000/svg"
        >
          <desc>Created with Lunacy</desc>
          <g id="Icon/Copy">
            <path
              d="M12.9947 2.33562C12.91 1.03154 11.8255 0 10.5 0L2.5 0L2.33562 0.00531768C1.03154 0.0899613 0 1.17452 0 2.5L0 10.5L0.00531768
                                 10.6644C0.0899613 11.9685 1.17452 13 2.5 13L4.44938 13L4.44938 12L2.5 12L2.35554 11.9931C1.59489 11.9204 1 11.2797 1 10.5L1 2.5L1.00687
                                 2.35554C1.07955 1.59489 1.7203 1 2.5 1L10.5 1L10.6445 1.00687C11.4051 1.07955 12 1.7203 12 2.5L12 4.69901L13 4.69901L13 2.5L12.9947
                                 2.33562ZM16.5 6L8.5 6C7.11929 6 6 7.11929 6 8.5L6 16.5C6 17.8807 7.11929 19 8.5 19L16.5 19C17.8807 19 19 17.8807 19 16.5L19 8.5C19 7.11929
                                 17.8807 6 16.5 6ZM8.5 7L16.5 7C17.3284 7 18 7.67157 18 8.5L18 16.5C18 17.3284 17.3284 18 16.5 18L8.5 18C7.67157 18 7 17.3284 7 16.5L7 8.5C7
                                 7.67157 7.67157 7 8.5 7Z"
              transform="translate(2.5 2.5)"
              id="Combined-Shape"
              fill="#5a575c"
              fill-rule="evenodd"
              stroke="none"
            />
          </g>
        </svg>
      </Tooltip>

      <div class="disconnect" @click.stop="disconnect">Disconnect</div>
    </div>

    <div class="mMenu" @click="mShowMenuFun">
      <img src="@/static/icon-menu.svg" />
    </div>
  </div>
</template>

<script>
import {
  isEthereumNetwork,
} from "@/assets/linearLibrary/linearTools/network";
import {abbreviateAddress} from '@/assets/linearLibrary/linearTools/format';
import Clipboard from 'clipboard';

export default {
  name: "WalletAndAddressBox",
  props: {},
  data: function () {
    return {
      tooltipContent: "Copy to clipboard",
    };
  },
  computed: {
    walletNetworkId() {
      return this.$store.state?.walletNetworkId;
    },

    isEthereumNetwork() {
      return isEthereumNetwork(this.walletNetworkId);
    },
    isEthereumNetwork() {
      return isEthereumNetwork(this.walletNetworkId);
    },
    walletNetworkName() {
      return this.$store.state?.walletNetworkName;
    },
    walletAddress() {
      return this.$store.state?.wallet?.address;
    },
    abbreviateAddress() {
      return abbreviateAddress(this.walletAddress);
    },
  },
  methods: {
    copyAddress() {
      var that = this;
      var clipboarda = new Clipboard(".copyBtn");
      clipboarda.on("success", function (e) {
        that.tooltipContent = "Copied";
        e.clearSelection();
      });
      clipboarda.on("error", function (e) {
        that.tooltipContent = "Error";
      });
    },

    resetTooltipContent() {
      var that = this;
      setTimeout(function () {
        that.tooltipContent = "Copy to clipboard";
      }, 300);
    },
    async disconnect() {
      // this.$store.commit("setWallet", "");
      this.$store.commit("setAutoConnect", false);
      let registeredWalletConnectEvents =
        $nuxt.$store.state?.registeredWalletConnectEvents;
      if (registeredWalletConnectEvents) {
        await lnrJSConnector.signer.provider.provider.disconnect();
        this.$store.commit("setRegisteredWalletConnectEvents", false);
      }
      location.reload();
    },
    mShowMenuFun() {
      this.$store.commit("setmMenuState", true);
    },
  },
};
</script>

<style lang='scss' scoped>
.walletAndAddressBox {
  width: 374px;
  height: 120px;
  // background-color: springgreen;
  display: flex;
  // display: none;
  justify-content: space-between;
  align-items: center;

  .info {
    width: 100%;
    padding: 7px 16px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 20px;
    background: #f6f5f6;

    .network {
      margin-right: 8px;
      width: 16px;
      height: 16px;
    }

    .wallet {
      margin-right: 8px;
      font-family: Gilroy-Bold;
      font-size: 14px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: #5a575c;
    }

    .address {
      flex: 1;
      font-family: Gilroy-Regular;
      font-size: 14px;
      margin-right: 4px;
      text-align: center;
      // white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: #99999a;
    }

    .copyBtn {
      cursor: pointer;
      width: 16px;
      height: 16px;
      margin-top: 4px;
      margin-right: 12px;

      &:hover {
        #Combined-Shape {
          fill: #1a38f8;
          stroke: #1a38f8;
        }
      }
    }

    .disconnect {
      font-family: Gilroy-Bold;
      font-size: 10px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: 1.25px;
      text-align: center;
      color: #99999a;
      text-transform: uppercase;
      cursor: pointer;
      transition: $animete-time linear;

      &:hover {
        color: #1a38f8;
      }
    }
  }
  .mMenu {
    display: none;
  }
}
</style>
