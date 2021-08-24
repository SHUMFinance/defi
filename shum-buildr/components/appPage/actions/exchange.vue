<template>
	<div id="exchange">
		<!-- {{ $store.state.currentAction }} -->
		<div class="mian box">
			<div class="market">
				<div class="title">MARKET</div>
				<z-input value="0" placeholder="SEARCH">
					<template v-slot:prefix>
						<img src="@/static/appPage/search.png" alt="">
					</template>
				</z-input>
				<div class="customTable">
					<div class="tabelHeader">
						<div class="th sort pair">
							<img src="@/static/appPage/sort.png" alt="">Pair
						</div>
						<div class="th sort price">
							<img src="@/static/appPage/sort.png" alt="">Price
						</div>
						<div class="th sort change">
							<img src="@/static/appPage/sort.png" alt="">Change
						</div>
						<div class="th star">
							<img src="@/static/appPage/star.png" alt="">
						</div>
					</div>
					<div class="hasData">
						<div class="tableBody">
							<div
								class="tr"
								v-for="index in 50"
								:key="index"
							>
								<div class="td pair">
									<img src="@/static/appPage/round.png" alt="">
									<IconName />
								</div>
								<div class="td price">
									$1.7324
								</div>
								<div class="td change" >
									<template v-if="Math.random() > 0.5">
										<img src="@/static/appPage/up.png" alt="">
										<span style="color:#108C1C">0.48%</span>
									</template>
									<template v-else>
										<img src="@/static/appPage/down.png" alt="">
										<span style="color:#DA3620">- 2.43%</span>
									</template>
								</div>
								<div class="td star" >
									<img v-if="Math.random() > 0.5" src="@/static/appPage/star.png" alt="">
									<img v-else src="@/static/appPage/star1.png" alt="">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="quotation">
				<div class="market-pair">
					<div class="title">MARKET  PAIR</div>
					<div class="name">
						<img src="@/static/appPage/round.png" alt="">
						<IconName :size="24"/>
						<img src="@/static/appPage/star.png" alt="">
					</div>
					<div class="info">
						<div class="item">
							<span>$1.9409</span>
							<span>24H High</span>
						</div>
						<div class="item">
							<span>$1.6677</span>
							<span>24H Low</span>
						</div>
						<div class="item">
							<span>$63,048.9794</span>
							<span>24H Volume</span>
						</div>
						<div class="item">
							<span>
								<img src="@/static/appPage/up.png" alt="">
								<span style="color:#108C1C">0.48%</span>
							</span>
							<span>% Changes</span>
						</div>
						<div class="price">$113,00</div>
					</div>
					<div class="chart">
						<div class="draw-tool">
							<div>
								<img src="@/static/appPage/chart/1_off.svg" alt="">
								<img src="@/static/appPage/chart/2.svg" alt="">
								<img src="@/static/appPage/chart/3.svg" alt="">
								<img src="@/static/appPage/chart/4.svg" alt="">
								<img src="@/static/appPage/chart/5.svg" alt="">
								<img src="@/static/appPage/chart/6.svg" alt="">
								<img src="@/static/appPage/chart/7.svg" alt="">
								<img src="@/static/appPage/chart/8.svg" alt="">
							</div>
							<div>
								<img src="@/static/appPage/chart/9.svg" alt="">
								<img src="@/static/appPage/chart/10.svg" alt="">
							</div>
						</div>
						<div>
							<div class="chart-container" id="chart"></div>
							<div class="time-tool">
								<div class="time-range">
									<span style="color:#4B72F0">Day</span>
									<span>Week</span>
									<span>Month</span>
									<span>Year</span>
									<span>All</span>
								</div>
								<div class="series-control">
									<span class="date">
										18:17:05（UTC+8）
									</span>
									<span>%</span>
									<span>log</span>
									<span style="color:#4B72F0">auto</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="trade-order">
					<div class="title">TRADE  ORDER</div>
					<div class="customTable">
						<div class="tabelHeader">
							<div class="th sort time">
								<img src="@/static/appPage/sort.png" alt="">Date/Time
							</div>
							<div class="th sort pair">
								<img src="@/static/appPage/sort.png" alt="">Pair
							</div>
							<div class="th sort buying">
								<img src="@/static/appPage/sort.png" alt="">Buying
							</div>
							<div class="th sort selling">
								<img src="@/static/appPage/sort.png" alt="">Selling
							</div>
							<div class="th sort free">
								<img src="@/static/appPage/sort.png" alt="">Free
							</div>
							<div class="th sort s">
								<img src="@/static/appPage/sort.png" alt=""> S
							</div>
						</div>
						<div class="hasData">
							<div class="tableBody">
								<div
									class="tr"
									v-for="index in 2"
									:key="index"
								>
									<div class="td time">
										2021/07/28  16:30:26
									</div>
									<div class="td pair">
										<img src="@/static/appPage/round.png" alt="">
										<IconName />
									</div>
									<div class="td buying">
										$1.7324
									</div>
									<div class="td selling">
										$1.7324
									</div>
									<div class="td free">
										$1.7324
									</div>
									<div class="td s" >
										<template v-if="Math.random() > 0.5">
											<img src="@/static/appPage/up.png" alt="">
											<span style="color:#108C1C">0.48%</span>
										</template>
										<template v-else>
											<img src="@/static/appPage/down.png" alt="">
											<span style="color:#DA3620">- 2.43%</span>
										</template>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="left-side">
			<div class="trade-asset box">
				<div class="box-continer">
					<div class="title">Wallet Balance</div>
				</div>
				<z-button size="large">
					BUY sUSD
				</z-button>
				<z-button size="large">
					BUILD sUSD
				</z-button>
			</div>
			<div class="order box">
				<div class="box-continer">
					<div class="title">MARKET ORDER</div>
					<div class="floor buy-or-sell">
						<div class="floor-continer">
							<z-button shape="round">
								BUY sADA
							</z-button>
							<z-button shape="round">
								SELL sADA
							</z-button>
						</div>
					</div>
					<div class="floor buy-or-sell">
						<div class="floor-continer floor-title">
							Minimum Received
						</div>
						<z-input value="0" placeholder="placeholder" suffix="sUSD"></z-input>
						<div class="tag-box">
							<span class="tag">25%</span>
							<span class="tag">50%</span>
							<span class="tag">75%</span>
							<span class="tag">MAX</span>
						</div>
					</div>
					<div class="floor">
						<div class="floor-continer floor-title">
							Market  Price
						</div>
						<z-input value="1.7325" placeholder="placeholder">
							<template v-slot:suffix>
								<img src="@/static/appPage/refresh.png" alt="">
							</template>
						</z-input>
					</div>
					<div class="floor">
						<div class="floor-continer floor-title">
							Market  Price
						</div>
						<z-input value="0 sADA" placeholder="placeholder"></z-input>
					</div>
					<div class="floor fee">
						<div class="floor-continer">
							<div class="fee-item">
								<span>Fee</span>
								<span>0    USD（0.25%)</span>
							</div>
							<div class="fee-item">
								<span>Gas  Price</span>
								<span>5 GWEI</span>
							</div>
							<div class="fee-item">
								<span>Minimum Received</span>
								<span>0 sADA</span>
							</div>
						</div>
					</div>
					<z-button size="large">
						CONNECT WALLET
					</z-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
 import echarts from "echarts";

