// 導入express 這個 package
const express = require("express");

// 利用express 建立一個express application app
let app = express();

// module < package < framework

app.listen(3000, () => {
    console.log(`我跑起來了`)
})