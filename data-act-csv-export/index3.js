var async = require('async');
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
	var issues = body,
      issuesData = [],
      commentsReqs = [];

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

    (function(issueNumber, issueData) {
      commentsReqs.push(function(cb) {
        var currentIssue = client.issue(
            'fedspendingtransparency/fedspendingtransparency.github.io',
            issueNumber);
        currentIssue.comments(function(err, body, headers) {
          var comments = body,
              commentData = '';
          console.log('current', currentIssue.number);
          console.log('comment error', err);
          if (!comments) {
            cb(err, comments);
          }
          for (var c = 0, clen = comments.length; c < clen; c++) {
            var comment = comments[c],
                commentData = {
                  "Issue url": comment.issue_url,
                  "Author": comment.user.login,
                  "Comment": comment.body
                };
            issueData['Comment'+ c] = comment.body;
            issueData['CommentAuthor'+ c] = commentData.Author;
          };
          cb(err, commentData);
        });
      });
    })(issue.number, issueData);
	}
  async.series(commentsReqs, function(err, results) {
  	var fields = ['Issue Number', 'Issue Title', 'Issue Description',
               'Date Opened', 'Date Closed'];
   	for (var c = 1, clen = 30; c < clen; c++){
   		fields.push('CommentAuthor' + c);
   		fields.push('Comment' + c);
   	}
    console.log('error', err);
    if (err) {
      console.error(err);
      process.exit(1);
    }
    json2csv({ data: issuesData,
               fields: fields },
      function(err, data) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        var fileName = './GitHub-export' + (new Date()).toJSON() + '.csv';
        fs.writeFileSync(fileName, "");
        fs.appendFile(fileName, data, function (err) {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          console.log('It\'s saved!');
        });
    });
  });
});