const ZButton  = {
	props: {
		shape: String,
		size: String
	},
	render: function(h) {
		return h('button', {
			'class': {
				'z-btn': true,
				'z-btn-round': this.shape === 'round',
				'z-btn-sm': this.size === 'small',
				'z-btn-lg': this.size === 'large'
			}
		}, [
			h('span', this.$slots.default)
		])
	}
}

const ZInput  = {
	props: {
		placeholder: String,
		prefix: String,
		suffix: String,
		size: String
	},
	data: function() {
		return {
			isFocused: false
		}
	},
	methods: {
		handleInputFocus: function handleInputFocus(e) {
			this.isFocused = true;
			// [todo]
			// this.$el.focus()
			// this.onFocus && this.onFocus(e);
		},
		handleInputBlur: function handleInputBlur(e) {
			this.isFocused = false;
			// this.$el.blur()
			// this.onBlur && this.onBlur(e);
		},
		renderInput: function(h) {
			return h('input', {
				'class': {
					'z-input': true,
					'z-input-sm': this.size === 'small',
					'z-input-lg': this.size === 'large'
				},
				on: {
					focus: this.handleInputFocus,
					blur: this.handleInputBlur
				},
				domProps: {
					placeholder: this.placeholder
				}
			});
		},
		getComponent(prop) {
			const com = this.$slots[prop] || this[prop] || undefined;
			return com;
		}
	},
	render: function(h) {
		let prefix = this.getComponent('prefix');
		prefix = prefix ? h('span', {
			'class': {
				'z-input-prefix': true
			}
		}, [prefix]) : null;
		let suffix = this.getComponent('suffix');
		suffix = suffix ? h('span', {
			'class': {
				'z-input-suffix': true
			}
		}, [suffix]) : null;
		if (prefix || suffix) {
			return h('span', {
				'class': {
					'z-input-affix-wrapper': true,
					'z-input-affix-wrapper-focused': this.isFocused,
					'z-input-affix-wrapper-sm': this.size === 'small',
					'z-input-affix-wrapper-lg': this.size === 'large'
				}
			}, [
				prefix,
				this.renderInput(h),
				suffix
			])
		} else {
			return this.renderInput(h);
		}
	}
}

