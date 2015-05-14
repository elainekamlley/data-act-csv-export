var fs = require('fs');
var json2csv = require('json2csv');

var fakeData = {
  'issue number': 32,
  'issue title': 'Something is wrong',
  'comments': [
    { },
    { }
  ]
};


json2csv({ data: fakeData, fields: ['issue number', 'issue title'] },
    function(err, data) {

  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(data);
  process.exit(0);

});

