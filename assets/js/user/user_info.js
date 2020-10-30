$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称在1~6位之间'
            }
        }
    })

    initUserInfo()
        // 获取数据 渲染页面
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('formUserinfo', res.data)
            }
        })
    }
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
                method: 'POST',
                url: '/my/userinfo',
                data: $(this).serialize(),

                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }
                    layer.msg(res.message)

                    // 调用父页面中的方法
                    window.parent.getUserInfo()
                }
            })
            // console.log($(this).serialize());
    })
})