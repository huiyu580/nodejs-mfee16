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

app.use(express.static("public"));

// 第一個是變數 第二個是檔案夾名稱
app.set("views", "views")

// 告訴express我們用view engine是pug
app.set("view engine", "pug")

// 路由
app.get("/", (req, res) => {
    res.render("index")
    // res.send("Hello express")
});
app.get("/about", (req, res) => {
    // res.send("About express")
    res.render("about")
});
app.get("/test", (req, res) => {
    res.send("Express test")
});

app.listen(3001, () => {
    console.log(`我跑起來了`)
})