export default async function({
    $axios,
    store,
    req,
    res,
    route,
    redirect,
    error
}) {
    // 请求拦截器
    $axios.onRequest(config => {});

    //响应拦截器
    $axios.onResponse(response => {});

    //错误拦截器
    $axios.onError(error => {});

    //请求错误拦截器
    $axios.onRequestError(error => {});

    //响应错误拦截器
    $axios.onResponseError(({ response }) => {});
}
