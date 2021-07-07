import _ from "lodash";

export const GAS_LIMIT_BUFFER = 0.5; //50%

export const GWEI_UNIT = 1000000000;

export const NETWORK_SPEEDS = ["SLOW", "MEDIUM", "FAST",'CUSTOM'];

export const NETWORK_SPEEDS_TO_KEY = _.keyBy(NETWORK_SPEEDS, val => val);

export const TOKEN_ALLOWANCE_LIMIT = 100000000;
