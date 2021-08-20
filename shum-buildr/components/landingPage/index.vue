<template>
   <div id="landingPage">
      <div class="headerBox">
         <img class="linearBuildrlogo"
              src="@/static/LINA_logo.svg"
         />
         <p>ShumFinance</p>
         <div class="mBuyLINA mobileShow" @click.stop="openBuyLINA">
            BUY SHUM
            <img src="@/static/arrow_right.svg"/>
         </div>
      </div>

      <Modal
          v-model="qrcodeDisplay"
          :footer-hide="true"
          :closable="false"
          :transfer="false"
          :mask="true"
          :mask-closable="true"
          class="seeDetailsModal"
      >
         <div class="walletConnect">
            <div class="walletConnectBox">
               <div class="top">
                  <img
                      class="button"
                      src="@/static/close.svg"
                      @click.stop="qrcodeDisplay = false"
                  />
                  <div class="title">WalletConnect</div>
                  <img
                      class="logo"
                      src="@/static/logo-wallet-wallet-connect.svg"
                  />
               </div>
               <div class="boxTitle">
                  Scan QR code with a WalletConnect-compatible wallet
               </div>
               <div class="boxCopy">
                  <div class="copyTitle">
                     <div class="title">
                        Copy to clipboard
                     </div>
                     <Tooltip
                         class="globalInfoStyle"
                         :content="tooltipContent"
                         offset="0 6"
                         placement="bottom"
                         @on-popper-hide="resetTooltipContent"
                     >
                        <div
                            class="copyBtn"
                            :data-clipboard-text="WalletConnectUri"
                            data-clipboard-action="copy"
                            @click="copyYouCode"
                        >
                           <img
                               class="cooyIcon"
                               src="@/static/copy.svg"
                           />
                        </div>
                     </Tooltip>
                  </div>
               </div>
               <canvas class="canvas" id="canvas"></canvas>
            </div>
         </div>
      </Modal>

      <div class="container">
         <div class="introductBox">
            <div class="wel">
               Welcome to ShumFinance
               <p slot="content">
                  The first cross-chain compatible, decentralized
                  delta-one asset protocol to quickly and
                  cost-effectively, create, trade, and manage
                  synthetic assets (Liquids)
               </p>
            </div>
            <div class="btn">
               <div class="buyLINA" @click.stop="openBuyLINA">
                  Buy Shum
                  <!--                  <Icon type="ios-arrow-round-forward"/>-->
               </div>

            </div>
            <div class="fox">
               Necessary Plugins
               <div class="boxItem"
                    @click.stop="
                            selectedWallet(SUPPORTED_WALLETS_MAP.METAMASK)
                        "
               >
                  <img class="boxLogo" src="@/static/metamask.svg"/>

                  <div class="wallet">
                     <div class="boxSub">Connect wallet via</div>

                     <div class="boxTitle">
                        Metamask
                     </div>
                  </div>

                  <!-- <div class="boxDesc">
                      via MetaMask
                  </div> -->
               </div>
            </div>
            <div class="mRect mobileShow"
                 @click.stop="selectedWallet(SUPPORTED_WALLETS_MAP.METAMASK)"
            >
               <img class="boxLogo" src="@/static/metamask.svg"/>
               <div class="box">
                  <div class="context">
                     Connect MetaMask Wallet
                  </div>
                  <div class="chain">
                     Ethereum Chain
                  </div>
               </div>
            </div>

            <div class="tabq ">
               <Collapse v-model="introduct" accordion>
                  <Panel name="2">
                     What is Buildr?
                     <p slot="content">
                        Buildr is part of the Shum's dApp suite. You can
                        pledge and stake your Shum tokens to build sUSD, the
                        base currency of Shum Exchange.
                     </p>
                  </Panel>
                  <Panel name="3">
                     Why stake Shum?
                     <p slot="content">
                        By staking Shum to build sUSD for self use / provide
                        liquidity for traders, users are entitled to staking
                        rewards and a split of the transaction fees
                        generated on our exchange.
                     </p>
                  </Panel>
                  <Panel name="4">
                     What do I do with sUSD?
                     <p slot="content">
                        Users can use sUSD to purchase synthetic assets on
                        our exchange or even move it to other protocols or
                        dapps within the DeFi ecosystem.
                     </p>
                  </Panel>
                  <!-- <Panel name="5">
                      <div class="line"></div>
                      ethereum
                      <p slot="content">
                          {{ ethereum }}
                      </p>
                  </Panel> -->
               </Collapse>
            </div>


         </div>
         <div class="walletBox">
            <img src="@/static/maintenance.svg" alt="">
            <!--            <div class="box">-->
            <!--               <div class="boxItem"-->
            <!--                    @click.stop="-->
            <!--                            selectedWallet(SUPPORTED_WALLETS_MAP.METAMASK)-->
            <!--                        "-->
            <!--               >-->
            <!--                  <img class="boxLogo" src="@/static/metamask.svg"/>-->

            <!--                  <div class="wallet">-->
            <!--                     <div class="boxSub">Connect wallet via</div>-->

            <!--                     <div class="boxTitle">-->
            <!--                        Metamask-->
            <!--                     </div>-->
            <!--                  </div>-->

            <!--                  &lt;!&ndash; <div class="boxDesc">-->
            <!--                      via MetaMask-->
            <!--                  </div> &ndash;&gt;-->
            <!--               </div>-->

            <!--               <div class="boxItem"-->
            <!--                   @click.stop="selectedWallet(SUPPORTED_WALLETS_MAP.WALLET_CONNECT)"-->
            <!--               >-->
            <!--                  <img class="boxLogo"-->
            <!--                      src="@/static/logo-wallet-wallet-connect.svg"-->
            <!--                  />-->
            <!--                  <div class="wallet">-->
            <!--                     <div class="boxSub">Connect wallet via</div>-->
            <!--                     <div class="boxTitle">-->
            <!--                        WalletConnect-->
            <!--                     </div>-->
            <!--                  </div>-->
            <!--                  &lt;!&ndash; <div class="boxDesc">-->
            <!--                      via Binance Chain Wallet-->
            <!--                  </div> &ndash;&gt;-->
            <!--               </div>-->

            <!--               &lt;!&ndash; <div-->
            <!--                   class="boxItem"-->
            <!--                   @click.stop="-->
            <!--                       selectedWallet(SUPPORTED_WALLETS_MAP.BINANCE_CHAIN)-->
            <!--                   "-->
            <!--               >-->
            <!--                   <img-->
            <!--                       class="boxLogo"-->
            <!--                       src="@/static/binance.svg"-->

            <!--                   />-->

            <!--                   <div>-->
            <!--                       <div class="boxSub">Connect</div>-->

            <!--                       <div class="boxTitle">-->
            <!--                           Binance<br />-->
            <!--                           Smart Chain <br />-->
            <!--                           Network-->
            <!--                       </div>-->
            <!--                   </div>-->

            <!--                   <div class="boxDesc">-->
            <!--                       via Binance Chain Wallet-->
            <!--                   </div>-->
            <!--               </div> &ndash;&gt;-->
            <!--            </div>-->
         </div>
      </div>
   </div>
