const car = {
    brand: "Ford",
    color: "blue",
}


// 有些東西是私有的 不想暴露
// module.exports = car;
// exports.getColor = function(){
//     return car.color
// }

exports.setColor = function(color){
    car.color = color;
}
