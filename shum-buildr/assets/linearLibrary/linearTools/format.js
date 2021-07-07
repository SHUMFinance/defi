import numbro from "numbro";
import { BigNumber, utils } from "ethers";
import { DECIMAL_PRECISION } from "@/common/bnCalc";
import _ from "lodash";

//格式化bigNumber到number
// export const formatEtherToNumber = val => {
//     if (_.isArray(val)) {
//         return val.map(item => Number(utils.formatEther(item)));
//     } else {
//         if (!val || !Number(val)) return 0;
//         return Number(utils.formatEther(val));
//     }
// };

//格式化bigNumber到number(向下取数值)
export const formatEtherToNumber = val => {
    if (_.isArray(val)) {
        return val.map(item => floorBigNumber(item));
    } else {
        if (!val || !Number(val)) return 0;
        return floorBigNumber(val);
    }
};

//数字千分位
export const formatNumber = (val, decimals = DECIMAL_PRECISION) => {
    if (!val || !Number(val)) return 0;
    return numbro(_.floor(val, decimals)).format("0,0." + "0".repeat(decimals));
};

//大数转千分位
export const formatNumberFromBigNumber = (val, decimals = DECIMAL_PRECISION) => {
    if (!val || !Number(val)) return 0;
    return numbro(_.floor(floorBigNumber(val), decimals)).format(
        "0,0." + "0".repeat(decimals)
    );
};

//文本转byte32
export const formatStringToByte32 = text => {
    return utils.hexlify(utils.zeroPad(utils.toUtf8Bytes(text.toString()), 32));
};

//钱包地址转byte32
export const formatAddressToByte32 = address => {
    return utils.hexlify(utils.zeroPad(address, 32));
};

//钱包地址缩略, 例: 0x1234...7890
export const abbreviateAddress = (address, omit = 4) => {
    if (!address) return "";
    return address.substr(0, 6) + ".".repeat(omit) + address.substr(-4, 4);
};

//将大数向下取指定位数(防止过长小数导致精度的问题)
export const floorBigNumber = val => {
    if (!BigNumber.isBigNumber(val) || val.isZero()) return 0;
    val = utils.formatEther(val.toString());
    let arr = val.split("."),
        res;
    let MAX_LENGTH = 16;
    if (arr.length == 2) {
        let decimalLength = MAX_LENGTH - arr[0].length;
        res =
            arr[0].toString() +
            "." +
            arr[1].toString().substr(0, decimalLength);
    } else if (arr.length == 1) {
        res = arr[0];
    } else {
        res = 0;
    }
    return Number(res);
};
