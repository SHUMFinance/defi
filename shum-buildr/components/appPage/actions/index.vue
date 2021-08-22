<template>
   <div id="actions">
      <div class="headerBox">
         <a href="/" class="webLogo" style="color:#000000;font-size:14px;font-weight:400">
            <img
                class="linearBuildrlogo"
                src="@/static/LINA_logo.svg"
            />
            <p v-if="currentAction == 0">ShumFinance</p>
            <p v-if="currentAction != 0">Shum<span style="color:#1A38F8">Finance</span></p>
         </a>

         <a href="/" class="mobileLogo">
            <img
                class="linearBuildrlogo"
                src="@/static/LINA_logo.svg"
                v-show="currentAction == 0 && othersAction == 0"
            />
            <img
                class="logoWhenAction"
                src="@/static/logo-crypto-linear-colour.svg"
                style="height: 32px;"
                v-show="currentAction != 0 || othersAction != 0"
            />
         </a>

         <div class="introductActionBox" v-if="currentAction != 0 || othersAction != 0"
         >
            <div class="title" v-if="currentAction == 1 && othersAction == 0">Dashboard</div>
            <div class="title" v-if="currentAction == 2 && othersAction == 0">Exchange</div>
            <div class="title" v-if="currentAction == 3 && othersAction == 0">Build</div>
            <div class="title" v-if="currentAction == 4 && othersAction == 0">Burn</div>
            <div class="title" v-if="currentAction == 5 && othersAction == 0">Claim</div>
            <div class="title" v-if="currentAction == 6 && othersAction == 0">Transfer</div>
            <div class="title" v-if="currentAction == 7 && othersAction == 0">Swap</div>
            <div class="title" v-if="othersAction == 1">Track Debt</div>
            <div class="title" v-if="othersAction == 2">Transaction</div>
            <div class="title" v-if="othersAction == 3">Referral</div>

            <img
                class="info"
                v-if="othersAction == 0"
                src="@/static/info.svg"
                @click="showIntroductActionModal"
            />
         </div>


         <Modal
             v-model="introductActionModal"
             :footer-hide="true"
             :closable="true"
             :transfer="false"
             :mask="true"
             class="introductActionModal"
         >
            <div class="title" v-if="currentAction == 1">Dashboard</div>
            <div class="title" v-if="currentAction == 2">Exchange</div>
            <div class="title" v-if="currentAction == 3">Build</div>
            <div class="title" v-if="currentAction == 4">Burn</div>
            <div class="title" v-if="currentAction == 5">Claim</div>
            <div class="title" v-if="currentAction == 6">Transfer</div>
            <div class="title" v-if="currentAction == 7">Swap</div>

            <div class="context" v-if="currentAction == 1">
               Dashboard show by staking SHUM
            </div>
            <div class="context" v-if="currentAction == 2">
               Exchange show by staking SHUM
            </div>
            <div class="context" v-if="currentAction == 3">
               Build sUSD and earn staking rewards by staking SHUM
            </div>
            <div class="context" v-if="currentAction == 4">
               Burn sUSD to unlock staked SHUM
            </div>
            <div class="context" v-if="currentAction == 5">
               Claim rewards from staking SHUM and building sUSD
            </div>
            <div class="context" v-if="currentAction == 6">
               Transfer different currencies to specified wallet address
            </div>
            <div class="context" v-if="currentAction == 7">
               You can select the type of liquids and enter the amount you
               want to swap to the other chain.
            </div>
         </Modal>

         <Tooltip
             class="globalInfoStyle action"
             offset="0 6"
             max-width="300"
             placement="bottom"
             v-for="(item, index) in actions"
             :key="index"
             :class="{
                    activited: currentAction == index + 1,
                    isTransaction: isTransaction && currentAction != index + 1
                }"
             :disabled="!isTransaction || currentAction == index + 1"
             @click.native="actionChange(index + 1)"
         >
            {{ item }}

            <div slot="content">
               <div class="tipTitle">
                  Please complete the
                  {{ actions[currentAction - 1] }} transaction
               </div>
               <div class="tipDesc">
                  You can only do one transaction at a time
               </div>
            </div>
         </Tooltip>

         <div class="mNavigate" v-if="mMenuState && isMobile">
            <div class="mHead">
               <div class="mLogo">
                  <img src="@/static/logo-crypto-linear-colour.svg"/>
                  Menu
               </div>
               <img
                   @click="mHideMenuFun"
                   class="mClose"
                   src="@/static/icon-cancel.svg"
               />
            </div>
            <div
                class="mNavigateItem"
                @click="actionChange(0)"
                :class="{
                        activited: currentAction == 0
                    }"
            >
               Home
            </div>
            <div
                v-for="(item, index) in actions"
                :key="index"
                class="mNavigateItem"
                :class="{
                        activited: currentAction == index + 1
                    }"
                @click="actionChange(index + 1)"
            >
               {{ item }}
            </div>
         </div>
      </div>

      <div class="actionsBox" :style="(currentAction == 1 ||currentAction == 2) ? 'width:1200px;box-shadow:none;border-radius:0;': 'width:786px' ">
         <homePage v-if="currentAction == 0"></homePage>
         <dashboard v-else-if="currentAction == 1"></dashboard>
         <exchange v-else-if="currentAction == 2"></exchange>
         <build v-else-if="currentAction == 3"></build>
         <burn v-else-if="currentAction == 4"></burn>
         <claim v-else-if="currentAction ==5"></claim>
         <transfer v-else-if="currentAction == 6"></transfer>
         <swap v-else></swap>

         <referralModal/>
         <transactionModal/>
         <trackModal/>
      </div>
      <notificationQueue/>
   </div>
