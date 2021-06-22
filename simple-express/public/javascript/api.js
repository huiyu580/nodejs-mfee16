// alert("dddd")
// $.ajax({
//     type: "get",
//     url:"/api/stocks",
//     datatype: "json"
// }).done(function(data){
//     console.log(data)
// }).fail(function(){
//     console.log(error)
// }).always(function(){
//     console.log("completed")
// })

// axios.get('/api/stocks')
// .then(function (response) {
//     console.log(response);
// })



fetch('/api/stocks')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
  });
