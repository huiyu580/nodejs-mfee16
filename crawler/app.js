const axios = require("axios");

// TODO: 從 stock.txt 讀股票代碼進來
// filesystem
// npm i fs ??? -> 不用
const fs = require("fs");
// fs.readFile("stock.txt", "utf8", (err, data) => {
//     if (err) {
//         return console.error("讀檔錯誤", err);
//     }
//     console.log(`讀到的 stock code: ${data}`)
// })

let dt = new Date();
// dt.toISOString().slice(0,10);
let formatDate = dt.toISOString().slice(0,10).replace("-","").replace("-","");

// 也可以使用moment js

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
readFilePromise()
    .then((result) => {
        // console.log(result);
        return axios({
            method: 'get',
            url: 'https://www.twse.com.tw/exchangeReport/STOCK_DAY?',
            params: {
                date: formatDate,
                stockNo: result
            }
        })
    })
    .then(function (response){
        if(response.data.stat === "OK"){
            console.log(response.data.date);
            console.log(response.data.title);
        }
    }).catch((err) => {
        console.log(err)
    })

// npm i axios
// 引入 axios





// axios({
//     method: 'get',
//     url: 'https://www.twse.com.tw/exchangeReport/STOCK_DAY?',
//     params: {
//         date: 20210529,
//         stockNo: 2330
//     }
// }).then(function (response){
//     console.log(response.data.title)
// })