</template>

<script>
   import homePage from "@/components/appPage/actions/homePage";
   import notificationQueue from "@/components/notification/notificationQueue.vue";

   import build from "@/components/appPage/actions/build";
   import burn from "@/components/appPage/actions/burn";
   import claim from "@/components/appPage/actions/claim";
   import transfer from "@/components/appPage/actions/transfer";
   import swap from "@/components/appPage/actions/swap";
   import dashboard from "@/components/appPage/actions/dashboard";
   import exchange from "@/components/appPage/actions/exchange";

   import referralModal from "@/components/appPage/walletDetails/actions/referralModal";
   import transactionModal from "@/components/appPage/walletDetails/actions/transactionModal";
   import trackModal from "@/components/appPage/walletDetails/actions/trackModal";

   import common from "@/config/common";

   export default {
      name: "actions",
      components: {
         homePage,
         dashboard,
         exchange,
         build,
         burn,
         claim,
         transfer,
         swap,
         trackModal,
         referralModal,
         notificationQueue,
         transactionModal
      },
      data() {
         return {
            introductActionModal: false,
            // currentAction: this.$store.state.currentAction,
            othersAction: 0, // 0没有 1track 2transaction 3referral
            actions: ["DASHBOARD","EXCHANGE","Build", "Burn", "Claim", "Transfer", "Swap"]
         };
      },
      created() {
         //订阅组件改变事件
         this.$pub.subscribe("trackModalChange", (msg, params) => {
            // console.log("trackModalChange", params);
            if (params) {
               this.othersAction = 1;
            }
         });
         this.$pub.subscribe("transactionModalChange", (msg, params) => {
            // console.log("transactionModalChange", params);
            if (params) {
               this.othersAction = 2;
            }
         });
         this.$pub.subscribe("referralModalChange", (msg, params) => {
            // console.log("referralModalChange", params);
            if (params) {
               this.othersAction = 3;
            }
         });

         //订阅历史记录窗口关闭事件
         //this.$pub.subscribe("transactionModalCloseEvent", (msg, params) => {
         //    this.othersAction = 0;
         //});
         ////订阅历史记录窗口关闭事件
         //this.$pub.subscribe("trackModalCloseEvent", (msg, params) => {
         //    this.othersAction = 0;
         //});
         ////订阅推荐窗口关闭事件
         //this.$pub.subscribe("referralModalCloseEvent", (msg, params) => {
         //    this.othersAction = 0;
         //});
      },
      watch: {
         isMobile() {
         },

         //显示不同功能 0homePage 1build 2burn 3claim 4transfer 5swap
         currentAction() {
         }
      },
      computed: {
         mMenuState() {
            return this.$store.state.mMenuState;
         },

         isMobile() {
            return this.$store.state.isMobile;
         },

         isTransaction() {
            return this.$store.state.isTransaction;
         },

         currentAction() {
            return this.$store.state.currentAction;
         }
      },
      methods: {
         //切换功能
         //Switch between features
         actionChange(action) {
            //正在交易中无法点击其他按钮
            if (!this.isTransaction) {

               console.log("xxl1 start : " + action);
               if (this.currentAction != action) {

                  this.$store.commit("setCurrentAction", action);
                  this.$router.push("/" + common.SUBPAGE_OPTIONS_MAP[action]);

                  //关闭 referral transaction track 的 modal
                  this.$pub.publish("referralModalCloseEvent");
                  this.$pub.publish("transactionModalCloseEvent");
                  this.$pub.publish("trackModalCloseEvent");

                  this.othersAction = 0;

                  this.$pub.publish("referralModalChange", false);
                  this.$pub.publish("transactionModalChange", false);
                  this.$pub.publish("trackModalChange", false);
                  this.$store.commit("setmMenuState", false);
               } else {
                  this.$store.commit("setCurrentAction", 0);
                  this.$router.push("/");
               }
            }
         },

         showIntroductActionModal() {
            this.introductActionModal = true;
         },

         mHideMenuFun() {
            this.$store.commit("setmMenuState", false);
         }
      }
   };
