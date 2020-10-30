// 开发环境服务器地址
var baseUrl = 'http://ajax.frontend.itheima.net'
    // 处理参数
$.ajaxPrefilter(function(options) {
    // console.log(options);
    options.url = baseUrl + options.url
        // 处理请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = function(res) {


        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})