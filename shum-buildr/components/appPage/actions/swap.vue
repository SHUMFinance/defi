<template>
   <div id="swap" :class="{ isMobile }">
      <Tabs v-model="actionTabs" class="actionTabs">
         <TabPane name="m0">
            <div class="swapBox">
               <div class="actionBody">
                  <template v-if="!isMobile">
                     <div class="actionTitle">Swap</div>
                     <div class="actionDesc">
                        You can select the type of liquids and enter the
                        amount you want to swap to the other chain.
                     </div>
                  </template>

                  <div
                      class="someWrongMobile"
                      v-if="isMobile"
                      v-show="errors.amountMsg"
                  >
                     <img class="errIcon" src="@/static/error.svg"/>
                     <div class="errMessage">
                        {{ errors.amountMsg }}
                     </div>
                  </div>

                  <div
                      class="swapInputBox"
                      :class="{ error: errors.amountMsg }"
                  >
                     <div class="iconBox">
                        <div class="popselect">
                           <img class="icon" :src="currentTitle.fromImg"/>
                           <Poptip
                               class="name"
                               placement="bottom"
                               :width="isMobile ? 280 : 200"
                               offset="0px 24px"
                               v-model="currencyDropDown"
                           >
                              {{ currentTitle.fromName }}
                              <!-- BSC -->
<!--                              <dropdownArrowSvg-->
<!--                                  :selected="currencyDropDown"-->
<!--                              />-->
                              <!--										<div slot="content">-->
                              <!--											<div-->
                              <!--												:class="{-->
                              <!--													selected:-->
                              <!--														index ==-->
                              <!--														selectCurrencyIndex,-->
                              <!--												}"-->
                              <!--												class="currencyItem"-->
                              <!--												v-for="(item,-->
                              <!--												index) in currencies"-->
                              <!--												:key="index"-->
                              <!--												@click="-->
                              <!--													changeSelectCurrencyIndex(-->
                              <!--														index-->
                              <!--													)-->
                              <!--												"-->
                              <!--											>-->
                              <!--												<img-->
                              <!--													class="itemIcon"-->
                              <!--													:src="item.img"-->
                              <!--												/>-->
                              <!--												<div class="itemName">-->
                              <!--													{{ item.name }}-->
                              <!--												</div>-->
                              <!--											</div>-->
                              <!--										</div>-->
                           </Poptip>
                        </div>
                        <img class="arrow" src="@/static/appPage/swap_arrow.svg" alt="">
                        <div class="popselect">

                           <!-- <img class="icon" :src="currency.img" /> -->
                           <img class="icon" :src="currentTitle.toImg"/>
                           <Poptip
                               class="name"
                               placement="bottom"
                               :width="isMobile ? 280 : 200"
                               offset="0px 24px"
                               v-model="currencyDropDownr"
                           >
                              {{ currentTitle.toName }}

