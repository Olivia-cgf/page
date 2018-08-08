const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');

let app = express();
let count = 0;

app.use(cookieParser("hello"));
app.use(session({
    secret:"hello",
    name:'sid',
    cookie:{
        maxAge:10000,
    },
    resave:true,
    rolling:true,
    saveUninitialized: true 
}));
 
app.use(express.static("html"));//关键是这一句，我的目录是html的目录
// app.get('/',function (req,res,next) {
//     if(req.session.isLogined === 1){
//         res.sendfile('./count.html')
//     }else {
//         res.sendfile('./test.html')
//     }
// });

app.post('/check',function (req,res,next) {
    let data = "";
    req.on("data",function (chunk) {
        data += chunk;
    });
    req.on("end",function () {
        data = querystring.parse(data);
        if(data.username === 'tom' && data.pwd === 'tom'){
            req.session.name = data.username;
            req.session.isLogined = 1;
            res.redirect('/');
        }else{
            res.redirect('/');
        }
    });
});

app.post('/form',function (req,res,next){
    let fc = function(){
        function foo(){
            count++  ;
            return count;
        }
        return foo()
    };
    res.send(`您是第${fc()}位访客`);
});


app.post('/out',function (req,res){
    res.clearCookie('sid')
    req.session.isLogined = 0;
    res.redirect('/')
})



app.listen(8080, ()=>{
    console.log("服务启动成功。");
})