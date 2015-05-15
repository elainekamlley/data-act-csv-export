var fs = require('fs');
var http =require('http');

var json2csv = require('json2csv');

var GH_URL = "https://api.github.com";

console.log(1);
http.get({
  host: GH_URL,
  path: "repos/fedspendingtransparency/fedspendingtransparency.github.io/issues",
}, function(response){
  //continously update stream with data
  var body ='';
  response.on('data', function(data) {
    body += data;
  });
  response.on('end', function(){
    var parsed = JSON.parse(body);
    convert(parsed);
  });
  console.log(2);
  console.log(body);
  json2csv({ data: body, fields: ["number", "title"] },
      function(err, data) {

    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(data);
    fs.writeFile('./data.csv', data, function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log('It\'s saved!');
    });
  });
});
console.log(3);
