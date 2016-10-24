// Press Association technical test (test cases)
// Author: Stuart Phillips

var request = require('request');
var expect = require("chai").expect;
var fs = require('fs');
var mongoose = require('mongoose');

var mailer = require("../../app/api/mailer.js");
var newsApi = require("../../app/api/api.js");
var baseUrl = "http://localhost:" + newsApi.server.address().port;

exports.tests = describe("article upload endpoint", function() {

  it("stores an article and mails it to a subscriber", function(done) {
    fs.readFile('./test/upload/sample.json', 'utf8', function(err, data) {  // read in sample JSON file
      if (err) throw err;
      article = JSON.parse(data);

      var subscription = {email: "johnsmith@gmail.com", categories: ["sports", "world"]};
      request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);

        request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          expect(mailer.contacted).to.deep.equal([subscription.email]);  // check that the email dispatch stub was called

          request.post({url: baseUrl + "/reset"}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
          });
        });
      });

    });
  });

  it("stores an article without a provided date", function(done) {
    fs.readFile('./test/upload/sample.json', 'utf8', function(err, data) {
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
    fs.readFile('./test/upload/sample.json', 'utf8', function(err, data) {
      if (err) throw err;
      article = JSON.parse(data);
      for (var i = 0; i < article.categories.length; i++) {
        article.categories[i] = "  " + article.categories[i].toUpperCase() + "  ";  // add some whitespace and change case
      }
      request.post({url: baseUrl + "/upload", body: article, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  it("fails with an invalid date format", function(done) {
    fs.readFile('./test/upload/sample.json', 'utf8', function(err, data) {
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
    fs.readFile('./test/upload/sample.json', 'utf8', function(err, data) {
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
