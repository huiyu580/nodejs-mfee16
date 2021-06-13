// http 是 Node JS 內建的web server，所以不用安裝
const http = require("http");

// createServer(Listener)
// Listener(request, response) 負責處理進來的連線
// request 是請求物件
// response 是回覆物件

// 建立server物件，還沒連線
const server = http.createServer((req, res) => {
    console.log("有連線進來了");
    console.log(req.url) //用來拿url

    // 將url一般化，移除他的query string，非必要結尾斜線，一律小寫
    const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLocaleLowerCase();

    // 抓到localhost / IP
    const url = new URL(req.url, `http://${req.headers.host}`)
    // query string的參數變成物件
    console.log(url.searchParams);
    

    res.statusCode = 200; //成功
    res.setHeader("Content-Type", "text/plain;charset=UTF-8")

    switch(path) {
        case "/":
            let name = url.searchParams.get(name)
            res.end(`hello ${name}，這是首頁`);
            break;
        case "/test":
            res.end("這是測試頁面");
            break;
        case "/about":
            res.end("關於我們");
            break;
    }

});

// 開始連線 只要收到 3000 port(在瀏覽器網址輸入localhost:3000) 就會進來
// localhost 127.0.0.1
server.listen(3000, () => {
    console.log("我跑起來了哦!我要收 3000 port")
});

//  php 搭配 web server(apache)
//  node js 直接開發一個webserver