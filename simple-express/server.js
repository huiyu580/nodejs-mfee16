// 導入express 這個 package
const express = require("express");

// 利用express 建立一個express application app
let app = express();

// 用db.js模組連線至資料庫
let db = require("./utils/db.js");

// 使用cookie去紀錄session id
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// 使用session
const expressSession = require("express-session");
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
  }))

// module < package < framework

// 使用中間件 middleware處理到router前的其他工作
app.use(function(req, res, next){
    let current = new Date();
    console.log(`訪問時間:${current}`);
    next();
})

// 使 express 可以透過 req.body 抓到post資料
app.use(express.urlencoded({ extended: false }));

// 通常把router application放在這
let stockRouter = require('./routes/stock')
// 告訴程式如果看到/stock 就到stock.js找
app.use("/stock", stockRouter)
let apiRouter = require('./routes/api')
app.use("/api", apiRouter)

let authRouter = require('./routes/auth')
app.use("/auth", authRouter)

let memberRouter = require('./routes/member')
app.use("/member", memberRouter
)

// 這行會建立/javascripts/api.js 路由
// style/style.css 路由
app.use(express.static("public"));



// 第一個是變數 第二個是檔案夾名稱
app.set("views", "views")

// 告訴express我們用view engine是pug
app.set("view engine", "pug")

app.use(function (req, res, next) {
    res.locals.member = req.session.member;

    next();
});

app.use(function(req, res, next) {
    if(req.session.message){
        res.locals.message = req.session.message;
        delete req.session.message;
    }
    next();
})

// 路由
app.get("/", (req, res) => {
    res.render("index")
    // res.send("Hello express")
});
app.get("/about", (req, res) => {
    // res.send("About express")
    res.render("about")
});

// app.get("/stock", async (req, res) => {
//     let result = await db.queryAsync('SELECT * FROM stock');
//     res.render("stock/list",{
//         stocks: result
//     })
// });
// app.get("/stock/:stockCode", async (req, res) => {

//     let priceResult = await db.queryAsync('SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date', [req.params.stockCode]);
//     res.render("stock/detail",{
//         stockPrice : priceResult
//     })

// });

app.get("/test", (req, res) => {
    res.send("Express test")
});


app.use((req, res, next) => {
    res.status(404);
    res.render("404");
})

// 500 error 放在所有路由最後面 這裡一定要有四個參數 --> 最後的錯誤處理
app.use((err, req, res, next) => {
    // console.log(err.message)
    res.status(500);
    res.send(err.message)
})
app.listen(3000, () => {
    console.log(`我跑起來了`)
})