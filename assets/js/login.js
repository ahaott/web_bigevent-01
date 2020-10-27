$(function() {

    $('#link-reg').on('click', function() {
        $('.reg-box').show()
        $('.login-box').hide()
    })
    $('#link-login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    var layer = layui.layer
    var form = layui.form
        // 2.自定义校验规则
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            // 确认密码
            repwd: function(value) {
                var pwd = $('.reg-box [name=password]').val()
                if (pwd !== value) {
                    return '两次密码输入不一致'
                }
            }
        })
        // 监听注册表单事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/api/reguser',
                data: {
                    username: $('#form_reg input[name=username]').val(),
                    password: $('#form_reg input[name=password]').val()
                },
                success: function(res) {
                    if (res.status !== 0) {
                        // return alert(res.message)
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    $('#link-login').click()
                    $('#form_reg')[0].reset()
                }
            })
        })
        // 监听登录表单事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })

})