</template>

<script>
   import {selectedWallet} from "@/assets/linearLibrary/linearTools/lnrJSConnector";
   import {
      addEthereumChain,
      checkNetwork,
      SUPPORTED_NETWORKS_MAP,
      SUPPORTED_WALLETS_MAP
   } from "@/assets/linearLibrary/linearTools/network";
   import {openBuyLINA} from "@/common/utils";
   import Clipboard from "clipboard";
   import QRCode from "qrcode";

   export default {
      name: "landingPage",

      data() {
         return {
            SUPPORTED_WALLETS_MAP,
            introduct: "0",
            openBuyLINA,
            tooltipContent: "Copy to clipboard",
            qrcodeDisplay: false
         };
      },
      watch: {
         WalletConnectQrcode(newStatus) {
            this.qrcodeDisplay = newStatus;
         },
         qrcodeDisplay(newStatus) {
            if (newStatus) {
               this.makeCode();
            } else {
               this.$store.commit("setWalletConnect", {
                  qrcode: false
               });
            }
         }
      },
      computed: {
         WalletConnectQrcode() {
            return this.$store.state?.walletConnect?.qrcode;
         },

         WalletConnectUri() {
            return this.$store.state?.walletConnect?.uri;
         }
      },
      mounted() {
         //进入界面的欢迎效果
         setTimeout(() => {
            this.introduct = "1";

            //自动连接metamasks
            let autoConnect = this.$store.state.autoConnect;
            if (autoConnect) {
               let walletType = this.$store.state.walletType;
               walletType && this.selectedWallet(walletType);
            }
         }, 100);
      },
      methods: {
         /**
          * 复制自己的code
          */
         copyYouCode() {
            var clipboarda = new Clipboard(".copyBtn");
            clipboarda.on("success", e => {
               this.tooltipContent = "Copied";
               e.clearSelection();
            });
            clipboarda.on("error", function (e) {
               this.tooltipContent = "Error";
            });
         },

         //重置复制提示框的文本
         resetTooltipContent() {
            setTimeout(() => {
               this.tooltipContent = "Copy to clipboard";
            }, 300);
         },

         makeCode() {
            let canvas = document.getElementById("canvas");

            QRCode.toCanvas(
              canvas,
              this.WalletConnectUri,
              {
                 margin: 0,
                 height: 429,
                 width: 429
              },
              error => {
                 if (error) console.error(error);
              }
            );
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
         }
      }
   };
