// Press Association technical test
// Author: Stuart Phillips

var Subscription = require("../schemas/subscription.js").Subscription;

var contacted = [];  // keep a running list of subscribers that have been contacted (for unit testing purposes)
exports.contacted = contacted;

exports.dispatch = function(article, callback) {
		Subscription.find({categories: {$in: article.categories}}, function(err, result) {  // find subscribers to any of the new article categories
			for (var i = 0; i < result.length; i++) {
				contacted.push(result[i].email);
			}
			callback();
		});
}
