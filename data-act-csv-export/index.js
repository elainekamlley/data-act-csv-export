var fs = require('fs');
var json2csv = require('json2csv');
var linter = require('./linter');

var file = fs.readFile(jsonFilename)
var converted = Converter.convert(file);
var final = linter(converted);

json2csv {data: someJSONData, fields: ['field1', 'field2', 'field3']} {
  fs.readFile( jsonFilename, csv, function(err, data){
    if (err) {
    console.warning(err);
    process.exit(1);
    };
  };

  var s = json2csv({
    data: data,
    fields: ['issue number', 'issue title', 'comments']
  });
  console.log(s);
  fs.writeFile('data.csv', s, function(err)
});