const IconName = {
	props: {
		size: Number
	},
	render: function(h) {
		return h('span', {
			'class': 'icon-name',
			style: {
				color: '#343B55',
				fontSize: this.size ? `${this.size}px` : 'inherit'
			}
		}, [
			h('span', ['sADA']),
			h('span', {
				style: {
					display: 'inline-block',
					marginLeft: '4px',
					color: '#ACB1C7'
				}
			},['sUSD'])
		])
	}
}
export default {
	name: 'Exchange',
	components: { ZButton, ZInput, IconName },
	mounted: function () {
		this.lineChart();
	},
	methods: {
		 lineChart() {
			// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
			const data = splitData([
				['8am', 2320.26,2320.26,2287.3,2362.94],
				['10am', 2300,2291.3,2288.26,2308.38],
				['2pm', 2295.35,2346.5,2295.35,2346.92],
				['6pm', 2347.22,2358.98,2337.35,2363.8]
			]);
			function splitData(rawData) {
				const categoryData = [];
				const values = []
				for (let i = 0; i < rawData.length; i++) {
					categoryData.push(rawData[i].splice(0, 1)[0]);
					values.push(rawData[i])
				}
				return {
					categoryData: categoryData,
					values: values
				};
			}
			const upColor = '#ec0000';
			const upBorderColor = '#8A0000';
			const downColor = '#00da3c';
			const downBorderColor = '#008F28';

            this.myChart = echarts.init(document.getElementById('chart'));
            this.myChart.setOption({
				title: {
					text: '1.8478',
					left: 0
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					}
				},
				xAxis: {
					type: 'category',
					data: ['8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'],
					scale: false,
					boundaryGap: false,
					axisLine: { show: false },
					splitLine: { show: false },
				},
				yAxis: {
					scale: true,
					position: 'right',
					axisLine: { show: false },
					minorTick: { show: false },
					axisTick: { show: false },
					minorSplitLine: { show: false },
					splitArea: {
						show: false
					}
				},
				series: [
					{
						name: '',
						type: 'candlestick',
						data: data.values,
						itemStyle: {
							width: 2,
							color: upColor,
							color0: downColor,
							borderColor: upBorderColor,
							borderColor0: downBorderColor
						}
					}]
			})
         },
	}
}
</script>

