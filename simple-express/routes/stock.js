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

    let priceResult = await db.queryAsync('SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date', [req.params.stockCode]);
    res.render("stock/detail",{
        stockPrice : priceResult
    })

});

module.exports = router;