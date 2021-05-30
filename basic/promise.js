
let doWork = function (job, timer, cb) {
    setTimeout(() => {
      let dt = new Date();
      cb(null, `完成工作: ${job} at ${dt.toISOString()}`);
    }, timer);
  };
  
// new Promise(function (resolve, reject) {});

let doWorkPromise = function (job, timer, success){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let dt = new Date();
            if (success){
                return resolve(`完成工作: ${job} at ${dt.toISOString()}`)
            }
            reject(`工作失敗: ${job} at ${dt.toISOString()}`)
        }, timer);
    });
};

doWorkPromise("刷牙", 2000, true)
    .then((result) => {
        console.log(result);
        return doWorkPromise("吃早餐", 3000, true)
    })
    .then((result) => {
        console.log(result);
        return doWorkPromise("寫功課", 3000, true)
    })
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.error("發生錯誤", err);
    })
    .finally(() => {
        console.log("我是finally")
    })