</script>

<style lang="scss">
   #landingPage {
      overflow: hidden;
      padding-bottom: 64px;

      .mobileShow {
         display: none;
      }

      .headerBox {
         width: 1440px;
         height: 120px;
         padding-left: 120px;
         display: flex;
         align-items: center;


         .linearBuildrlogo {
            cursor: pointer;
            width: 32px;
            height: 32px;
            color: #000000;
            margin-right: 10px;
         }

         p {
            font-size: 22px;
            font-weight: 600;
            margin-right: 30px;
         }
      }

      .seeDetailsModal {

         .ivu-modal-wrap {
            display: flex;
            justify-content: center;
            align-items: center;

            .ivu-modal {
               width: 509px !important;
               top: 0px;

               .ivu-modal-content {
                  .ivu-modal-body {
                     padding: 0px 0px;

                     .walletConnect {
                        display: flex;
                        //position:absolute;
                        justify-content: center;
                        align-items: center;

                        .walletConnectBox {
                           width: 509px;
                           height: 637px;
                           border-radius: 16px;
                           background-color: #ffffff;
                           padding: 40px;

                           .top {
                              display: flex;
                              flex-direction: row-reverse;
                              width: 100%;

                              .button {
                                 width: 40px;
                                 height: 40px;
                                 margin-left: 62px;
                                 cursor: pointer;

                                 &:hover {
                                    content: url("../../static/close_hover.svg");
                                 }
                              }

                              .title {
                                 margin: 4px 0 4px 16px;
                                 font-family: Gilroy-Bold;
                                 font-size: 24px;
                                 font-weight: bold;
                                 line-height: 1.33;
                                 color: #5a575c;
                              }

                              .logo {
                                 width: 40px;
                                 height: 40px;
                              }
                           }

                           .boxTitle {
                              margin-top: 8px;
                              font-family: Gilroy-Regular;
                              font-size: 16px;
                              line-height: 1.5;
                              color: #5a575c;
                              text-align: center;
                           }

                           .boxCopy {
                              display: flex;
                              align-items: center;
                              justify-content: center;

                              .copyTitle {
                                 display: flex;

                                 .title {
                                    margin: 0 4px 0 0;
                                    font-family: Gilroy-Bold;
                                    font-size: 16px;
                                    font-weight: bold;
                                    line-height: 1.5;
                                    color: #1a38f8;
                                 }

                                 .copyBtn {
                                    display: flex;
                                    cursor: pointer;
                                    transition: $animete-time linear;

                                    .cooyIcon {
                                       width: 16px;
                                       height: 16px;
                                       margin: 4px 0 4px 4px;

                                       &:hover {
                                          content: url("../../static/copy_hover.svg");
                                       }
                                    }
                                 }
                              }
                           }

                           .canvas {
                              margin: 32px 0 0;
                           }
                        }
                     }
                  }
               }
            }
         }
      }

      .container {
         display: flex;
         padding-bottom: 4px;
         flex-direction: row;

         .introductBox {
            width: 814px;
            height: 640px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            border-radius: 16px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            margin-right: 60px;
            padding: 0 0 0 130px;

            .wel {
               font-size: 30px;
               font-weight: bold;
               margin-bottom: 24px;
               margin-top: 50px;

               p {
                  font-size: 16px;
                  font-weight: normal;
                  color: #5A575C;
               }
            }

            .btn {
               width: 100%;
               margin: 0 0 50px;

               .buyLINA {
                  font-family: Gilroy-Bold;
                  font-size: 16px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 2.5;
                  letter-spacing: normal;
                  text-align: center;
                  width: 120px;
                  border-radius: 6px;
                  background-color: #1a38f8;
                  color: #ffffff;
                  cursor: pointer;
                  margin-top: 20px;
                  transition: $animete-time linear;

                  .ivu-icon {
                     display: none;
                     font-size: 30px;
                     color: #1a38f8;
                     font-weight: bold;
                     transition: $animete-time linear;
                     margin-left: 4px;
                  }

                  &:hover {
                     color: #7eb5ff;

                     .ivu-icon {
                        color: #7eb5ff;
                     }
                  }
               }

            }

            .fox {
               width: 100%;
               font-size: 18px;
               line-height: 50px;
               font-weight: bold;

               .boxItem {
                  width: 300px;
                  height: 130px;
                  cursor: pointer;
                  border: solid 1px #e5e5e5;
                  display: flex;
                  flex-direction: row;
                  transition: $animete-time linear;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 8px;
                  align-items: center;
                  justify-content: flex-start;

                  &:not(:last-of-type) {
                     margin-bottom: 28px;
                  }

                  .boxLogo {
                     width: 60px;
                     height: 60px;
                     margin-right: 32px;
                  }

                  .boxSub {
                     font-family: Gilroy-Bold;
                     font-size: 14px;
                     font-weight: normal;
                     font-stretch: normal;
                     font-style: normal;
                     line-height: 0.5;
                     letter-spacing: normal;
                     text-align: center;
                     color: #5a575c;
                     margin-bottom: 8px;
                     margin-top: 10px;
                  }

                  .boxTitle {
                     font-family: Gilroy-bold;
                     font-size: 24px;
                     font-weight: bold;
                     font-stretch: normal;
                     font-style: normal;
                     line-height: 1.33;
                     letter-spacing: normal;
                     color: orange;
                     text-align: center;
                  }

                  /* .wallet{
                      position:absolute;
                      padding-top: 32px;
                  } */

                  .boxDesc {
                     font-family: Gilroy-Regular;
                     font-size: 16px;
                     font-weight: normal;
                     font-stretch: normal;
                     font-style: normal;
                     line-height: 1.5;
                     letter-spacing: normal;
                     text-align: center;
                     color: #99999a;
                  }

                  &:hover {
                     border: solid 1px #deddde;
                     box-shadow: 0 2px 12px 0 #deddde;
                  }
               }
            }

            .tabq {
               width: 100%;
               display: flex;
               margin-top: 50px;

               .ivu-collapse {
                  width: 100%;
                  background: unset;
                  border: unset;
                  display: flex;
                  flex-direction: row;


                  .ivu-collapse-item {
                     margin-bottom: 24px;
                     margin-right: 50px;
                     border: unset;

                     .ivu-collapse-header {
                        padding: 0;
                        border: unset;
                        display: flex;
                        align-items: center;
                        font-family: Gilroy-Bold;
                        font-size: 16px;
                        font-weight: bold;
                        height: unset;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.33;
                        letter-spacing: normal;
                        color: #99999a;

                        i {
                           display: none;
                        }
                     }

                     .ivu-collapse-content {
                        width: 100%;
                        position: absolute;
                        left: 115px;
                        background: none;

                        .ivu-collapse-content-box {
                           font-family: Gilroy-Regular;
                           font-size: 16px;
                           font-weight: normal;
                           font-stretch: normal;
                           font-style: normal;
                           line-height: 1.5;
                           letter-spacing: normal;
                           color: #5a575c;

                           p {
                              width: 90%;
                           }
                        }
                     }
                  }


                  .ivu-collapse-item-active {
                     &.ivu-collapse-item {
                        margin-bottom: 0;
                     }

                     .ivu-collapse-header {
                        color: #5a575c;
                        font-size: 16px;
                        line-height: 1.33;

                     }
                  }
               }

            }


         }

         .walletBox {
            padding: 50px;

            img {
               width: 300px;
               height: 300px;
            }

            .box {
               width: 306px;
               height: 100%;
               margin: 0 auto;
               display: flex;
               flex-direction: column;
               justify-content: space-between;

               .boxItem {
                  flex: 1;
                  cursor: pointer;
                  border: solid 1px #e5e5e5;
                  display: flex;
                  flex-direction: column;
                  transition: $animete-time linear;
                  background-color: #ffffff;
                  padding: 80px 32px 38px;
                  border-radius: 8px;
                  align-items: center;
                  justify-content: flex-start;

                  &:not(:last-of-type) {
                     margin-bottom: 28px;
                  }

                  .boxLogo {
                     width: 80px;
                     height: 80px;
                     /* position:relative; */
                  }

                  .boxSub {
                     font-family: Gilroy-Bold;
                     font-size: 16px;
                     font-weight: bold;
                     font-stretch: normal;
                     font-style: normal;
                     line-height: 1.5;
                     letter-spacing: normal;
                     text-align: center;
                     color: #5a575c;
                     margin-bottom: 8px;
                     margin-top: 32px;
                  }

                  .boxTitle {
                     font-family: Gilroy-bold;
                     font-size: 24px;
                     font-weight: bold;
                     font-stretch: normal;
                     font-style: normal;
                     line-height: 1.33;
                     letter-spacing: normal;
                     color: #1a38f8;
                     text-align: center;
                  }

                  /* .wallet{
                      position:absolute;
                      padding-top: 32px;
                  } */

                  .boxDesc {
                     font-family: Gilroy-Regular;
                     font-size: 16px;
                     font-weight: normal;
                     font-stretch: normal;
                     font-style: normal;
                     line-height: 1.5;
                     letter-spacing: normal;
                     text-align: center;
                     color: #99999a;
                  }

                  &:hover {
                     border: solid 1px #deddde;
                     box-shadow: 0 2px 12px 0 #deddde;
                  }
               }
            }
         }
      }
   }

   @media only screen and (max-width: $max-phone-width) {
      #landingPage {
         overflow: hidden;
         padding-bottom: 0;

         .mobileShow {
            display: block;
         }

         .headerBox {
            width: 100vw;
            height: 64px;
            padding: 16px 16px 16px 16px;
            display: flex;
            align-items: center;
            position: relative;

            .linearBuildrlogo {
               cursor: pointer;
               width: 32px;
               height: 32px;
            }

            .mBuyLINA {
               flex: 1;
               height: 16px;
               font-family: Gilroy-Bold;
               font-size: 12px;
               font-weight: bold;
               font-stretch: normal;
               font-style: normal;
               line-height: 1.4;
               letter-spacing: 1.5px;
               text-align: right;
               color: #1a38f8;

               img {
                  width: 16px;
                  height: 16px;
                  float: right;
               }
            }
         }

         .container {
            display: flex;
            padding: 0;

            .introductBox {
               width: 100%;
               height: 88vh;
               position: relative;
               display: flex;
               align-items: stretch;
               background: #fff;
               border-radius: 16px;
               margin-right: 0;
               padding-left: 20px;

               .ivu-collapse {
                  background: unset;
                  border: unset;
                  padding-top: 22px;
                  /*display: flex;*/

                  .ivu-collapse-item {
                     margin-bottom: 16px;
                     border: unset;
                     display: flex;

                     .ivu-collapse-header {
                        padding: 0;
                        width: 150px;
                        border: unset;
                        display: flex;
                        align-items: flex-start;
                        flex-direction: column;
                        font-family: Gilroy-Bold;
                        font-size: 32px;
                        font-weight: bold;
                        height: unset;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.33;
                        letter-spacing: normal;
                        color: #99999a;

                        i {
                           display: none;
                        }

                        .line {
                           width: 3px;
                           height: 17px;
                           margin-right: 16px;
                           border-radius: 4px;
                           background: #bababa;
                           transition: $animete-time linear;
                        }
                     }

                     .ivu-collapse-content {
                        width: 100%;


                        .ivu-collapse-content-box {
                           font-family: Gilroy-Regular;
                           font-size: 12px;
                           font-weight: normal;
                           font-stretch: normal;
                           font-style: normal;
                           line-height: 1.5;
                           letter-spacing: normal;
                           color: #5a575c;
                           margin: 20px;
                           padding: 20px 40px 20px 20px;
                           position: absolute;
                           left: -120px;

                           p {
                              width: 100%;
                           }
                        }
                     }
                  }

                  .ivu-collapse-item-active {
                     &.ivu-collapse-item {
                        margin-bottom: 8px;
                     }

                     .ivu-collapse-header {
                        color: #5a575c;
                        font-size: 24px;
                        height: 32px;
                        line-height: 1.14;

                        .line {
                           height: 17px;
                           background: #1a38f8;
                        }
                     }
                  }
               }

               .btn {
                  display: none;
               }

               .wel {
                  font-size: 20px;
                  font-weight: bold;
                  margin-bottom: 14px;
                  margin-top: 10px;

                  p {
                     font-size: 16px;
                     font-weight: normal;
                     color: #5A575C;
                  }
               }

               .tabq {
                  width: 100%;
                  display: flex;
                  margin-top: 10px;

                  .ivu-collapse {
                     width: 100%;
                     background: unset;
                     border: unset;
                     display: flex;
                     flex-direction: column;


                     .ivu-collapse-item {
                        margin-bottom: 20px;
                        margin-right: 50px;
                        border: unset;

                        .ivu-collapse-header {
                           padding: 0;
                           border: unset;
                           display: flex;
                           align-items: flex-start;
                           font-family: Gilroy-Bold;
                           font-size: 16px;
                           font-weight: bold;
                           width: 80%;
                           height: unset;
                           font-stretch: normal;
                           font-style: normal;
                           line-height: 1.33;
                           letter-spacing: normal;
                           color: #99999a;


                           i {
                              display: none;
                           }
                        }

                        .ivu-collapse-content {
                           width: 95%;
                           /*padding: 10px 40px;*/

                           .ivu-collapse-content-box {
                              font-family: Gilroy-Regular;
                              font-size: 14px;
                              font-weight: normal;
                              font-stretch: normal;
                              font-style: normal;
                              line-height: 1.5;
                              letter-spacing: normal;
                              color: #5a575c;
                              width: 100%;
                              padding:0;


                              p {
                                 width: 100%;
                                 margin: 10px 0;
                              }
                           }
                        }
                     }


                     .ivu-collapse-item-active {
                        &.ivu-collapse-item {
                           margin-bottom: 90px;
                        }

                        .ivu-collapse-header {
                           color: #5a575c;
                           font-size: 16px;
                           line-height: 1.33;

                        }
                     }
                  }

               }


               .buyLINA {
                  display: none;
               }


               .mRect {
                  display: none;
                  /*display: flex;*/
                  /*justify-content: space-around;*/
                  /*align-items: center;*/
                  width: 74.66vw;
                  height: 28.57vw;
                  left: 8.533vw;
                  border-radius: 8px;
                  border: solid 1px #deddde;
                  padding: 0 4vw;
                  cursor: pointer;
                  margin: 30px 0;

                  img {
                     width: 10.66vw;
                     height: 10.66vw;
                  }

                  .box {
                     .context {
                        font-family: Gilroy-Bold;
                        font-size: 14px;
                        font-weight: bold;
                        color: #1a38f8;
                     }

                     .chain {
                        font-family: Gilroy;
                        font-size: 14px;
                        color: #99999a;
                     }
                  }
               }
            }

            .walletBox {
               display: none;
            }
         }
      }
   }
</style>
