import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
var ls = new SecureLS({ encodingType: "aes" }); // https://github.com/softvar/secure-ls
const isProp = process.env.NODE_ENV === "production"; //生产

export default ({ store }) => {
    let storageParams = null;
    if (isProp) {
        //生产版本才加密
        storageParams = {
            getItem: key => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: key => ls.remove(key)
        };
    }
    createPersistedState({
        key: "vuex",
        storage: storageParams,
        //指定state
        reducer(state) {
            return {
                theme: state.theme,
                locale: state.locale,
                autoConnect: state.autoConnect,
                walletType: state.walletType,
                swapUnfreezeDatas: state.swapUnfreezeDatas
            };
        }
    })(store);
};
