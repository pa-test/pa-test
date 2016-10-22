// Press Association technical test (test cases)
// Author: Stuart Phillips

var upload = require("./upload/upload.js");
var reset = require("./reset/reset.js");
var subscription = require("./subscription/subscription.js");
var unsubscription = require("./unsubscription/unsubscription.js");

describe("News API", function() {

	upload.tests;
	reset.tests;
	subscription.tests;
	unsubscription.tests;

});
