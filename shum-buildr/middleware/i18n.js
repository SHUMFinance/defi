export default async ({ app, store }) => {
    //路由变化时设置语言,保持语言一致性
    //Align rlanuages with different routing
    app.i18n.locale = store.state.locale || app.i18n.fallbackLocale;
};
