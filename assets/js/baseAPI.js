// 开发环境服务器地址
var baseUrl = 'http://ajax.frontend.itheima.net'
    // 处理参数
$.ajaxPrefilter(function(options) {
    options.url = baseUrl + options.url
})