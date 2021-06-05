const axios = require("axios");
const fs = require("fs");
let moment = require('moment');

//覆蓋掉原生的promise
const Promise = require("bluebird");
// console.log(Promise)

// 一次包一個
// const readFileBlue = Promise.promisify(fs.readFile)

// 一次包全部
const fsBlue = Promise.promisifyAll(fs);

fsBlue
    .readFileAsync("stock.txt", "utf-8")
    // readFileBlue("stock.txt", "utf-8") // 一次包一個
    .then((result) => {
        // axios 是一個promise 當他return時，代表又丟了一個promise出去，所以外面可以再接一個then
        return axios({
            method: 'get',
            url: 'https://www.twse.com.tw/exchangeReport/STOCK_DAY?',
            params: {
                date: moment().format('YYYYMMDD'),
                stockNo: result
            }

        })
    })
    // 這個then接的是axios這個promise的結果
    .then(function (response){
        if(response.data.stat === "OK"){
            console.log(response.data.date);
            console.log(response.data.title);
        }
    // 任何一個promise發生錯誤 readFilePromise 和 axios的錯誤都會被catch接住

    }).catch((err) => {
        console.log(err)
    })