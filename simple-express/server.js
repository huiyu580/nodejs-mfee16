// 導入express 這個 package
const express = require("express");

// 利用express 建立一個express application app
let app = express();

// module < package < framework

// 使用中間件 middleware處理到router前的其他工作
app.use(function(req, res, next){
    let current = new Date();
    console.log(`訪問時間:${current}`);
    next();
})

app.use(express.static("public"))

// 路由
app.get("/", (req, res) => {
    res.send("Hello express")
});
app.get("/about", (res, req) => {
    res.send("About express")
})
app.get("/test", (req, res) => {
    res.send("Express test")
})

app.listen(3001, () => {
    console.log(`我跑起來了`)
})