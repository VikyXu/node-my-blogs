var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require(path.join(__dirname,'config/index'))
var api =require(path.join(__dirname,'api/api'))

var app = express();
app.all('*', function (req, res, next) {
    //响应头指定了该响应的资源是否被允许与给定的origin共享。*表示所有域都可以访问，同时可以将*改为指定的url，表示只有指定的url可以访问到资源 
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    //允许请求资源的方式
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
    });
app.use(session({
    secret: 'VikyWebMyblogs', // 建议使用 128 个字符的随机字符串
    cookie: { maxAge: 60 * 1000 }
}));
//配置body-parser(中间件) 获取表单中post请求
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.engine('html',require('express-art-template'))

app.use('public',express.static(path.join(__dirname,'public')))

app.use(api)

app.get('/',function(request,response){
    response.send('spa主页面')
})

app.listen(config.serverPort,function(){
    console.log('runing '+config.serverPort)
})