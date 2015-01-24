// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('s','cloud/public');   // 设置static目录
app.set('view engine', 'jade');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
var params = {}
var today = new Date()
params.date = {
	'year': today.getFullYear(),
	'month': today.getMonth() + 1, 
	'date': today.getDate(),
	'day': today.getDay()
}
console.log(params);
app.get('/hello', function(req, res) {
  res.render('hello', { params: params });
});


// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();