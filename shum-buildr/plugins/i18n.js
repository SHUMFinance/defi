import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export default ({ app, store }) => {
    // This way we can use it in middleware and pages asyncData/fetch
    app.i18n = new VueI18n({
        locale: store.state.locale,
        fallbackLocale: "en",
        messages: {
            en: require("@/assets/i18n/en.json"),
            zh: require("@/assets/i18n/zh.json")
        }
    });
};