<style lang="scss">
#exchange {
	position: absolute;
	top: 0;
	left: -100px;
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
		.market {
			padding: 5px 10px 14px 24px;
			width: 369px;
			border-right: 1px solid #E0E5F0;
			.title {
				margin-left: 8px;
				margin-bottom: 16px;
			}
			> .z-input-affix-wrapper {
				margin-bottom: 24px;
				padding: 11px 15px;
				width: 320px;
				font-size: 14px;
				.z-input-prefix {
					margin-right: 11px;
					line-height: 16px;
				}
				.z-input {
					line-height: 16px;
				}
				>input::placeholder {
					font-family: Apple LiGothic;
					// line-height: 14px;
					letter-spacing: 0.245em;
					text-align: left;
				}
			}
			.customTable {
				.sort img {
					margin-right: 4px;
				} 
				.tableBody {
					padding-right: 10px;
					height: 568px;
				}
				.pair {
					display: flex;
					align-items: center;
					width: 146px;
					>img {
						margin-right: 8px;
					}
				}
				.price {
					width: 54px;
				}
				.change {
					width: 64px;
				}
				.star {
					width: 18px;
					text-align: center;
				}
			}
		}
		.quotation {
			flex: 1;
			padding: 5px 31px 0 28px;
			display: flex;
			flex-direction: column;
			.market-pair {
				.name {
					display: flex;
					align-items: center;
					margin-bottom: 24px;
					img:first-child {
						margin-right: 16px;
						width: 32px;
						height: 32px;
					}
					
					img:last-child {
						margin-left: 6px;
						width: 14px;
						height: 14px;
					}
				}
				.info {
					margin-bottom: 24px;
					.item {
						display: inline-flex;
						flex-direction: column;
						margin-right: 8px;
						padding: 2px 14px;
						height: 40px;
						
						color: #4F4D51;
						letter-spacing: 0px;
						text-align: left;

						border: 1px solid #D5DCEB;
						box-sizing: border-box;
						border-radius: 8px;
					}
					.price {
						float: right;
						font-family: Avenir Next;
						font-size: 24px;
						font-weight: 700;
						line-height: 32px;
						letter-spacing: 0;
						text-align: right;
					}
				}
				.chart {
					display: flex;
					box-sizing: border-box;
					margin-bottom: 24px;
					height: 344px;
					background: #FFFFFF;
					border: 1px solid #E0E5F0;
					.draw-tool {
						padding: 0 10px;
						width: 48px;
						border-right: 1px solid #E0E5F0;
						>div:first-child {
							height: 265px;
							border-bottom: 1px solid #E0E5F0;
						}
						>div {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							align-items: center;
							padding: 10px 0;
						}
					}
					>div:last-child {
						flex: 1;
					}
					.chart-container {
						box-sizing: border-box;
						height: 300px;
						border-bottom: 1px solid #E0E5F0;
					}
					.time-tool {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0 20px 0 24px;
						height: 45px;
						.time-range {
							font-size: 14px;
							font-weight: 700;
							line-height: 32px;
							letter-spacing: 0.004em;
							text-align: center;
							span {
								display: inline-block;
								margin-right: 16px;
							}
						}
						.series-control {
							font-family: Avenir Next;
							font-size: 11px;
							font-style: normal;
							font-weight: 700;
							line-height: 32px;
							letter-spacing: 0.07em;
							text-align: left;
							span {
								display: inline-block;
								margin-left: 8px;
							}
							>span:first-child {
								padding-right: 8px;
								border-right: 1px solid #E0E5F0;
							}
						}
					}
				}
			}
			.market-pair, .trade-order {
				.title {
					margin-left: 3px;
					margin-bottom: 16px;
				}
				.customTable {
					margin-left: 10px;
					white-space: nowrap;
					.tabelHeader, .tableBody .tr {
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
					.buying, .selling, .free {
						flex: 1;
					}
					.s {
						width: 71px;
						text-align: center;
					}
				}
			}
		}
	}
	.left-side {
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
		.trade-asset {
			height: 176px;
			.z-btn:nth-of-type(n+2) {
				margin-top: 8px;
			}
		}
		.order {
			margin-top: 24px;
			height: 553px;
			.buy-or-sell {
				.z-btn {
					width: 114px;
					&:nth-of-type(1) {
						font-weight: 700;
						color: #4B72F0;
						background: #ECF1FF;
						border-color: #ECF1FF;
					}
					&:nth-of-type(2) {
						margin-left: 13px;
						color: #8B8B8C;
						background: #F2F2F2;
						border-color: #F2F2F2;
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
					color: #B9C0CD;
					font-size: 11px;
					line-height: 19px;
					background: #E0E5F0;
					border-radius: 4px;
					&:nth-of-type(n+2) {
						margin-left: 10px;
					}
				}
			}
			.floor.fee {
				margin-top: -8px;
				margin-bottom: 16px;
				.fee-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #8B8B8C;
					line-height: 24px;
				}
			}
			.floor {
				margin-bottom: 24px;
				.floor-continer {
					padding: 0 8px;
				}
				.floor-title {
					margin-bottom: 6px;
					font-weight: 700;
					line-height: 24px;
				}
			}
		}
		.z-btn {
			width: 100%;
		}
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
.z-btn {
    display: inline-block;
    padding: 0 15px;
	height: 32px;

    font-size: 14px;
    white-space: nowrap;
    text-align: center;
	color: #fff;

    background-image: none;
	border-radius: 8px;
	background-color: #4B72F0;
    border: 1px solid #4B72F0;
	transition: .2s linear;

    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
	&.z-btn-round {
		border-radius: 16px;
	}
	&.z-btn-lg {
		height: 48px;
	}
	&.z-btn-sm {
		height: 16px;
	}
	&:not(.disabled):hover {
		background-color: #7eb5ff;
		border-color: #7eb5ff;
	}
}
.z-input,.z-input-affix-wrapper {
    position: relative;
	box-sizing: border-box;
    margin: 0;
	display: inline-block;
    padding: 5px 8px 4px 16px;
    width: 100%;
    list-style: none;
   
    color: #111B47;
    font-size: 14px;
    line-height: 24px;
	font-variant: tabular-nums;
    font-feature-settings: tnum;

    background-color: #fff;
    background-image: none;
    border: 1px solid #E0E5F0;
    border-radius: 8px;

	touch-action: manipulation;
    transition: all .3s;
	&::placeholder {
		color: #E0E5F0;
	}
	&:placeholder-shown {
		text-overflow: ellipsis;
	}
	&:focus {
		border-color: #40a9ff;
		border-right-width: 1px!important;
		outline: 0;
		box-shadow: 0 0 0 2px rgba(24, 144, 255, .2);
	}
}
.z-input-affix-wrapper {
    display: inline-flex;
 	.z-input-prefix, .z-input-suffix {
		display: flex;
		align-items: center;
		color: #111B47;
		white-space: nowrap;
	}
	.z-input-prefix {
		margin-right: 11px;
	}
	.z-input-suffix {
		margin-left: 11px;
	}
	> input.z-input {
		padding: 0;
		border: none;
		border-radius: 0;
		outline: 0;
		text-align: inherit;
		&:focus {
			border: none;
			outline: 0;
			box-shadow: none;
		}
	}
	&:focus, &.z-input-affix-wrapper-focused {
		border-color: #40a9ff;
		border-right-width: 1px!important;
		outline: 0;
		box-shadow: 0 0 0 2px rgba(24, 144, 255, .2);
	}
}
input[type=number], input[type=password], input[type=text], textarea {
    -webkit-appearance: none;
}

 .customTable {
	color: #343B55;
	.tabelHeader {
		display: flex;
		height: 40px;
		padding: 0 16px;
		padding-right: 15px + 16px;
		.th {
			display: flex;
			align-items: center;
			color: #ACB1C7;
		}
	}
	.hasData {
		.tableBody {
			overflow-y: auto;
			.tr {
				display: flex;
				align-items: center;
				padding: 0 16px;
				margin-bottom: 4px;
				height: 40px;
				cursor: default;
				background: #F9FAFF;
				border-radius: 8px;
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
