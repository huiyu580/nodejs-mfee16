const axios = require("axios");

const fs = require("fs");

// js εεΎζ₯ζ
// let dt = new Date();
// dt.toISOString().slice(0,10);
// let formatDate = dt.toISOString().slice(0,10).replace("-","").replace("-","");

// moment js
let moment = require('moment');


function readFilePromise () {
    return new Promise((resolve, reject) => {
        fs.readFile("stock.txt", "utf8", (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
};

(async function(){
    let stockCode = await readFilePromise();
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

// readFilePromise()
//     .then((result) => {
//         // console.log(result);
//         return axios({
//             method: 'get',
//             url: 'https://www.twse.com.tw/exchangeReport/STOCK_DAY?',
//             params: {
//                 date: formatDate,
//                 stockNo: result
//             }
//         })
//     })
//     .then(function (response){
//         if(response.data.stat === "OK"){
//             console.log(response.data.date);
//             console.log(response.data.title);
//         }
//     }).catch((err) => {
//         console.log(err)
//     })