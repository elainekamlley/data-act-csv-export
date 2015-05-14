
var fs = require('fs');
var http = require('http');

var json2csv = require('json2csv');

var FILE_NAME = 'csv-export - ',
    GH_URL = 'https://api.github.com';

var testJSON = {
  "field": "value"
};

function convert(jsonData) {
  json2csv(jsonData, function(err, data) {
    var fileName = FILE_NAME + (new Date()).toString() + '.csv';

    if (err) {
      console.error(err);
      process.exit(1);
    }
    fs.writeFile(fileName, data, function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    }
  });
}

http.get({
  host: GH_URL,
  path: '/repos/18f/data-act/issues'
}, function(res) {
  var body = '';
  res.on('data', function(data) {
    body += data;
  });
  res.on('end', function() {
    var parsed = JSON.parse(body);
    convert(parsed);
  });
});

