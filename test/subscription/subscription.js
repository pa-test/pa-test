// Press Association technical test (test cases)
// Author: Stuart Phillips

var request = require('request');
var expect = require("chai").expect;
var fs = require('fs');
var mongoose = require('mongoose');

var Subscription = require("../../app/schemas/subscription.js").Subscription;
var newsApi = require("../../app/api/api.js");
var baseUrl = "http://localhost:" + newsApi.server.address().port;

exports.tests = describe("user subscription endpoint", function() {

  it("subscribes a user to provided categories", function(done) {
    var subscription = {email: "johnsmith@gmail.com", categories: ["sports", "world"]};
    request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
      expect(res.statusCode).to.equal(200);

      Subscription.where(subscription).count(function(err, count) {
        expect(count).to.equal(1);

        request.post({url: baseUrl + "/reset"}, function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          done();
        });
      });
    });
  });

  it("ignores duplicate subscriptions", function(done) {
    var subscription = {email: "johnsmith@gmail.com", categories: ["sports", "world"]};
    request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
      expect(res.statusCode).to.equal(200);

      request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);

        Subscription.where(subscription).count(function(err, count) {
          expect(count).to.equal(1);
          request.post({url: baseUrl + "/reset"}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
          });
        });
      });
    });
  });

  it("updates a subscription with new provided categories", function(done) {
    var subscription = {email: "johnsmith@gmail.com", categories: ["sports", "world"]};
    request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
      expect(res.statusCode).to.equal(200);

      subscription.categories = ["sports", "world", "technology"];
      request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
        expect(res.statusCode).to.equal(200);

        Subscription.find({email: subscription.email}, 'categories', function(err, result) {
          expect(result.length).to.equal(1);  // check that the email hasn't been duplicated
          expect(result[0].categories == subscription.categories);  // check that the categories updated correctly

          request.post({url: baseUrl + "/reset"}, function(err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
          });
        });
      });
    });
  });

  it("fails without provided categories", function(done) {
    request.post({url: baseUrl + "/subscribe", body: {email: "johnsmith@gmail.com"}, json: true}, function(err, res, body) {
      expect(res.statusCode).to.equal(400);
      done();
    });
  });

  it("fails with invalid provided categories", function(done) {
    request.post({url: baseUrl + "/subscribe", body: {email: "johnsmith@gmail.com", categories: ["invalid", "categories"]}, json: true}, function(err, res, body) {
      expect(res.statusCode).to.equal(400);
      done();
    });
  });

});
