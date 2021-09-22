<template>
   <div id="landingPage">
      <div class="headerBox">
         <img class="linearBuildrlogo"
              src="@/static/logoshum.jpg"
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
            </div>
            <p slot="content">
               SHUM Finance ("SHUM") is a non-custodial, cross-chain compatible, Delta-one asset protocol.SHUM's
               long-term DeFi vision is to increase the inclusion and democratization of investment assets (digital and
               traditional). There is tremendous value in investors being able to easily and quickly invest, save money
               and secure assets at fair market value.
            </p>
            <div class="btn">
               <div class="buyLINA" @click.stop="openBuyLINA">
                  ENTER SHUMFINANCE
                  <!--                  <Icon type="ios-arrow-round-forward"/>-->
               </div>

            </div>
            <div class="fox">
               <div class="boxtit">
                  <p>Necessary Plugins</p>
                  <span>To access to SHUM Finance, you will need to connect your wallet via Metamask</span>
               </div>
               <div class="boxItem"
                    @click.stop="selectedWallet(SUPPORTED_WALLETS_MAP.METAMASK) ">
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
            <p class="clicktitle">TITLE</p>
            <p class="clickcon">the performance characteristics</p>
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
            <!-- 三类似模块-->
            <div class="welone">
               <div class="text">
                  <p>Stake.Build.Earn</p>
                  <span>A decentralized application allow user to staking and building sUSD by using a mixture of SHUM token and other major cryptocurrencies.</span>
                  <button>LAUNCH BUILDR</button>
               </div>
               <div class="tou">
                  <p class="graycil"></p>
                  <p class="bluecil"></p>
                  <div class="cirbg"></div>
                  <div class="bg"></div>
                  <div class="webitem">
                     <div class="actionInputItem"
                          :class="{error: errors.stakeMsg}"
                          @click="changeFocusItem(0)"
                     >
                        <div class="itemLeft">
                           <div class="itemIcon">
                              <img src="@/static/logoshum.jpg"/>
                           </div>
                           <div class="itemType">
                              <div class="itemTypeTitle">Stake SHUM</div>
                           </div>
                        </div>
                        <div class="itemRight">
                           <div class="inputRect">
                              <InputNumber
                                  class="input"
                                  ref="itemInput0"
                                  type="text"
                                  v-model="inputData.stake"
                                  placeholder="0"
                                  :min="1"
                                  :max="100000000000"
                                  @on-focus="inputFocus(0)"
                                  @on-blur="inputBlur(0)"
                                  :formatter="formatterInput"
                              />
                              <!-- :formatter="
                                      value =>
                                          floor(
                                              toNonExponential(value),
                                              DECIMAL_PRECISION
                                          )
                                  " -->
                              <!-- :max="formatEtherToNumber(buildData.maxAvaliableLINA)" -->
                              <!-- <div class="unit">lina</div> -->
                           </div>
                           <!-- <div class="avaliable">Avaliable : 1,000</div> -->
                        </div>
                        <div class="itemTypeBtn"
                             @click.stop="clickBuy"
                        >buy shum
                           <img src="@/static/arrow_right.svg"/>
                        </div>
                        <div class="itemErrMsg" :style="{ opacity: errors.stakeMsg ? '1' : '0'}">
                           {{ errors.stakeMsg }}
                        </div>
                     </div>
                     <div
                         class="actionInputItem"
                         :class="{error: errors.buildAmount }"
                         @click="changeFocusItem(1)"
                     >
                        <div class="itemLeft">
                           <div class="itemIcon">
                              <img src="@/static/logoshum.jpg"/>
                           </div>
                           <div class="itemType">
                              <div class="itemTypeTitle">
                                 Build USD
                                 <Tooltip
                                     max-width="305"
                                     placement="top"
                                     class="tip globalInfoStyle"
                                     content="Amount of sUSD built may vary due to block times and price fluctuations in pledge tokens."
                                     offset="0 4"
                                 >
                                    <img
                                        src="@/static/info_white.svg"
                                    />
                                 </Tooltip>
                              </div>
                           </div>
                        </div>
                        <div class="itemRight">
                           <div class="inputRect">
                              <InputNumber
                                  class="input"
                                  ref="itemInput1"
                                  type="text"
                                  :min="0"
                                  :max="100000000000"
                                  v-model="inputData.amount"
                                  @on-focus="inputFocus(1)"
                                  @on-blur="inputBlur(1)"
                                  placeholder="0"
                                  :formatter="formatterInput"
                              />

                              <!-- :formatter=" value => floor(
                                  toNonExponential(value), DECIMAL_PRECISION )
                              " -->
                              <!-- :max="formatEtherToNumber(buildData.maxAvaliablesUSD)" -->
                              <!-- <div class="unit">sUSD</div> -->
                           </div>
                           <!-- <div class="avaliable">Avaliable : 1,000</div> -->
                        </div>
                        <div
                            class="itemTypeBtn"
                            @click.stop="clickMaxBuildAmount"
                        >
                           Max
                        </div>
                        <div
                            class="itemErrMsg"
                            :style="{
                                    opacity: errors.amountMsg ? '1' : '0'
                                }"
                        >
                           {{ errors.amountMsg }}
                        </div>
                     </div>
                     <div
                         class="actionInputItem"
                         :class="{
                                error: errors.ratioMsg
                            }"
                         @click="changeFocusItem(2)"
                     >
                        <div class="itemLeft">
                           <div class="itemIcon">
                              <img src="@/static/logoshum.jpg"/>
                           </div>
                           <div class="itemType">
                              <div class="itemTypeTitle">P Ratio</div>
                           </div>
                        </div>
                        <div class="itemRight">
                           <div class="inputRect">
                              <InputNumber
                                  class="input"
                                  ref="itemInput2"
                                  type="text"
                                  :max="100000000000"
                                  v-model="inputData.ratio"
                                  @on-focus="inputFocus(2)"
                                  @on-blur="inputBlur(2)"
                                  placeholder="0"
                                  :formatter="
                                            value => formatterInput(value, 0)
                                        "
                              />
                              <!-- :max="buildData.maxPRatio" -->
                              <!-- <div class="unit">%</div> -->
                           </div>
                           <!-- <div class="avaliable">Current : 99.73</div> -->
                        </div>
                        <div
                            class="itemTypeBtn"
                            @click.stop="clickTargetRatio"
                        >
                           Target ratio
                        </div>
                        <div
                            class="itemErrMsg"
                            :style="{
                                    opacity: errors.ratioMsg ? '1' : '0'
                                }"
                        >
                           {{ errors.ratioMsg }}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="weltwo">
               <div class="tou" style="margin-left:0!important;float:left;">
                  <div class="cirbg"></div>
                  <div class="bg"></div>

               </div>
               <div class="text">
                  <p>Cross Chain Transfer. Gas Saving. Composability</p>
                  <span>We using custom SWAP to allow composability of SHUM tokens across chain and to help save gas fees.</span>
                  <button>LAUNCH SWAP</button>
               </div>
            </div>
            <div class="welthree" style="margin-bottom:320px!important;">
               <div class="text">
                  <p>Stake.Build.Earn</p>
                  <span>A decentralized application for staking and building LUSD, accepting a mixture of LINA tokens and other major cryptocurrencies.</span>
                  <button>LAUNCH BUILDR</button>
               </div>
               <div class="tou">
                  <p class="graycil"></p>
                  <p class="bluecil"></p>
                  <div class="cirbg"></div>
                  <div class="bg"></div>
               </div>
            </div>
            <!-- 尾部-->
            <div class="foot">
               <div class="fot_con">
                  <div class="fot_left">
                     <div class="log">
                        <img class="linearBuildrlogo"
                             src="@/static/logoshum.jpg"
                        />
                        <p>ShumFinance</p>
                     </div>
                     <span>SHUM Finance ("SHUM") is a non-custodial, cross-chain compatible, Delta-one asset protocol.SHUM's long-term DeFi vision is to increase the inclusion and democratization of investment assets (digital and traditional).</span>
                  </div>
                  <div class="fot_cen">
                     <p>LEARN MORE</p>
                     <span>White paper</span>
                  </div>
                  <div class="fot_right">
                     <p>CONNECT WITH SHUM</p>
                     <span>Twitter</span>
                     <span>Telegram announcement</span>
                  </div>
               </div>
               <div class="copy">© 2021 Shum Finance. All rights reserved.</div>
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
   import {
      findParents,
      removeClass,
      addClass,
      formatterInput
   } from "@/common/utils";

   export default {
      name: "landingPage",

      data() {
         return {
            SUPPORTED_WALLETS_MAP,
            introduct: "0",
            openBuyLINA,
            tooltipContent: "Copy to clipboard",
            qrcodeDisplay: false,
            errors: {
               stakeMsg: "",
               amountMsg: "",
               ratioMsg: ""
            },
            //输入框展示数据
            inputData: {
               stake: null,
               amount: null,
               ratio: 0
            },
            formatterInput
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
         },
         //改变激活元素
         //Select item here
         changeFocusItem(index) {

            console.log("xxl index is : " + index);
            // this.activeItem = index;
            this.$nextTick(() => {
               this.$refs["itemInput" + index].$el
                 .querySelector("input")
                 .focus();
            });
         },
         //获取焦点
         //Choose current inputbox
         inputFocus(index) {
            this.$nextTick(() => {
               let currentElement = this.$refs["itemInput" + index].$el;
               let parentElement = findParents(
                 currentElement,
                 "actionInputItem"
               );
               addClass(parentElement, "active");
            });
         },

         //失去焦点
         //Select different inputbox
         inputBlur(index) {
            this.$nextTick(() => {
               let currentElement = this.$refs["itemInput" + index].$el;
               let parentElement = findParents(
                 currentElement,
                 "actionInputItem"
               );
               removeClass(parentElement, "active");
            });
         },
         //点击购买
         clickBuy() {
            openBuyLINA();
            //this.activeItemBtn = 0;
         },
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
            width: 100%;
            min-height: 640px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            border-radius: 16px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            margin-right: 60px;
            padding: 0 0 0 60px;

            .wel {
               font-size: 30px;
               font-weight: bold;
               margin-bottom: 48px;
               margin-top: 50px;
               font-family: Arial;
               font-style: normal;
               line-height: 24px;
               text-align: center;
               color: #111B47;
            }

            p {
               width: 72%;
               font-size: 16px;
               font-weight: normal;
               color: #5A575C;
               margin-bottom: 48px;
            }

            .btn {
               width: 281px;
               height: 48px;
               background: #4B72F0;
               border-radius: 8px;
               margin-bottom: 72px;

               .buyLINA {
                  font-family: Gilroy-Bold;
                  font-size: 16px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 48px;
                  letter-spacing: normal;
                  text-align: center;
                  width: 281px;
                  border-radius: 8px;
                  background-color: #4B72F0;
                  color: #ffffff;
                  cursor: pointer;
                  /*margin-top: 20px;*/
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
               width: 960px;
               height: 201px;
               background: #F5F6F7;
               box-shadow: 8px 8px 10px #E3E5E8, -8px -8px 20px rgba(255, 255, 255, 0.6), inset 0px 0px 4px rgba(255, 255, 255, 0.25);
               border-radius: 24px;
               font-size: 18px;
               line-height: 50px;
               font-weight: bold;
               display: flex;
               flex-direction: row;
               justify-content: space-around;

               .boxtit {
                  p {
                     width: 161px;
                     height: 24px;
                     font-family: Arial;
                     font-style: normal;
                     font-weight: bold;
                     font-size: 18px;
                     line-height: 24px;
                     color: #111B47;
                     margin: 56px 0 0 0;
                  }

                  span {
                     display: block;
                     width: 443px;
                     height: 44px;
                     font-family: Arial Hebrew;
                     font-style: normal;
                     font-weight: normal;
                     font-size: 14px;
                     line-height: 24px;
                     color: #26272E;
                     margin-top: 23px;
                     margin-bottom: 56px;
                  }
               }

               .boxItem {
                  width: 320px;
                  height: 136px;
                  background: #FFFFFF;
                  border: 1px solid #E0E5F0;
                  box-sizing: border-box;
                  border-radius: 16px;
                  cursor: pointer;
                  display: flex;
                  flex-direction: row;
                  transition: $animete-time linear;
                  padding: 30px;
                  margin-top: 33px;
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

            .clicktitle {
               width: 45px;
               height: 24px;
               font-family: Arial;
               font-style: normal;
               font-weight: bold;
               font-size: 16px;
               line-height: 24px;
               text-align: center;
               color: #4B72F0;
               margin: 126px auto 18px;
            }

            .clickcon {
               width: 365px;
               height: 24px;
               font-family: Arial;
               font-style: normal;
               font-weight: bold;
               font-size: 24px;
               line-height: 24px;
               text-align: center;
               color: #111B47;
               margin-bottom: 313px;
            }

            .weltwo {
               display: flex;
               flex-direction: row;
               justify-content: space-around;
               margin-bottom: 425px;

               .text {
                  margin-left:141px;
                  p {
                     width: 340px;
                     height: 48px;
                     font-family: Arial;
                     font-style: normal;
                     font-weight: bold;
                     font-size: 24px;
                     line-height: 24px;
                     color: #111B47;
                     margin: 60px 0 0 0;
                  }

                  span {
                     display: block;
                     margin: 24px 0;
                     width: 408px;
                     height: 72px;
                     font-family: Arial Hebrew;
                     font-style: normal;
                     font-weight: normal;
                     font-size: 14px;
                     line-height: 24px;
                     color: #26272E;
                  }

                  button {
                     width: 256px;
                     height: 48px;
                     background: #FFFFFF;
                     border: 1px solid #4B72F0;
                     border-radius: 8px;
                     color: #4B72F0;
                  }
               }

               .tou {
                  margin-right: 141px;
                  position: relative;
                  .cirbg{
                     width:819px;
                     height:819px;
                     border-radius: 50%;
                     background: #E1EEFB;
                     margin-left:-400px;
                     margin-top:-250px;
                  }
                  .bg {
                     float:left;
                     width: 560px;
                     height: 320px;
                     background: #4B72F0;
                     border-radius: 24px;
                     position: absolute;
                     right: -60px;
                     top: 0;
                  }

                  .webitem {
                     box-sizing: border-box;
                     border-radius: 8px;
                     float: left;
                     position: absolute;
                     left: -50px;
                     top: 10px;
                     z-index: 1000;
                     margin-top: 30px;
                     display: flex;
                     justify-content: space-between;

                     .actionInputItem {
                        background: #FFFFFF;
                        border-radius: 8px;
                        border: solid 1px #deddde;
                        border-bottom: none;
                        display: inline-block;
                        width: 180px;
                        height: 240px;
                        transition: $animete-time linear;
                        position: relative;
                        margin-right: 24px;

                        &:hover,
                        &.active {
                           border-color: white;
                           box-shadow: 0px 2px 12px #deddde;
                        }

                        .itemLeft {
                           display: flex;
                           align-items: center;
                           flex-direction: column;

                           .itemIcon {
                              width: 40px;
                              height: 40px;
                              margin: 40px auto 30px;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              border-radius: 50%;
                              background: #ffffff;

                              img {
                                 width: 100%;
                                 height: 100%;
                              }
                           }

                           .itemType {
                              .itemTypeTitle {
                                 text-align: center;
                                 font-family: Gilroy-bold;
                                 font-size: 16px;
                                 font-weight: bold;
                                 font-stretch: normal;
                                 font-style: normal;
                                 line-height: 1.5;
                                 letter-spacing: normal;
                                 color: #5a575c;

                                 .tip {
                                    margin-left: 8px;

                                    img {
                                       margin-top: -3px;
                                    }
                                 }
                              }

                           }
                        }

                        .itemRight {
                           flex: 1;
                           display: flex;

                           .inputRect {
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              // margin-bottom: 8px;
                              .input {
                                 width: 100%;
                                 margin-top: 35px;
                                 border: none;
                                 box-shadow: none;
                                 text-align: center;

                                 .ivu-input-number-handler-wrap {
                                    display: none;
                                 }

                                 .ivu-input-number-input {
                                    text-align: center;
                                    font-family: Gilroy-bold;
                                    font-size: 32px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    font-style: normal;
                                    line-height: 1.25;
                                    letter-spacing: normal;
                                    color: #5a575c;

                                    &::placeholder {
                                       color: #99999a;
                                    }
                                 }
                              }

                              .unit {
                                 color: #5a575c;
                                 font-family: Gilroy-Regular;
                                 font-size: 16px;
                                 font-weight: 400;
                                 line-height: 24px;
                                 text-transform: uppercase;
                              }
                           }

                           .avaliable {
                              color: #c6c4c7;
                              font-family: Gilroy;
                              font-size: 12px;
                              font-weight: 500;
                              line-height: 16px;
                              text-align: right;
                           }
                        }

                        .itemTypeBtn {
                           transition: $animete-time linear;
                           cursor: pointer;
                           width: 100%;
                           position: absolute;
                           bottom: 0;
                           border-radius: 5px;
                           opacity: 0.2;
                           text-transform: uppercase;
                           font-family: Gilroy-bold;
                           font-size: 16px;
                           font-weight: bold;
                           font-stretch: normal;
                           font-style: normal;
                           line-height: 4.03;
                           letter-spacing: 1.5px;
                           text-align: center;
                           background-color: #1a38f8;
                           color: #ffffff;

                           img {
                              margin-left: 6px;
                              color: #ffffff;
                           }

                           &:hover {
                              &:not(.default) {
                                 opacity: 1;
                              }
                           }

                           &.active {
                              opacity: 1;
                           }

                           &.default {
                              cursor: default;
                           }
                        }

                        .itemErrMsg {
                           transition: opacity $animete-time linear;
                           position: absolute;
                           left: 0;
                           bottom: -20px;
                           height: 16px;
                           color: #df434c;
                           font-family: Gilroy;
                           font-size: 10px;
                           font-weight: 700;
                           line-height: 16px;
                           text-transform: uppercase;
                           letter-spacing: 1.25px;
                        }

                        &.error {
                           border-color: #df434c;
                        }
                     }
                  }
               }
            }

            .welone, .welthree {
               display: flex;
               flex-direction: row;
               justify-content: space-around;
               margin-bottom: 425px;
               margin-left:300px;

               .text {
                  p {
                     width: 191px;
                     height: 24px;
                     font-family: Arial;
                     font-style: normal;
                     font-weight: bold;
                     font-size: 24px;
                     line-height: 24px;
                     color: #111B47;
                     margin: 60px 0 0 0;
                  }

                  span {
                     display: block;
                     margin: 24px 0;
                     width: 408px;
                     height: 72px;
                     font-family: Arial Hebrew;
                     font-style: normal;
                     font-weight: normal;
                     font-size: 14px;
                     line-height: 24px;
                     color: #26272E;
                  }

                  button {
                     width: 256px;
                     height: 48px;
                     background: #FFFFFF;
                     border: 1px solid #4B72F0;
                     border-radius: 8px;
                     color: #4B72F0;
                  }
               }

               .tou {
                  margin-left: 158px;
                  position: relative;
                  .cirbg{
                     width:819px;
                     height:819px;
                     border-radius: 50%;
                     background: #E1EEFB;
                     margin-right:-30px;
                     margin-top:-250px;
                 }
                  .bg {
                     float:right;
                     z-index:100;
                     width: 560px;
                     height: 320px;
                     background: #4B72F0;
                     border-radius: 24px;
                     position: absolute;
                     left: -50px;
                     top: 0;
                  }
                  .bluecil{
                     width:60px;
                     height:60px;
                     border-radius:50%;
                     background: #4B72F0;
                     position:absolute;
                     top:600px;
                     left:100px;
                  }
                  .graycil{
                     width:60px;
                     height:60px;
                     border-radius:50%;
                     background: #D7E2EC;
                     position:absolute;
                     bottom:600px;
                     left:100px;
                  }

                  .webitem {
                     box-sizing: border-box;
                     border-radius: 8px;
                     float: left;
                     position: absolute;
                     left: -100px;
                     top: 10px;
                     z-index: 1000;
                     margin-top: 30px;
                     display: flex;
                     justify-content: space-between;

                     .actionInputItem {
                        background: #FFFFFF;
                        border-radius: 8px;
                        border: solid 1px #deddde;
                        border-bottom: none;
                        display: inline-block;
                        width: 180px;
                        height: 240px;
                        transition: $animete-time linear;
                        position: relative;
                        margin-right: 24px;

                        &:hover,
                        &.active {
                           border-color: white;
                           box-shadow: 0px 2px 12px #deddde;
                        }

                        .itemLeft {
                           display: flex;
                           align-items: center;
                           flex-direction: column;

                           .itemIcon {
                              width: 40px;
                              height: 40px;
                              margin: 40px auto 30px;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              border-radius: 50%;
                              background: #ffffff;

                              img {
                                 width: 100%;
                                 height: 100%;
                              }
                           }

                           .itemType {
                              .itemTypeTitle {
                                 text-align: center;
                                 font-family: Gilroy-bold;
                                 font-size: 16px;
                                 font-weight: bold;
                                 font-stretch: normal;
                                 font-style: normal;
                                 line-height: 1.5;
                                 letter-spacing: normal;
                                 color: #5a575c;

                                 .tip {
                                    margin-left: 8px;

                                    img {
                                       margin-top: -3px;
                                    }
                                 }
                              }

                           }
                        }

                        .itemRight {
                           flex: 1;
                           display: flex;

                           .inputRect {
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              // margin-bottom: 8px;
                              .input {
                                 width: 100%;
                                 margin-top: 35px;
                                 border: none;
                                 box-shadow: none;
                                 text-align: center;

                                 .ivu-input-number-handler-wrap {
                                    display: none;
                                 }

                                 .ivu-input-number-input {
                                    text-align: center;
                                    font-family: Gilroy-bold;
                                    font-size: 32px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    font-style: normal;
                                    line-height: 1.25;
                                    letter-spacing: normal;
                                    color: #5a575c;

                                    &::placeholder {
                                       color: #99999a;
                                    }
                                 }
                              }

                              .unit {
                                 color: #5a575c;
                                 font-family: Gilroy-Regular;
                                 font-size: 16px;
                                 font-weight: 400;
                                 line-height: 24px;
                                 text-transform: uppercase;
                              }
                           }

                           .avaliable {
                              color: #c6c4c7;
                              font-family: Gilroy;
                              font-size: 12px;
                              font-weight: 500;
                              line-height: 16px;
                              text-align: right;
                           }
                        }

                        .itemTypeBtn {
                           transition: $animete-time linear;
                           cursor: pointer;
                           width: 100%;
                           position: absolute;
                           bottom: 0;
                           border-radius: 5px;
                           opacity: 0.2;
                           text-transform: uppercase;
                           font-family: Gilroy-bold;
                           font-size: 16px;
                           font-weight: bold;
                           font-stretch: normal;
                           font-style: normal;
                           line-height: 4.03;
                           letter-spacing: 1.5px;
                           text-align: center;
                           background-color: #1a38f8;
                           color: #ffffff;

                           img {
                              margin-left: 6px;
                              color: #ffffff;
                           }

                           &:hover {
                              &:not(.default) {
                                 opacity: 1;
                              }
                           }

                           &.active {
                              opacity: 1;
                           }

                           &.default {
                              cursor: default;
                           }
                        }

                        .itemErrMsg {
                           transition: opacity $animete-time linear;
                           position: absolute;
                           left: 0;
                           bottom: -20px;
                           height: 16px;
                           color: #df434c;
                           font-family: Gilroy;
                           font-size: 10px;
                           font-weight: 700;
                           line-height: 16px;
                           text-transform: uppercase;
                           letter-spacing: 1.25px;
                        }

                        &.error {
                           border-color: #df434c;
                        }
                     }
                  }
               }
            }

            .foot {
               width: 1280px;
               display: flex;
               flex-direction: column;
               border-top: 1px solid #CCD8E2;
               padding-top: 81px;

               .fot_con {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-around;

                  .fot_left {

                     .log {
                        margin-bottom: 32px;

                        img {
                           cursor: pointer;
                           width: 32px;
                           height: 32px;
                           background: #E0E5F0;
                           border-radius: 16px;
                           display: inline-block;
                           margin-bottom: 5px;
                        }

                        p {
                           display: inline-block;
                           width: 161px;
                           height: 38px;
                           font-family: Roboto;
                           font-style: normal;
                           font-weight: 900;
                           font-size: 26px;
                           line-height: 38px;
                           color: #111B47;
                           margin: 0;
                        }
                     }

                     span {
                        display: block;
                        width: 530px;
                        height: 72px;
                        font-family: Arial Hebrew;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 14px;
                        line-height: 24px;
                        color: #26272E;
                     }
                  }

                  .fot_cen, .fot_right {
                     display: flex;
                     flex-direction: column;

                     p {
                        margin-bottom: 22px;
                        width: 199px;
                        height: 24px;
                        font-family: Arial;
                        font-style: normal;
                        font-weight: bold;
                        font-size: 18px;
                        line-height: 24px;
                        color: #111B47;
                     }

                     span {
                        display: block;
                        margin-bottom: 16px;
                        font-family: Arial;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 18px;
                        line-height: 24px;
                        color: #111B47;
                     }
                  }
               }

               .copy {
                  width:338px;
                  height:24px;
                  font-family: Arial;
                  font-style: normal;
                  font-weight: normal;
                  font-size: 18px;
                  line-height: 24px;
                  color: #111B47;
                  margin-top: 160px;
                  margin-left:60px;
               }
            }


            .tabq {
               width: 100%;
               display: none;
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
            display: none;
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
                              padding: 0;


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