<!--                              <dropdownArrowSvg-->
<!--                                  :selected="currencyDropDownr"-->
<!--                              />-->
                              <!--										<div slot="content">-->
                              <!--											<div-->
                              <!--												:class="{-->
                              <!--													selected:-->
                              <!--														index ==-->
                              <!--														selectCurrencyIndex,-->
                              <!--												}"-->
                              <!--												class="currencyItem"-->
                              <!--												v-for="(item,-->
                              <!--												index) in currencies"-->
                              <!--												:key="index"-->
                              <!--												@click="-->
                              <!--													changeSelectCurrencyIndex(-->
                              <!--														index-->
                              <!--													)-->
                              <!--												"-->
                              <!--											>-->
                              <!--												<img-->
                              <!--													class="itemIcon"-->
                              <!--													:src="item.img"-->
                              <!--												/>-->
                              <!--												<div class="itemName">-->
                              <!--													{{ item.name }}-->
                              <!--												</div>-->
                              <!--											</div>-->
                              <!--										</div>-->
                           </Poptip>
                        </div>

                        <div>
                           <!-- {{ currency.name }} -->

                           <!-- <Dropdown trigger="click">
                                        {{ currency.name }}
                                        <Icon type="ios-arrow-down"></Icon>
                                        <DropdownMenu slot="list">
                                            <DropdownItem
                                                v-for="(item,
                                                index) in currencies"
                                                :key="index"
                                                >{{ item.name }}</DropdownItem
                                            >
                                        </DropdownMenu>
                                    </Dropdown> -->
                        </div>

                        <div v-if="isMobile" class="avaliable">
                           Avaliable:
                           {{ formatNumber(currency.balance, 4) }}
                           {{ currency.name }}
                        </div>
                     </div>

                     <div class="divider"></div>

                     <!-- <div v-if="currencySelectModal" class="currencySelectModal">
                                    123444
                            </div> -->

                     <div class="inputBox" @click="inputFocus(0)">
                        <template v-if="isMobile">
                           <div class="label">
                              <div class="amount">
                                 SHUM Amount
                              </div>
                              <InputNumber
                                  class="input"
                                  ref="itemInput0"
                                  element-id="transfer_number_input"
                                  :min="currency.frozenBalance"
                                  :max="
												floor(currency.totalBalance, 4)
											"
                                  type="text"
                                  v-model="swapNumber"
                                  placeholder="0"
                                  @on-focus="inputFocus(0)"
                                  @on-blur="inputBlur(0)"
                                  :formatter="
												(value) =>
													formatterInput(value, 4)
											"
                              />
                              <span
                                  class="max"
                                  :class="{
												active: activeItemBtn == 0,
											}"
                                  @click="clickMaxAmount"
                              >MAX</span
                              >
                           </div>
                        </template>
                        <template v-else>
                           <div class="label">
                              <div class="amount">
                                 Amount
                              </div>
                           </div>
                           <InputNumber
                               class="input"
                               ref="itemInput0"
                               element-id="transfer_number_input"
                               :min="currency.frozenBalance"
                               :max="floor(currency.totalBalance, 4)"
                               type="text"
                               v-model="swapNumber"
                               placeholder="0"
                               @on-focus="inputFocus(0)"
                               @on-blur="inputBlur(0)"
                               :formatter="
											(value) => formatterInput(value, 4)
										"
                           />
                           <span
                               style="margin: 0 24px;width: 0px;height: 32px;border-left: 1px solid #E0E5F0;"
                           ></span
                           >
                           <span
                               class="max"
                               :class="{ active: activeItemBtn == 0 }"
                               @click="clickMaxAmount"
                           >MAX</span
                           >
                        </template>
                     </div>
                  </div>

                  <div
                      class="someWrong"
                      v-if="!isMobile"
                      v-show="errors.amountMsg"
                  >
                     {{ errors.amountMsg }}
                  </div>
                  <gasEditorSwap></gasEditorSwap>
                  <!-- v-if="actionTabs == 'm0'" -->
               </div>

               <div
                   class="swapBtn"
                   :class="{
							disabled: swapDisabled,
						}"
                   @click="clickSwap"
               >
                  SWAP
                  <template v-if="!isMobile">NOW</template>
               </div>

               <Spin fix v-if="processing"></Spin>
            </div>
         </TabPane>
         <TabPane name="m1">
            <watingEnhanceSwapNew
                :amount="diffSwapNumber"
                v-if="actionTabs == 'm1'"
                :currency="currency.key"
                @close="close"
            ></watingEnhanceSwapNew>
         </TabPane>
      </Tabs>
   </div>
</template>

