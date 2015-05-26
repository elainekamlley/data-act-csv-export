var fs = require('fs');
var github =require('octonode');

var json2csv = require('json2csv');

var client = github.client(process.env.GITHUB_API_KEY);

var ghrepo = client.repo('fedspendingtransparency/fedspendingtransparency.github.io');

ghrepo.issues({
 	state: 'all',
 	per_page: 100,
}, function(err, body, status, headers) {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	var issues = body;
	var issuesData = [];
	for (var i = 0, ilen = issues.length; i < ilen; i++) {
		var issue = issues[i],
			issueData = {
				"Issue Number": issue.number,
				"Issue Title": issue.title, 
				"Issue Description": issue.body,
				"Date Opened": issue.created_at,
				"Date Closed": issue.closed_at,
			};
		issuesData.push(issueData);
	}
	json2csv({ data: issuesData, fields: ['Issue Number', 'Issue Title', 'Issue Description', , 'Date Opened', 'Date Closed'] },
		function(err, data) {
			if (err) {
	          console.error(err);
	          process.exit(1);
	        }
	        console.log(data);
	        var fileName = './data' + (new Date()).toJSON() + '.csv'; 
	        fs.writeFileSync(fileName, "");
	        fs.appendFile(fileName, data, function (err) {
	          if (err) {
	            console.error(err);
	            process.exit(1);
	          }
	          console.log('It\'s saved!');
		// var ghissue = client.issue('fedspendingtransparency/fedspendingtransparency.github.io', issue.number);
		// 	ghissue.comments(function(err, body, status, headers) {
		// 		var comments = body;
		// 		for (var c = 0, clen = comments.length; c < clen; c++) {
		// 			var comment = comments[c],
		// 				commentData = {
		// 					"Issue url": comment.issue_url,
		// 					"Author": comment.user.login,
		// 					"Comment": comment.body, 
		// 				};
		// 		};
		// 	});
			});
	});		
});

