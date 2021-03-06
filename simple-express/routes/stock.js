const express = require("express");
const db = require("../utils/db.js")
const router = express.Router();

// 把網址改成 從server.js + 這裡的網址 = 完整網址
router.get("/", async (req, res) => {
    let result = await db.queryAsync('SELECT * FROM stock');
    res.render("stock/list",{
        stocks: result
    })
});
router.get("/:stockCode", async (req, res, next) => {
    let stockArr = await db.queryAsync('SELECT * FROM stock WHERE stock_id = ?', [req.params.stockCode]); 
    // 看是否有這個名稱
    if (stockArr.length ==0){
        return next(new Error("錯誤訊息跳入500")); // 進入404那個中間件 加上return避免繼續執行函式內下面的程式碼
        // 如果再next(加入參數) 就會跳到有四個參數的錯誤處理函式
    }
    let stockName = stockArr[0].stock_name
    let stockCode = stockArr[0].stock_id

    const perPage = 10;
    let totalCountArr = await db.queryAsync('SELECT COUNT(*) as total FROM stock_price WHERE stock_id = ?', [req.params.stockCode]); 
    total = totalCountArr[0].total
    let lastPage = Math.ceil(total/perPage)
    const currentPage = req.query.page || 1;
    

    let priceResult = await db.queryAsync('SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date  LIMIT ?,?', [req.params.stockCode, (currentPage-1)*perPage, perPage]);
    // console.log(priceResult)
    res.render("stock/detail",{
        stockPrice : priceResult,
        stockName,
        stockCode,
        pagination:{
            lastPage,
            currentPage
        }
    })

});

module.exports = router;