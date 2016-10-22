// Press Association technical test
// Author: Stuart Phillips

var express = require("express");
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');

var Article = require("../schemas/article.js").Article;
var User = require("../schemas/user.js").User;

var app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/news');

// Set up REST API endpoints
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
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
});

app.post("/subscribe", function(req, res) {
  if (req.body) {
  	var user = new User(req.body);
		var invalidFormat = user.validateSync();
		if (invalidFormat) {
			res.sendStatus(400);
			return;
		}

    User.findOne({'email': req.body.email}, 'categories', function(err, result) {
    	if (!result) {  // create a new entry if this user doesn't exist
				user.save(function(err) {
	        if (err) {
	          console.log(err);
	          res.sendStatus(500);  // internal server error
	        } else {
	          res.sendStatus(200);
	        }
	      });
    	} else {  // update subscription for existing user
    		var newCategories = req.body.categories.filter(function(item) {
    			return result.categories.indexOf(item) == -1;
    		});

    		if (newCategories.length > 0) {
    			var updatedList = result.categories.concat(newCategories);
	    		User.update({email: req.body.email}, {categories: updatedList}, function(err, raw) {
					  if (err) {
					  	console.log(err);
					  	res.sendStatus(500);
					  } else {
					  	res.sendStatus(200);
					  }
					});
    		} else {
    			res.sendStatus(200);  // do nothing if the request categories are identical
    		}

    	}
    });
  } else {
    res.sendStatus(400);
  }
});

app.post("/unsubscribe", function(req, res) {
  res.sendStatus(501);
});

app.post("/reset", function(req, res) {
  User.remove({}, function(err) {
  	if (err) {
  		console.log(err);
  		res.sendStatus(500);
  	} else {
  		res.sendStatus(200);
  	}
  });
});

// Initialize the app
var server = app.listen(process.env.PORT || 8080, function() {
	var port = server.address().port;
	console.log("App now running on port", port);
});

exports.server = server;
