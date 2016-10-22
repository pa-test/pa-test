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

exports.tests = describe ("subscription reset endpoint", function() {

  it("removes all user subscriptions", function(done) {
    request.post({url: baseUrl + "/reset"}, function(err, res, body) {
    expect(res.statusCode).to.equal(200);

      User.where({}).count(function(err, count) {
        expect(count).to.equal(0);
        done();
      });
    });
  });

});
