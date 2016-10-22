// Press Association technical test (test cases)
// Author: Stuart Phillips

var request = require('request');
var expect = require("chai").expect;
var fs = require('fs');
var mongoose = require('mongoose');

var Article = require("../../app/schemas/article.js").Article;
var User = require("../../app/schemas/user.js").User;

var newsApi = require("../../app/api/api.js");
var baseUrl = "http://localhost:" + newsApi.server.address().port;

exports.tests = describe("user unsubscription endpoint", function() {

  it("unsubscribes a user from provided categories", function(done) {
      request.post({url: baseUrl + "/subscribe", body: {email: "johnsmith@gmail.com", categories: ["sports", "world"]}, json: true}, function(){});
      request.post({url: baseUrl + "/unsubscribe", body: {email: "johnsmith@gmail.com", categories: ["sports", "world"]}, json: true}, function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it("ignores valid provided categories that the user is already unsubscribed from", function(done) {
      request.post({url: baseUrl + "/unsubscribe", body: {email: "johnsmith@gmail.com", categories: ["sports", "world"]}, json: true}, function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it("fails with invalid provided categories", function(done) {
      request.post({url: baseUrl + "/unsubscribe", body: {email: "johnsmith@gmail.com", categories: ["invalid", "categories"]}, json: true}, function(err, res, body) {
      expect(res.statusCode).to.equal(400);
      done();
    });
  });

});
