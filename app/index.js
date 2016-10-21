// Press Association technical test
// Author: Stuart Phillips

var express = require("express");
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/news');
var ArticleSchema = new mongoose.Schema({
  publishDate: {type: Date, default: Date.now, required: false},
  categories: {type: [String], required: true},
  article: {
  	author: {type: String, required: true},
  	headline: {type: String, required: true},
  	content: {type: String, required: true}
  }
});
var Article = mongoose.model('Article', ArticleSchema);

// Set up REST API endpoints
app.post("/subscribe", function(req, res) {
  res.sendStatus(501);
});

app.post("/upload", function(req, res) {
  if (req.body) {
  	var article = new Article(req.body);
  	var invalidFormat = article.validateSync();
  	if (!invalidFormat) {
  		article.save(function(err) {
			  if (err) {
			    console.log(err);
			    res.sendStatus(400);
			  } else {
			  	res.sendStatus(200);
			  }
			});
  	} else {
  		// console.log(invalidFormat.errors);
  		res.sendStatus(400);
  	}
  } else {
  	res.sendStatus(400);
  }
});

// Initialize the app
var server = app.listen(process.env.PORT || 8080, function() {
	var port = server.address().port;
	console.log("App now running on port", port);
});

exports.server = server;
