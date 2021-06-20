const express = require('express')
const router = express.Router();

router.get("/register", (req, res) => {
    res.render("auth/register")
})

router.post("/register", (req, res) =>{
    res.send("收到了")
})

router.get("/login", (req, res) => {
    res.render("auth/login")
})

module.exports = router;