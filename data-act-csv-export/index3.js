var fs = require('fs');
var github =require('octonode');

var json2csv = require('json2csv');

var client = github.client('ec827d5f9aad32e5d27bab7d94e15f16d14cfffd');

var ghrepo = client.repo('fedspendingtransparency/fedspendingtransparency.github.io');

ghrepo.issues({
 	state: 'all',
}, function(err, body, status, headers) {
	var issues = body;
	for (var i = 0, ilen = issues.length; i < ilen; i++) {
		var issue = issues[i],
			issueData = {
				"Issue Number": issue.number,
				"Issue Title": issue.title, 
				"Issue Description": issue.body,
				"Data Element": issue.lables,
				"Date Opened": issue.created_at,
				"Date Closed": issue.closed_at,
			};
		json2csv({ data: issueData, fields: ['Issue Number', 'Issue Title', 'Issue Description', 'Data Element', 'Date Opened', 'Date Closed'] },
			function(err, data) {
				if (err) {
		          console.error(err);
		          process.exit(1);
		        }
		        console.log('in json2csv');
		        fs.writeFile('./data.csv', data, function (err) {
		          if (err) {
		            console.error(err);
		            process.exit(1);
		          }
		          console.log('It\'s saved!');
		console.log(issueData);
		var ghissue = client.issue('fedspendingtransparency/fedspendingtransparency.github.io', issue.number);
			ghissue.comments(function(err, body, status, headers) {
				var comments = body;
				for (var c = 0, clen = comments.length; c < clen; c++) {
					var comment = comments[c],
						commentData = {
							"Issue url": comment.issue_url,
							"Author": comment.user.login,
							"Comment": comment.body, 
						};
						console.log(commentData);
				};
			});
		});
		});		
	}
});

