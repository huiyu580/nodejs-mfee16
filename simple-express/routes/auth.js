const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// 引用驗證套件
const { body, validationResult } = require("express-validator");

router.get("/register", (req, res) => {
    res.render("auth/register")
})


// 驗證規則 也可以另外做成模組
const registerRules = [
    body("email").isEmail().withMessage("請正確輸入 Email 格式"),
    body("password").isLength({ min: 6 }),
    body("confirmPassword").custom((value, { req }) => {
      return value === req.body.password;
    }),
  ];

 // 上傳圖片：用 multer 處理儲存位置和檔案名稱

 const myStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"../","public","uploads"))
    },
    filename: function(req, file, cb){
        console.log(`file: ${file}`)
        // 抓出副檔名
        const ext = file.originalname.split(".").pop();
        // 組合出自己想要的檔案名稱
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    }    
})

const uploader = multer({
    storage: myStorage,
    fileFilter: function (req, file, cb) {
      // console.log(file);
      //if (file.mimetype !== "image/jpeg") {
      //  return cb(new Error("不合法的 file type"), false);
      //}
      // file.originalname: Name of the file on the user's computer
      // 101.jpeg
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("是不合格的副檔名"));
      }
      // 檔案ＯＫ, 接受這個檔案
      cb(null, true);
    },
    limits: {
      // 限制檔案的上限 1M
      fileSize: 1024 * 1024,
    },
  });


router.post("/register", uploader.single("photo"), registerRules, async (req, res, next) =>{
    // console.log(req.body)
    // 加上 express.urlencoded的設定
    // 就可以透過 req.body 來取得 post 資料
    console.log(req.file)
    const ValidateResult = validationResult(req);

    // 有錯誤訊息時
    if (!ValidateResult.isEmpty()) {
        console.log(ValidateResult)
        return next(new Error("註冊資料有誤"))
    }
    
    // 檢查EMAIL是否有註冊過
    let data = await db.queryAsync('SELECT * FROM members WHERE email=?',[req.body.email])

    if(data.length>0){
        return next(new Error("註冊過了")) 
    }
    // 密碼加密
    let password = await bcrypt.hash(req.body.password, 10)

    // 檢查是否有選擇檔案
    let filepath = req.file ? "/uploads/" + req.file.filename : null;

    // 如果ok就insert資料
    let insertRegister = await db.queryAsync('INSERT INTO members (email, password, name, photo) VALUES(?)',[[
        req.body.email,
        password,
        req.body.name,
        filepath
    ]])
    res.send("註冊成功")

})


router.get("/login", (req, res) => {
    res.render("auth/login")
})

// 登入驗證規則
const loginRules = [
    body("email").isEmail().withMessage("請正確輸入 Email 格式"),
    body("password").isLength({ min: 6 })
  ];


router.post("/login", loginRules , async (req, res, next) => {

    let member = await db.queryAsync('SELECT * FROM members WHERE email=?',[req.body.email])

    if(member.length == 0){
        req.session.message = {
            title: "帳號不存在",
            text: "請再次確認",
            icon: "error"
        }
        res.redirect(303, "/")
    }
    member = member[0]
    console.log(member)
        
    let result = await bcrypt.compare(req.body.password, member.password);

    if(result){
        req.session.member = {
            email: member.email,
            password: member.password,
            name: member.name
        };
        req.session.message = {
            title: "成功登入",
            text: "歡迎回來",
            icon: "success"
        }
        res.redirect(303, "/")

    }else{
        req.session.member = null;
        req.session.message = {
            title: "登入失敗",
            text: "請輸入正確email及密碼",
            icon: "error"
        }
        res.redirect(303, "/")
    }
})

router.get("/logout",(req, res) => {
    req.session.member = null;
    req.session.message = {
        title: "已登出",
        text: "下次見！",
        icon: "success"
    }
    res.redirect(303, "/")
})

module.exports = router;