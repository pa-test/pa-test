// Press Association technical test (test cases)
// Author: Stuart Phillips

var request = require('request');
var expect = require("chai").expect;
var fs = require('fs');

var newsApi = require("../app/api/api.js");
var baseUrl = "http://localhost:" + newsApi.server.address().port;

describe("News API", function() {

  describe("article upload endpoint", function() {

    it("stores an article", function(done) {
			fs.readFile('./test/sample.json', 'utf8', function(err, data) {
			  if (err) throw err;
			  article = JSON.parse(data);
			  request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
	        expect(res.statusCode).to.equal(200);
	        done();
	      });
			});
    });

    it("stores an article without a provided date", function(done) {
			fs.readFile('./test/sample.json', 'utf8', function(err, data) {
			  if (err) throw err;
			  article = JSON.parse(data);
			  delete article.publishDate;
			  request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
	        expect(res.statusCode).to.equal(200);
	        done();
	      });
			});
    });

    it("stores an article with badly formatted category names", function(done) {
      fs.readFile('./test/sample.json', 'utf8', function(err, data) {
        if (err) throw err;
        article = JSON.parse(data);
        for (var i = 0; i < article.categories.length; i++) {
          article.categories[i] = "  " + article.categories[i].toUpperCase() + "  ";
        }
        request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          done();
        });
      });
    });

    it("fails with an invalid date format", function(done) {
			fs.readFile('./test/sample.json', 'utf8', function(err, data) {
			  if (err) throw err;
			  article = JSON.parse(data);
			  article.publishDate = "Friday 21st October 2016";
			  request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
	        expect(res.statusCode).to.equal(400);
	        done();
	      });
			});
    });

    it("fails with invalid provided categories", function(done) {
      fs.readFile('./test/sample.json', 'utf8', function(err, data) {
        if (err) throw err;
        article = JSON.parse(data);
        article.categories = ["invalid", "categories"];
        request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
          expect(res.statusCode).to.equal(400);
          done();
        });
      });
    });

    it("fails without an article", function(done) {
    	request.post({url: baseUrl + "/upload"}, function(err, res, body) {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it("fails with invalid article format (includes missing metadata)", function(done) {
    	request.post({url: baseUrl + "/upload", body: {invalid: 'article'}, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

  });

  describe ("subscription reset endpoint", function() {

  	it("removes all user subscriptions", function(done) {
  		request.post({url: baseUrl + "/reset"}, function(err, res, body) {
  			expect(res.statusCode).to.equal(200);
  			done();
  		});
  	});

  });

  describe("user subscription endpoint", function() {

    it("subscribes a user to provided categories", function(done) {
    	request.post({url: baseUrl + "/subscribe", body: {categories: ["sports", "news"]}, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
      request.post({url: baseUrl + "/reset"});
    });

    it("ignores valid provided categories that the user is already subscribed to", function(done) {
    	request.post({url: baseUrl + "/subscribe", body: {categories: ["sports", "news"]}, json: true}, function(){});
    	request.post({url: baseUrl + "/subscribe", body: {categories: ["sports", "news"]}, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
      request.post({url: baseUrl + "/reset"});
    });

    it("fails without provided categories", function(done) {
    	request.post({url: baseUrl + "/subscribe"}, function(err, res, body) {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

    it("fails with invalid provided categories", function(done) {
    	request.post({url: baseUrl + "/subscribe", body: {categories: ["invalid", "categories"]}, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

  });

  describe("user unsubscription endpoint", function() {

    it("unsubscribes a user from provided categories", function(done) {
    	request.post({url: baseUrl + "/subscribe", body: {categories: ["sports", "news"]}, json: true}, function(){});
    	request.post({url: baseUrl + "/unsubscribe", body: {categories: ["sports", "news"]}, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("ignores valid provided categories that the user is already unsubscribed from", function(done) {
    	request.post({url: baseUrl + "/unsubscribe", body: {categories: ["sports", "news"]}, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("fails with invalid provided categories", function(done) {
    	request.post({url: baseUrl + "/unsubscribe", body: {categories: ["invalid", "categories"]}, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(400);
        done();
      });
    });

  });

});
