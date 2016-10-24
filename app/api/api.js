// Press Association technical test
// Author: Stuart Phillips

var express = require("express");
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');

var Article = require("../schemas/article.js").Article;
var Subscription = require("../schemas/subscription.js").Subscription;
var Unsubscription = require("../schemas/subscription.js").Unsubscription;
var mailer = require("./mailer.js");

var app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/news');

// Set up REST API endpoints

// Upload an article to the database
app.post("/upload", function(req, res) {
  if (req.body) {  // check that a JSON body was sent with the request
    var article = new Article(req.body);
    var invalidFormat = article.validateSync();  // validate against the article schema

    if (!invalidFormat) {
      article.save(function(err) {
        if (err) {
          console.log(err);
          res.sendStatus(500);  // internal server error
        } else {
					mailer.dispatch(req.body, function() {  // send the article out to subscribers
						res.sendStatus(200);
					});
        }
      });
    } else {
      res.sendStatus(400);
    }

  } else {
    res.sendStatus(400);
  }
});

// Subscribe to selected article categories
app.post("/subscribe", function(req, res) {
  if (req.body) {
  	var subscription = new Subscription(req.body);
		var invalidFormat = subscription.validateSync();

		if (invalidFormat) {
			res.sendStatus(400);
		} else {
      Subscription.findOne({'email': req.body.email}, 'categories', function(err, result) {
        if (!result) {  // create a new database entry if this user doesn't exist
          subscription.save(function(err) {
            if (err) {
              console.log(err);
              res.sendStatus(500);  // internal server error
            } else {
              res.sendStatus(200);
            }
          });
        } else {  // update subscription for existing user
          var newCategories = subscription.categories.filter(function(item) {
            return result.categories.indexOf(item) == -1;
          });

          if (newCategories.length > 0) {
            var updatedList = result.categories.concat(newCategories);
            Subscription.update({email: req.body.email}, {categories: updatedList}, function(err) {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          } else {  // do nothing if the requested categories are identical to the existing subscription
            res.sendStatus(200);
          }

        }
      });

    }
  } else {
    res.sendStatus(400);
  }
});

// Unsubscribe from selected article categories
app.post("/unsubscribe", function(req, res) {
  if (req.body) {
    var unsubscription = new Unsubscription(req.body);
    var invalidFormat = unsubscription.validateSync();

    if (invalidFormat) {
      res.sendStatus(400);
    } else {
      Subscription.findOne({email: req.body.email}, 'categories', function(err, result) {
        if (!result) {  // email address cannot be found
          res.sendStatus(400);
        } else {
          var updatedList = result.categories.filter(function(item) {
            return unsubscription.categories.indexOf(item) == -1;  // remove the requested categories from the list
          });

          if ((updatedList.length == 0) || (unsubscription.categories.length == 0)) {  // completely remove the user from the database
            Subscription.remove({email: req.body.email}, function(err) {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          } else {  // update database entry
            Subscription.update({email: req.body.email}, {categories: updatedList}, function(err) {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          }
        }
      });

    }
  } else {
    res.sendStatus(400);
  }
});

// Remove database contents (for testing purposes, **not for production**)
app.post("/reset", function(req, res) {
  Subscription.remove({}, function(err) {
  	if (err) {
  		console.log(err);
  		res.sendStatus(500);
  	} else {
			Article.remove({}, function(err) {
				if (err) {
					console.log(err);
					res.sendStatus(500);
				} else {
					mailer.contacted = [];  // reset the running list of contacted subscribers
					res.sendStatus(200);
				}
			});
  	}
  });
});

// Initialize the app
var server = app.listen(process.env.PORT || 8080, function() {
	var port = server.address().port;
	console.log("App now running on port", port);
});
exports.server = server;
