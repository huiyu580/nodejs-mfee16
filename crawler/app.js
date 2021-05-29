const { default: axios } = require("axios");

axios({
    method: 'get',
    url: 'https://www.twse.com.tw/exchangeReport/STOCK_DAY?',
    params: {
        date: 20210529,
        stockNo: 2330
    }
}).then(function (response){
    console.log(response.data)
})