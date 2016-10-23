// Press Association technical test
// Author: Stuart Phillips

var User = require("../schemas/user.js").User;

exports.dispatch = function(article) {
		User.find({categories: {$in: article.categories}}, function(err, result) {
			var emails = [];
			for (var i = 0; i < result.length; i++) {
				emails.push(result[i].email);
			}
			console.log("Mailing article to: " + emails);
		});
}