</script>

<style lang="scss" scoped>
   #actions {
      width: 786px;
      margin-right: 40px;

      .headerBox {
         height: 120px;
         display: flex;
         align-items: center;

         .mobileLogo {
            display: none;
         }

         .webLogo {
            display: flex;
            flex-direction: row;
            align-items: center;

            .linearBuildrlogo {
               width: 32px;
               height: 32px;
               cursor: pointer;
               color: #000000;
               margin-right: 10px;
            }

            p {
               font-size: 22px;
               font-weight: 600;
               margin-right: 30px;
            }
         }

         .introductActionBox {
            display: none;
         }

         .action {
            margin-right: 0;
            border: solid 1px rgba(#fff, 0);
            cursor: pointer;
            font-family: Gilroy-Bold;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1.5px;
            text-align: center;
            transition: $animete-time linear;
            padding: 8px 12px;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.33;
            color: #99999a;
            text-transform: uppercase;

            &:hover {
               &:not(.isTransaction):not(.activited) {
                  color: #1a38f8;
               }
            }

            &.isTransaction {
               cursor: not-allowed;
            }

            &.activited {
               border-bottom: 4px solid #1a38f8;
               color: #000000;
            }
         }
      }

      .actionsBox {
         width: 786px;
         height: 840px;
         position: relative;
         overflow: hidden;
         box-shadow: 0px 2px 6px #deddde;
         border-radius: 16px;
      }
   }

   @media only screen and (max-width: $max-phone-width) {
      #actions {
         width: 100%;
         margin-right: 0;

         .headerBox {
            height: 32px;
            display: flex;
            align-items: center;
            margin: 16px 0;

            .webLogo {
               display: none;
            }

            .mobileLogo {
               display: block;

               .linearBuildrlogo {
                  width: 163px;
                  height: 32px;
                  cursor: pointer;
                  margin-right: 28px;
               }

               .logoWhenAction {
                  cursor: pointer;
                  margin-right: 8px;
               }
            }

            .introductActionBox {
               display: flex;
               align-items: center;

               .title {
                  font-family: Gilroy-Bold;
                  font-size: 20px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.6;
                  letter-spacing: normal;
                  color: #3c3a3e;
               }

               .info {
                  margin-left: 4px;
                  width: 16px;
                  height: 16px;
               }
            }

            /deep/ .introductActionModal {
               .ivu-modal-mask {
                  z-index: 10000 !important;
               }

               .ivu-modal-wrap {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 10000 !important;

                  .ivu-modal {
                     width: 74.66vw !important;
                     height: 36.8vw;
                     top: 0 !important;

                     .ivu-modal-content {
                        height: 100%;

                        .ivu-modal-body {
                           height: 100%;
                           padding: 24px;

                           .title {
                              font-family: Gilroy-Bold;
                              font-size: 16px;
                              margin-bottom: 16px;
                           }

                           .context {
                              font-family: Gilroy;
                              font-size: 14px;
                           }
                        }
                     }
                  }
               }
            }

            .action {
               display: none;
            }

            .mNavigate {
               width: 100vw;
               height: 100vh;
               position: fixed;
               left: 0;
               top: 0;
               z-index: 10000;
               background-color: #ffffff;

               .mHead {
                  width: 100%;
                  height: 64px;
                  padding: 16px 24px;
                  display: flex;
                  margin-bottom: 44px;

                  .mLogo {
                     font-family: Gilroy-Bold;
                     font-size: 24px;
                     font-weight: bold;
                     font-stretch: normal;
                     font-style: normal;
                     line-height: 1.33;
                     letter-spacing: normal;
                     color: #3c3a3e;

                     img {
                        float: left;
                        margin-right: 10px;
                     }
                  }

                  .mClose {
                     position: fixed;
                     right: 19px;
                     top: 19px;
                  }
               }

               .mNavigateItem {
                  width: 100%;
                  height: 40px;
                  font-family: Gilroy;
                  font-size: 32px;
                  font-weight: bold;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: 1.25;
                  letter-spacing: normal;
                  color: #99999a;
                  padding-left: 56px;
                  margin-bottom: 32px;

                  &.activited {
                     font-size: 56px;
                     color: #1a38f8;
                     height: 64px;
                  }
               }
            }
         }

         .actionsBox {
            width: 100%;
            height: 88vh;
            min-height: 550px;
            position: relative;
            overflow: hidden;
            box-shadow: 0px 2px 6px #deddde;
            border-radius: 16px;
         }
      }
   }
</style>
