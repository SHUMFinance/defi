import _ from 'lodash';

let SUBPAGE_OPTIONS = {
	dashboard:1,
	exchange:2,
	build: 3,
	burn: 4,
	claim: 5,
	transfer: 6,
	swap: 7
};

let WALLET_DETAILS_OPTIONS = {
	referral: 'referral',
	transaction: 'transaction',
	track: 'track',
};

let common = {
	//基础url前缀
	baseUrl: process.env.BACKEND_API,

	walletDetailsRefreshTimeout: 10000, //钱包面板刷新间隔(毫秒)

	SUBPAGE_OPTIONS,
	SUBPAGE_OPTIONS_MAP: _.invert(SUBPAGE_OPTIONS),

	WALLET_DETAILS_OPTIONS,
};

export default common;