<script>
   import _ from 'lodash';
   import gasEditorSwap from '@/components/gasEditorSwap';
   import watingEnhanceSwapNew from '@/components/transferStatus/watingEnhanceSwapNew';
   import dropdownArrowSvg from '@/components/svg/dropdownArrow';

   import {
      formatterInput,
      setCursorRange,
      findParents,
      removeClass,
      addClass,
   } from '@/common/utils';
   import {
      bufferGasLimit,
      DEFAULT_GAS_LIMIT,
      getOtherNetworks,
      isBinanceNetwork,
      isEthereumNetwork,
      SUPPORTED_WALLETS_MAP
   } from '@/assets/linearLibrary/linearTools/network';
   import lnrJSConnector from '@/assets/linearLibrary/linearTools/lnrJSConnector';
   import {bn2n, bnSub, bnSub2N, n2bn} from '@/common/bnCalc';
   import {lnr} from '@/assets/linearLibrary/linearTools/request/linearData/transactionData';
   import {
      formatEtherToNumber,
      formatNumber,
   } from '@/assets/linearLibrary/linearTools/format';
   import {getLiquids} from '@/assets/linearLibrary/linearTools/request';
   import currenciesList from '@/common/currency';

   export default {
      name: 'swap',
      components: {
         gasEditorSwap,
         watingEnhanceSwapNew,
         dropdownArrowSvg,
      },
      data() {
         return {
            formatterInput,
            setCursorRange,
            actionTabs: 'm0', //子页(m0输入页,m1交易页)
            swapNumber: null,

            activeItemBtn: -1,

            processing: false, // 处理状态, 防止重复点击

            floor: _.floor,

            errors: {amountMsg: ''},

            chainChangeTokenFromUnfreeze: '', //解冻切换钱包事件监听id
            chainChangeTokenFromSubscribe: '', //切换钱包事件监听id
            walletChangeTokenFromSubscribe: '', //切换钱包地址时间监听id

            formatNumber,

            currencyDropDown: false,
            currencyDropDownr: false,

            selectCurrencyIndex: 0,
            selectCurrencyKey: 'SHUM',

            currencies: [''],

            currentTitle: {}
         };
      },
      watch: {
         walletAddress() {
         },
         isEthereumNetwork() {
         },
         isBinanceNetwork() {
         },
         walletNetworkId() {
         },
         walletType() {
         },
         isMobile() {
         },
         diffSwapNumber() {
         },
         currency() {
         },
      },
      computed: {
         isEthereumNetwork() {
            return isEthereumNetwork(this.walletNetworkId);
         },

         isBinanceNetwork() {
            return isBinanceNetwork(this.walletNetworkId);
         },

         walletNetworkId() {
            return this.$store.state?.walletNetworkId;
         },

         walletAddress() {
            return this.$store.state?.wallet?.address;
         },

         swapDisabled() {
            return !this.swapNumber || this.processing;
         },

         walletType() {
            return this.$store.state?.walletType;
         },

         isMobile() {
            return this.$store.state?.isMobile;
         },

         diffSwapNumber() {
            return _.floor(this.swapNumber - this.currency?.frozenBalance, 4);
         },

         currency() {
            return this.currencies[this.selectCurrencyIndex];
         },
      },
      async created() {
         await this.initData();

         //监听链切换
         this.chainChangeTokenFromSubscribe = this.$pub.subscribe(
           'onWalletChainChange',
           async () => {

              console.log("xxl swap onWalletChainChange : " + this.actionTabs);

              if (this.actionTabs == 'm0') {
                 await this.initData();
              }
           }
         );

         this.walletChangeTokenFromSubscribe = this.$pub.subscribe(
           'onWalletAccountChange',
           async () => {
              if (this.actionTabs == 'm0') {
                 await this.initData();
              }
           }
         );
      },
      
      destroyed() {
         //清除事件,防止重复
         if (this.chainChangeTokenFromUnfreeze != '') {
            this.$pub.unsubscribe(this.chainChangeTokenFromUnfreeze);
         }

         if (this.chainChangeTokenFromSubscribe != '') {
            this.$pub.unsubscribe(this.chainChangeTokenFromSubscribe);
         }

         if (this.walletChangeTokenFromSubscribe != '') {
            this.$pub.unsubscribe(this.walletChangeTokenFromSubscribe);
         }
      },

      methods: {
         //设置初始列表
         initCurrencies() {
            this.currencies = [
               {
                  name: 'SHUM',
                  key: 'SHUM',
                  img: require('@/static/logoshum.jpg'),
                  balance: 0,
                  frozenBalance: 0,
                  totalBalance: 0,
               },
            ];
            this.selectCurrencyIndex = 0;

            //xxl bug 01
            // this.ethTitle = {
            // 	name: 'ETH',
            // 	img: require('@/static/ETH.svg'),
            // }


            // this.bscTitle = {
            // 	name: 'BSC',
            // 	img: require('@/static/bnb.svg'),
            // }
            // this.currentTitle = {
            // 	fromName:'BSC',
            // 	fromImg:require('@/static/bnb.svg'),
            // 	toName:"ETH",
            // 	toImg:require('@/static/ETH.svg')
            // }

         },

         async initData() {
            try {

               console.log("xxl99 initData : " + this.actionTabs);
               console.log("xxl this.walletNetworkId " + this.walletNetworkId);
               //xxl bug 01
               // if(isEthereumNetwork()){
               // 	console.log("***xxl come to ethereum network");
               // }else{
               // 	console.log("###xxl come to bsc network");
               // }
               if (this.walletNetworkId == 97 || this.walletNetworkId == 56) {
                  console.log("###xxl come to bsc network");
                  this.currentTitle = {
                     fromName: 'BSC',
                     fromImg: require('@/static/bnb.svg'),
                     toName: "ETH",
                     toImg: require('@/static/ETH.svg')
                  }
               } else {
                  console.log("***xxl come to ethereum network");
                  this.currentTitle = {
                     fromName: "ETH",
                     fromImg: require('@/static/ETH.svg'),
                     toName: 'BSC',
                     toImg: require('@/static/bnb.svg'),
                  }
               }


               this.currencyDropDown = false;
               this.currencyDropDownr = false;
               await this.initLiquidsList();
               await this.filterCurrencies();
            } catch (error) {
               this.initCurrencies();
               this.selectCurrencyKey = 'SHUM';
               console.log('initData error', error);
               this.processing = false;
            }
         },

         //初始化liquids列表
         async initLiquidsList() {
            this.processing = true;
            this.initCurrencies();
            const [linaBalance, liquids] = await Promise.all([
               lnrJSConnector.lnrJS.ShumFinance.balanceOf(this.walletAddress),
               getLiquids(this.walletAddress, true),
            ]);

            let liquidsList = liquids.liquidsList.map((item) => {
               const key = item.name;
               return {
                  name: currenciesList[key].name,
                  key,
                  balance: _.floor(item.balance, 4),
                  img: item.img,
                  frozenBalance: 0,
                  totalBalance: 0,
               };
            });

            this.currencies[0].balance = _.floor(bn2n(linaBalance), 4);
            this.currencies = [...this.currencies, ...liquidsList];
         },

         //充值当前index
         resetCurrencyIndex() {
            let index = _.findIndex(this.currencies, [
               'key',
               this.selectCurrencyKey,
            ]);
            this.selectCurrencyIndex = index != -1 ? index : 0;
            this.selectCurrencyKey = index != -1 ? this.currency.key : 'SHUM';
         },

         //过滤无余额的token
         async filterCurrencies() {
            //获取其他网络id
            let otherNetworkId = getOtherNetworks(this.walletNetworkId);

            let keyMap = this.currencies.map((item) => item.key);

            //获取冻结数据
            // let [currentArray, otherArray] = await Promise.all([
            //    lnr.userSwapAssetsCount({
            //       account: this.walletAddress,
            //       sourceKeyInArr: keyMap,
            //       networkId: this.walletNetworkId
            //    }),
            //    lnr.userSwapAssetsCount({
            //       account: this.walletAddress,
            //       sourceKeyInArr: keyMap,
            //       networkId: otherNetworkId
            //    })
            // ]);

            //xxl TODO
            let currentArray = [
               {
                  account: '0x11111',
                  source: 'ETH',
                  freeZeTokens: 0,
                  UnFreeZeTokens: 0,
               },
            ];
            let otherArray = [
               {
                  account: '0x11111',
                  source: 'ETH',
                  freeZeTokens: 0,
                  UnFreeZeTokens: 0,
               },
            ];
            //

            let currencies = this.currencies.filter((item) => {
               //查找数据
               console.log('xxl this.currencies.filter');
               console.log(item.key);
               console.log(currentArray);
               console.log(otherArray);

               let current = currentArray.find(
                 (currency) => item.key == currency.source
               );
               let other = otherArray.find(
                 (currency) => item.key == currency.source
               );

               //计算可以解冻的数量
               let currentFreeZeTokens = n2bn('0'),
                 otherUnFreeZeTokens = n2bn('0');

               current && (currentFreeZeTokens = current.freeZeTokens);
               other && (otherUnFreeZeTokens = other.UnFreeZeTokens);

               let frozenBalance = bnSub(
                 currentFreeZeTokens,
                 otherUnFreeZeTokens
               );

               item.frozenBalance = frozenBalance.gt(n2bn('0'))
                 ? _.floor(formatEtherToNumber(frozenBalance), 4)
                 : null;

               //总额
               item.totalBalance = item.balance + item.frozenBalance;

               return item.key == 'SHUM' || item.totalBalance > 0;
            });

            this.currencies = [...currencies];

            this.resetCurrencyIndex();

            this.swapNumber = this.currency.frozenBalance;

            this.processing = false;
         },

         //获取冻结余额
         async getCurrencyBalance() {
            try {
               this.processing = true;

               //获取其他网络id
               let otherNetworkId = getOtherNetworks(this.walletNetworkId);

               let contract;
               if (this.currency.key == 'SHUM') {
                  console.log('xxl getCurrencyBalance SHUM');
                  contract = lnrJSConnector.lnrJS.ShumFinance;
                  console.log(contract);
               } else {
                  console.log('xxl getCurrencyBalance other ');
                  console.log(this.currency.key);

                  contract = lnrJSConnector.lnrJS[this.currency.key];
               }

               //获取当前和其他网络冻结数据
               const [current, other, balance] = await Promise.all([
                  lnr.userSwapAssetsCount({
                     account: this.walletAddress,
                     source: this.currency.key,
                     networkId: this.walletNetworkId,
                  }),
                  lnr.userSwapAssetsCount({
                     account: this.walletAddress,
                     source: this.currency.key,
                     networkId: otherNetworkId,
                  }),
                  contract.balanceOf(this.walletAddress),
               ]);

               let currentFreeZeTokens = n2bn('0'),
                 otherUnFreeZeTokens = n2bn('0');
               current.length &&
               (currentFreeZeTokens = current[0].freeZeTokens);
               other.length && (otherUnFreeZeTokens = other[0].UnFreeZeTokens);

               //计算可以解冻的数量
               const frozenBalance = bnSub(
                 currentFreeZeTokens,
                 otherUnFreeZeTokens
               );

               this.currency.frozenBalance = this.swapNumber = frozenBalance.gt(
                 n2bn('0')
               )
                 ? _.floor(formatEtherToNumber(frozenBalance), 4)
                 : null;

               this.currency.balance = bn2n(balance, 4);
            } catch (error) {
               this.swapNumber = null;
               console.log(error, 'getCurrencyBalance error');
            } finally {
               this.processing = false;
            }
         },

         async clickSwap() {
            try {
               if (!this.swapDisabled) {
                  console.log("xxl99 clickSwap ...");
                  this.processing = true;
                  this.actionTabs = 'm1'; //进入swap页
               }
            } catch (error) {
               console.log(error, 'clickSwap error');
            } finally {
               this.processing = false;
            }
         },

         async changeSelectCurrencyIndex(index) {
            this.selectCurrencyIndex = index;
            this.selectCurrencyKey = this.currency.key;
            this.currencyDropDown = false;
            this.currencyDropDownr = false;
            this.activeItemBtn = -1;
            this.swapNumber = null;
            await this.getCurrencyBalance();
         },

         //点击最大
         clickMaxAmount() {
            this.activeItemBtn = 0;
            this.swapNumber = _.floor(this.currency.totalBalance, 4);

            var el = document.getElementById('transfer_number_input');
            this.setCursorRange(el, 0, 0);
         },

         //获取焦点
         inputFocus(index) {
            this.$nextTick(() => {
               let currentElement = this.$refs['itemInput' + index].$el;
               let parentElement = findParents(currentElement, 'swapInputBox');
               addClass(parentElement, 'active');
            });
         },

         //失去焦点
         inputBlur(index) {
            this.$nextTick(() => {
               let currentElement = this.$refs['itemInput' + index].$el;
               let parentElement = findParents(currentElement, 'swapInputBox');
               removeClass(parentElement, 'active');
            });
         },

         async close() {
            this.actionTabs = 'm0';
            await this.initData();
         },
      },
   };
