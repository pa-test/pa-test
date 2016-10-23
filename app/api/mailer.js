// Press Association technical test
// Author: Stuart Phillips

var User = require("../schemas/user.js").User;

var contacted = [];
exports.contacted = contacted;

exports.dispatch = function(article, callback) {
		User.find({categories: {$in: article.categories}}, function(err, result) {
			for (var i = 0; i < result.length; i++) {
				contacted.push(result[i].email);
			}
			callback();
		});
}