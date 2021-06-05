const axios = require("axios");

// 引入promise版的fs，就不需要自己寫
const fs = require("fs/promises");
let moment = require('moment');


// 因為有fs promise版本，不用自己寫
// function readFilePromise () {
//     return new Promise((resolve, reject) => {
//         fs.readFile("stock.txt", "utf8", (err, data) => {
//             if (err) {
//                 reject(err)
//             }
//             resolve(data)
//         })
//     })
// };

(async function(){
    let stockCode = await fs.readFile("stock.txt", "utf-8");
    let response = await axios({
        method: 'get',
        url: 'https://www.twse.com.tw/exchangeReport/STOCK_DAY?',
        params: {
            date: moment().format('YYYYMMDD'),
            stockNo: stockCode
        }
    })
    if(response.data.stat === "OK"){
        console.log(response.data.date);
        console.log(response.data.title);
    }
})();


