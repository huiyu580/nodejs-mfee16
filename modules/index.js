const car = require("./car.js");

// 在car.js只下exports.getColor, 這邊會印出undefine
// 如果car.js下了 exports.getColor 以及 module.exports，只會去抓module.exports, car.getColor is not a function
// console.log(car.color)
// console.log(car.getColor()) //印出car.js裡物件的color
car.setColor("orange")
console.log(car.color)




// car.color = "red";
// console.log(car.color);


