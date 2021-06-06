const axios = require("axios");
const fs = require("fs");
let moment = require('moment');

const Promise = require('bluebird');
const fsBlue = Promise.promisifyAll(fs);

const mysql = require('mysql');
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'stock'
});
connection = Promise.promisifyAll(connection);

(async function(){
    // 讀 stock.txt 中的 stock Code
    let stockCode = await fsBlue.readFileAsync("stock.txt", "utf-8");

    try{
        await connection.connectAsync();

        // 查詢資料庫中是否有該筆資料
        let ifExist = await connection.queryAsync(`SELECT stock_id FROM stock WHERE stock_id='${stockCode}'`)
        if(ifExist.length == 0){
            let result = await axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode}`)
            
            // 判斷是否抓的到該筆資料
            if(result.data.suggestions[0] == '(無符合之代碼或名稱)'){
                throw "查無資料";
            }
            
            // 查無資料時已經丟出，不需要再用else
            let companyName = "";
            result.data.suggestions.forEach(item => {
                let newItem = item.split('\t')
                if(newItem[0] == stockCode){
                    companyName = newItem[1];
                }
            })
            // 加入資料庫
            await connection.queryAsync(`INSERT INTO stock(stock_id, stock_name) VALUES('${stockCode}','${companyName}')`)
            console.log("成功加入資料庫")
            
        }else{
            throw "該筆資料已存在";
        }
    }catch(err){
        console.error(err)
    }finally{
        connection.end();
    }

})();
