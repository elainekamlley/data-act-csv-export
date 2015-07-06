var async = require('async');
var fs = require('fs');
var github =require('octonode');
var _ = require('underscore');

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
      commentsReqs = [],
      fields = ['Issue Number', 'Issue Author', 'Issue Title', 'Issue Description',
               'Date Opened', 'Date Closed'];


	for (var i = 0, ilen = issues.length; i < ilen; i++) {
		var issue = issues[i],
			issueData = {
				"Issue Number": issue.number,
        "Issue Author":issue.user.login,
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
          console.log('number of comments', comments.length);
          for (var c = 0, clen = comments.length; c < clen; c++) {
            console.log('comment', c, currentIssue.number);
            var comment = comments[c],
                commentData = {
                  "Issue url": comment.issue_url,
                  "Author": comment.user.login,
                  "Comment": comment.body
                };
            if (comment.body.length > 33000){
              var commentBegin = comment.body.slice(0, 33000);
              var commentRest = comment.body.slice(33001);
              console.log('Begin comment');
              console.log('Rest Comment');
              issueData['Comment'+ c] = commentBegin;
              issueData['Comment More' + c] =commentRest;
              fields.push('Comment' + c);
              fields.push('Comment More' + c);
            }
            else {
              issueData['Comment'+ c] = comment.body;
              fields.push('Comment' + c);
            }

            issueData['CommentAuthor'+ c] = commentData.Author;
            fields.push('CommentAuthor' + c);
          };
          cb(err, commentData);
        });
      });
    })(issue.number, issueData);
	}
  async.series(commentsReqs, function(err, results) {
    console.log('error', err);
    if (err) {
      console.error(err);
      process.exit(1);
    }
    fields = _.uniq(fields);
    console.log(fields);
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

