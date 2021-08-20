import _ from "lodash";

export const UNDERFLOW = 0.000000000000000001; //最小
export const OVERFLOW = 1000000000000000000; //最大
export const DECIMAL_LENGTH = 2; //小数位长度

/**
 * 数字是否溢出
 * @param {*} num
 */
export const numberFlow = num => {
    return _.lt(num, UNDERFLOW) || _.gt(num, OVERFLOW);
};
