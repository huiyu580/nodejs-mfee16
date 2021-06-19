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
router.get("/:stockCode", async (req, res) => {
    let stockNameArr = await db.queryAsync('SELECT stock_name FROM stock WHERE stock_id = ?', [req.params.stockCode]); 
    let stockName = stockNameArr[0].stock_name
    console.log(stockName)

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
        pagination:{
            lastPage,
            currentPage
        }
    })

});

module.exports = router;