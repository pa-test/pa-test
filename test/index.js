// Press Association technical test (test cases)
// Author: Stuart Phillips

var request = require('request');
var expect = require("chai").expect;
var fs = require('fs');

var newsApi = require("../app/index.js");
var baseUrl = "http://localhost:8080";

describe("News API", function() {

  describe("Article upload endpoint", function() {

    it("stores an article", function() {
			fs.readFile('./test/sample.json', 'utf8', function(err, data) {
			  if (err) throw err;
			  article = JSON.parse(data);
			  request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
	        expect(res.statusCode).to.equal(200);
	      });
			});
    });

    it("stores an article without a provided date", function() {
			fs.readFile('./test/sample.json', 'utf8', function(err, data) {
			  if (err) throw err;
			  article = JSON.parse(data);
			  delete article.publishDate;
			  request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
	        expect(res.statusCode).to.equal(200);
	      });
			});
    });

    it("fails with no article", function() {
    	request(baseUrl + "/upload", function(err, res, body) {
        expect(res.statusCode).to.equal(400);
      });
    });

    it("fails with invalid article format", function() {
    	request.post({url: baseUrl + "/upload", body: {invalid: 'article'}, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(400);
      });
    });

  });

  describe("User subscription endpoint", function() {

    it("returns status 200", function() {
    	request(baseUrl + "/subscribe", function(err, res, body) {
        expect(res.statusCode).to.equal(200);
      });
    });

  });

});
