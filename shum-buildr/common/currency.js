const currencies = {
    sUSD: {
        name: "sUSD",
        fullName: "sUSD",
        type: "crypto"
    },
    sBTC: {
        name: "sBTC",
        fullName: "Liquid Bitcoin",
        type: "crypto"
    },
    sETH: {
        name: "sETH",
        fullName: "Liquid Ether",
        type: "crypto"
    },
    //lBCH: {
    //    name: "sBCH",
    //    fullName: "sBCH",
    //    type: "crypto"
    //},
    //lEOS: {
    //    name: "sEOS",
    //    fullName: "sEOS",
    //    type: "crypto"
    //},
    //lLTC: {
    //    name: "sLTC",
    //    fullName: "sLTC",
    //    type: "crypto"
    //},
    // sXRP: {
    //     name: "sXRP",
    //     fullName: "sXRP",
    //     type: "crypto"
    // },
    // sTRX: {
    //     name: "sTRX",
    //     fullName: "sTRX",
    //     type: "crypto"
    // },
    //lBSV: {
    //    name: "sBSV",
    //    fullName: "sBSV",
    //    type: "crypto"
    //},
    // sLINK: {
    //     name: "sLINK",
    //     fullName: "sLINK",
    //     type: "crypto"
    // },
    //lZEC: {
    //    name: "sZEC",
    //    fullName: "sZEC",
    //    type: "crypto"
    //},
    //lNEO: {
    //    name: "sNEO",
    //    fullName: "sNEO",
    //    type: "crypto"
    //},
    // sBNB: {
    //     name: "sBNB",
    //     fullName: "sBNB",
    //     type: "crypto"
    // },
    //lDASH: {
    //    name: "sDASH",
    //    fullName: "sDASH",
    //    type: "crypto"
    //},
    //lJUST: {
    //    name: "sJUST",
    //    fullName: "sJUST",
    //    type: "crypto"
    //},
    // sDOT: {
    //     name: "sDOT",
    //     fullName: "sDOT",
    //     type: "crypto"
    // },
    // sYFI: {
    //     name: "sYFI",
    //     fullName: "Yearn.finance",
    //     type: "crypto"
    // },
    // sADA: {
    //     name: "sADA",
    //     fullName: "Cardano",
    //     type: "crypto"
    // },
    // sXLM: {
    //     name: "sXLM",
    //     fullName: "Stellar",
    //     type: "crypto"
    // },
    //lXCF: {
    //    name: "sXCF",
    //    fullName: "sXCF",
    //    type: " "
    //},
    // sXAU: {
    //     name: "sXAU",
    //     fullName: "sXAU",
    //     type: "commodity"
    // },
    // sXAG: {
    //     name: "sXAG",
    //     fullName: "sXAG",
    //     type: "commodity"
    // },
    //lSOY: {
    //    name: "sSOY",
    //    fullName: "sSOY",
    //    type: "commodity"
    //},
    //lOIL: {
    //    name: "sOIL",
    //    fullName: "sOIL",
    //    type: "commodity"
    //},
    //lNIKK: {
    //    name: "sNIKK",
    //    fullName: "sNIKK",
    //    type: "index"
    //},
    //lFTSE: {
    //    name: "sFTSE",
    //    fullName: "sFTSE",
    //    type: "index"
    //},
    //lCAC: {
    //    name: "sCAC",
    //    fullName: "sCAC",
    //    type: "index"
    //},
    //lDAX: {
    //    name: "sDAX",
    //    fullName: "sDAX",
    //    type: "index"
    //},
    
    // sHB10: {
    //     name: "sHB-10",
    //     fullName: "Liquid Huobi index",
    //     type: "index"
    // },
    // sXBCI: {
    //     name: "sXBCI",
    //     fullName: "Xangle Blue Chip Index",
    //     type: "index"
    // },
    // sXLCI: {
    //     name: "sXLCI",
    //     fullName: "Xangle Large Cap Index",
    //     type: "index"
    // },
    // sXCI: {
    //     name: "sXCI",
    //     fullName: "Xangle Cap index",
    //     type: "index"
    // },
    // sUNI: {
    //     name: "sUNI",
    //     fullName: "Uniswap",
    //     type: "crypto"
    // },
    // sXCU: {
    //     name: "sXCU",
    //     fullName: "sXCU",
    //     type: "commodity"
    // },
    // sCHF: {
    //     name: "sCHF",
    //     fullName: "sCHF",
    //     type: "currencies"
    // },
    // sJPY: {
    //     name: "sJPY",
    //     fullName: "sJPY",
    //     type: "currencies"
    // },
    // sEUR: {
    //     name: "sEUR",
    //     fullName: "sEUR",
    //     type: "currencies"
    // },
    // sDOGE: {
    //     name: "sDOGE",
    //     fullName: "Doge Coin",
    //     type: "crypto"
    // },
    // sVET: {
    //     name: "sVET",
    //     fullName: "Vechain",
    //     type: "crypto",
    // }
};

//导入资源路径
const requireIcon = () => {
    return Object.keys(currencies).map(key => {
        let currency = currencies[key];
        currency.icon = require(`@/static/currency/${key}.svg`);
        currency.icon_inactive = require(`@/static/currency/${key}_inactive.svg`);
    });
};

requireIcon();

export const sourceKey = "sUSD";

export default currencies;