</script>

<style lang="scss">
   #swap {

      .actionTabs {
         .ivu-tabs-bar {
            display: none;
         }

         .ivu-tabs-content {
            background: #fff;

            .ivu-tabs-tabpane {
               width: 786px;
               height: 840px !important;

               .waitingBox,
               .successBox,
               .failBox {
                  width: 100%;
                  height: 100%;
               }

               .swapBox {
                  position: relative;
                  padding: 0 68px;
                  width: 736px;
                  height: 680px;
                  background: #FFFFFF;
                  border-radius: 16px;

                  .actionBody {
                     display: flex;
                     flex-direction: column;
                     align-items: flex-start;

                     .actionTitle {
                        margin: 40px 0 0 -4px;
                        font-family: Gilroy-Bold;
                        font-size: 24px;
                        font-weight: bold;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.25;
                        letter-spacing: normal;
                        text-align: left;
                        color: #5a575c;
                     }

                     .actionDesc {
                        margin: 12px 0 0 0;
                        font-family: Gilroy-Regular;
                        font-size: 14px;
                        font-weight: normal;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.29;
                        letter-spacing: normal;
                        text-align: center;
                        color: #99999a;
                     }

                     .swapInputBox {
                        width: 100%;
                        //  transition: $animete-time linear;
                        margin-top: 64px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        position: relative;
                        margin-bottom: 24px;

                        /*&:hover,*/
                        /*&.active {*/
                        /*   box-shadow: 0 2px 12px #deddde;*/
                        /*   border-color: white;*/
                        /*}*/

                        &.error {
                           border-color: #df434c;
                        }

                        .iconBox {
                           width: 100%;
                           height: 60px;
                           display: flex;
                           flex-direction: row;
                           align-items: center;
                           justify-content: flex-start;

                           .popselect {
                              // background-color: #f6f5f6;
                              // width: 200px;
                              // height: 60px;
                              // border-radius: 5px;
                              display: flex;
                              align-items: center;
                              width: 168px;
                              height: 48px;
                              background: #F2F5FA;
                              border-radius: 8px;

                              .icon {
                                 margin-left: 16px;
                                 margin-right: 8px;
                                 width: 32px;
                                 height: 32px;
                                 border-radius: 100%;

                                 // margin img {
                                 // 	width: 100%;
                                 // 	height: 100%;
                                 // }
                              }

                              .name {
                                 font-family: Gilroy-Bold;
                                 text-align: center;
                                 font-size: 18px;
                                 line-height: 60px;
                                 letter-spacing: 0;
                                 cursor: pointer;

                                 .ivu-poptip-rel {
                                    display: flex;
                                    justify-content: space-around;
                                    align-items: center;
                                    width: 95px;
                                    font-size: 14px;
                                    line-height: 24px;

                                    #dropdownArrowSvg {
                                       margin-left: 16px;
                                    }
                                 }

                                 .ivu-poptip-arrow {
                                    display: none;
                                 }

                                 .ivu-poptip-body {
                                    display:none;
                                    width: 400px;
                                    height: 200px;
                                    padding: 0;
                                    border-radius: 10px;
                                    position: absolute;
                                    top: -13px;
                                    left: -16px;
                                    background-color: #f1f7ff;
                                    border-color: #ffffff;
                                    box-shadow: 0 2px 12px #deddde;

                                    .ivu-poptip-body-content {
                                       max-height: 200px;
                                       border-radius: 10px;
                                       width: 200px;

                                       .currencyItem {
                                          display: flex;
                                          align-items: center;
                                          padding: 10px;

                                          .itemIcon {
                                             width: 40px;
                                             height: 40px;
                                             margin-right: 17px;
                                          }

                                          .itemName {
                                             font-family: Gilroy-Bold;
                                             font-size: 16px;
                                             font-weight: bold;
                                             font-stretch: normal;
                                             font-style: normal;
                                             line-height: 1.5;
                                             letter-spacing: normal;
                                             color: #5a575c;
                                          }

                                          &.selected {
                                             width: 200px;
                                             height: 60px;
                                             margin: 0;
                                             background-color: #ffffff;

                                             .itemName {
                                                color: #000000;
                                             }
                                          }

                                          &:hover {
                                             &:not(.selected) {
                                                .itemName {
                                                   color: #1a38f8;
                                                }
                                             }
                                          }
                                       }
                                    }
                                 }
                              }
                           }
                        }

                        .divider {
                           margin-top: 24px;
                           width: 100%;
                           height: 0px;
                           background-color: #ffffff;
                        }

                        .arrow {
                           margin: 0 24px;
                        }

                        .inputBox {
                           display: flex;
                           flex-direction: row;
                           padding: 16px 24px;
                           width: 100%;
                           align-items: center;
                           border-radius: 8px;
                           box-shadow: 0 0 0 #deddde;
                           border: 1px solid #deddde;
                           transition: $animete-time linear;

                           &:hover,
                           &.active {
                              box-shadow: 0 2px 12px #deddde;
                              border-color: white;
                           }

                           .label {
                              .amount {
                                 font-family: Arial;
                                 font-weight: bold;
                                 font-size: 14px;
                                 line-height: 24px;
                                 color: #111B47;
                              }
                           }

                           .max {
                              font-family: Arial;
                              font-weight: bold;
                              font-size: 16px;
                              line-height: 24px;
                              color: #4B72F0;
                              text-align: center;
                              cursor: pointer;

                              &:hover {
                                 opacity: 1;
                              }

                              &.active {
                                 opacity: 1;
                              }
                           }

                           .input {
                              flex: 1;
                              border: none;
                              box-shadow: none;

                              .ivu-input-number-handler-wrap {
                                 display: none;
                              }

                              .ivu-input-number-input {
                                 text-align: right;
                                 font-family: Gilroy-bold;
                                 font-size: 32px;
                                 line-height: 24px;
                                 font-weight: bold;
                                 font-stretch: normal;
                                 font-style: normal;
                                 letter-spacing: normal;
                                 color: #5a575c;

                                 &::placeholder {
                                    color: #9EA5B7;
                                 }
                              }
                           }
                        }
                     }

                     .someWrong {
                        color: #df434c;
                        font-family: Gilroy;
                        font-weight: 700;
                        font-size: 12px;
                        text-transform: uppercase;
                     }

                     #gasEditorSwap {
                        .source, .target {
                           margin-top: 0;
                        }
                     }

                     #gasEditor {
                        margin-top: 204px;
                     }
                  }

                  .swapBtn {
                     margin-top: 64px;
                     padding: 10px;
                     width: 600px;
                     height: 48px;
                     text-align: center;
                     font-size: 18px;
                     line-height: 28px;
                     color: #FFFFFF;
                     background: #4B72F0;
                     border-radius: 8px;

                     &:hover {
                        &:not(.disabled) {
                           background-color: #7eb5ff;
                        }
                     }

                     &.disabled {
                        opacity: 0.1;
                        cursor: not-allowed;
                     }

                     &.swapBtnActivited {
                        opacity: unset;
                     }
                  }
               }
            }
         }
      }
   }

   @media only screen and (max-width: $max-phone-width) {
      #swap {
         
         height: 100%;

         .actionTabs {
            height: 100%;

            .ivu-tabs-content {
               height: 100%;

               .ivu-tabs-tabpane {
                  width: 100%;
                  height: 100% !important;
                  min-height: 516px;

                  .swapBox {
                     padding-top: 24px;

                     .actionBody {
                        height: calc(100% - 48px);
                        overflow-y: auto;
                        padding: 20px 22px 44px;
                        margin: 0 10px;

                        .someWrongMobile {
                           border-radius: 8px;
                           background-color: rgba(#df434c, 0.05);
                           padding: 12px 16px;
                           display: flex;
                           align-items: center;
                           margin-bottom: 16px;
                           margin-top: -20px;

                           .errIcon {
                              margin-right: 12px;
                              width: 24px;
                              height: 24px;
                           }

                           .errMessage {
                              font-family: Gilroy-Medium;
                              font-size: 12px;
                              font-weight: 500;
                              font-stretch: normal;
                              font-style: normal;
                              line-height: 1.33;
                              letter-spacing: normal;
                              color: #df434c;
                           }
                        }

                        .swapInputBox {
                           width: 100%;
                           margin-top: 0;
                           margin-bottom: 16px;

                           .iconBox {
                              .avaliable {
                                 font-family: Gilroy-Medium;
                                 font-size: 12px;
                                 font-weight: 500;
                                 font-stretch: normal;
                                 font-style: normal;
                                 line-height: 1.33;
                                 letter-spacing: normal;
                                 text-align: center;
                                 color: #99999a;
                              }
                           }

                           .inputBox {
                              padding: 16px;

                              .label {
                                 flex: 1;

                                 .amount {
                                    font-family: Gilroy-Medium;
                                    font-size: 12px;
                                    font-weight: 500;
                                    line-height: 1.33;
                                    color: #99999a;
                                 }

                                 .input {
                                    width: 100%;

                                    .ivu-input-number-input {
                                       padding: 0;
                                       text-align: left;
                                       font-size: 16px;
                                       line-height: 1.5;
                                    }
                                 }
                              }

                              .max {
                                 margin-left: 16px;
                                 border-radius: 8px;
                                 border: solid 1px #e5e5e5;
                                 padding: 14px 24px;
                                 font-family: Gilroy-Bold;
                                 font-size: 10px;
                                 font-weight: bold;
                                 font-stretch: normal;
                                 font-style: normal;
                                 line-height: 1.6;
                                 letter-spacing: 1.25px;
                                 text-align: center;
                                 color: #1a38f8;
                              }
                           }
                        }
                     }

                     .swapBtn {
                        height: 48px;
                        font-size: 16px;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.5;
                        letter-spacing: 2px;
                     }
                  }
               }
            }
         }
      }
   }
</style>
