$(function() {
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    function padZero(n) {
        return n = n < 10 ? '0' + n : n
    }
    // 定义完美事件的过滤器
    template.defaults.imports.dataFormate = function(date) {
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    initTable()
        // 获取文章数据列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                form.render()
                renderPage(res.total)
            }
        })
    }
    initCate()
        // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // console.log(res);
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
            }
        })
    }
    // 实现筛选的功能
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
            q.cate_id = cate_id
            q.state = state
                // 根据最新的筛选条件，重新渲染表格的数据
            initTable()
        })
        // 实现分页功能
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页展示多少条
            jump: function(obj, first) {
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                // console.log(first)
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 删除文章功能
    $('tbody').on('click', '.btn-delete', function() {
        // 获取到文章的 id
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})