const item = require("./car.js");

// 如果car.js下了 exports.getColor 以及 module.exports，只會去抓module.exports, item.getColor is not a function
// console.log(item.color)
// console.log(item.getColor()) //印出car.js裡物件的color

// item.setColor("orange")
console.log(item.getColor())
item.setColor("red")
console.log(item.getColor())




// car.color = "red";
// console.log(car.color);


