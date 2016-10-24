// Press Association technical test
// Author: Stuart Phillips

var Subscription = require("../schemas/subscription.js").Subscription;

var contacted = [];
exports.contacted = contacted;

exports.dispatch = function(article, callback) {
		Subscription.find({categories: {$in: article.categories}}, function(err, result) {
			for (var i = 0; i < result.length; i++) {
				contacted.push(result[i].email);
			}
			callback();
		});
}
