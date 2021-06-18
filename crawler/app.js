const axios = require("axios");
const fs = require("fs");
let moment = require('moment');

const Promise = require('bluebird');
const fsBlue = Promise.promisifyAll(fs);
require('dotenv').config()
const mysql = require('mysql');
let connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});
connection = Promise.promisifyAll(connection);

(async function(){
    // 讀 stock.txt 中的 stock Code
    let stockCode = await fsBlue.readFileAsync("stock.txt", "utf-8");

    try{
        await connection.connectAsync();

        // 查詢資料庫中是否有該筆資料
        let ifExist = await connection.queryAsync('SELECT stock_id FROM stock WHERE stock_id=?', [stockCode])
        if(ifExist.length == 0){
            let result = await axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode}`)
            
            // 判斷是否抓的到該筆資料
            if(result.data.suggestions[0] == '(無符合之代碼或名稱)'){
                throw "查無資料";
            }
            
            let companyName = "";
            result.data.suggestions.forEach(item => {
                let newItem = item.split('\t')
                if(newItem[0] == stockCode){
                    companyName = newItem[1];
                    return newItem
                }
            })

            let response = await axios({
                method: 'get',
                url: 'https://www.twse.com.tw/exchangeReport/STOCK_DAY?',
                params: {
                    date: moment().format('YYYYMMDD'),
                    stockNo: stockCode
                }
            })
            console.log(response.data.data)
            // 加入資料庫
            await connection.queryAsync(`INSERT INTO stock(stock_id, stock_name) VALUES('${stockCode}', '${companyName}')`)
            
            throw "成功加入資料庫"

            
        }else{
            console.log("該筆資料已存在");
        }
         // 處理資料 //到這一步表示stock資料庫已經有了或著已建入新的stock_id 跟 stock_name
        let getStocks = await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY',{
            params: {
                date: moment().format('YYYYMMDD'),
                stockNo: stockCode
            }    
        })

            
        let stocksArr = getStocks.data.data.map(item => {
            item = item.map((i) => {
                return i.replace(/,/g, "")
            })
                item[0] = moment(parseInt(item[0].replace(/\//g,"")) + 19110000, 'YYYYMMDD').format('YYYY-MM-DD')
                item.unshift(stockCode)
                return item
            })
            console.log(stocksArr)
            // 批次寫入資料庫
            let insertResult = await connection.queryAsync(
                "INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?", [stocksArr]
            )
            console.log(insertResult)
    }catch(err){
        console.error(err)
    }finally{
        connection.end();
    }

})();
