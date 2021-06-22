const express = require('express')
const router = express.Router();
const db = require("../utils/db.js")


router.get("/stocks", async (req, res) => {
    let result = await db.queryAsync('SELECT * FROM stock');
    // res.json(result)
    res.send(result)
});

module.exports = router;