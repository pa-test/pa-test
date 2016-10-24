// Press Association technical test (test cases)
// Author: Stuart Phillips

var request = require('request');
var expect = require("chai").expect;
var fs = require('fs');
var mongoose = require('mongoose');

var Subscription = require("../../app/schemas/subscription.js").Subscription;
var newsApi = require("../../app/api/api.js");
var baseUrl = "http://localhost:" + newsApi.server.address().port;

exports.tests = describe("user unsubscription endpoint", function() {

  it("unsubscribes a user from provided categories", function(done) {
  	var subscription = {email: "johnsmith@gmail.com", categories: ["sports", "world"]};
  	var unsubscription = {email: "johnsmith@gmail.com", categories: ["sports"]};
    request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
    	expect(res.statusCode).to.equal(200);

    	subscription.categories = ["world"];  // expect to remove 'sports'
    	request.post({url: baseUrl + "/unsubscribe", body: unsubscription, json: true}, function(err, res, body) {
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

  it("unsubscribes a user from all categories (explicitly provided)", function(done) {
  	var subscription = {email: "johnsmith@gmail.com", categories: ['sports', 'world']};
  	var unsubscription = {email: "johnsmith@gmail.com", categories: ['sports', 'world']};

    request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
    	expect(res.statusCode).to.equal(200);

    	request.post({url: baseUrl + "/unsubscribe", body: unsubscription, json: true}, function(err, res, body) {
	      expect(res.statusCode).to.equal(200);

	      Subscription.where({email: subscription.email}).count(function(err, count) {
	        expect(count).to.equal(0);
	        done();
	      });

      });
  	});
  });

  it("unsubscribes a user from all categories (not explicitly provided)", function(done) {
  	var subscription = {email: "johnsmith@gmail.com", categories: ["sports", "world"]};
    request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
    	expect(res.statusCode).to.equal(200);

    	request.post({url: baseUrl + "/unsubscribe", body: {email: "johnsmith@gmail.com"}, json: true}, function(err, res, body) {
	      expect(res.statusCode).to.equal(200);

	      Subscription.where({email: subscription.email}).count(function(err, count) {
	        expect(count).to.equal(0);
	        done();
	      });

      });
  	});
  });

  it("ignores already unsubscribed categories", function(done) {
  	var subscription = {email: "johnsmith@gmail.com", categories: ["technology"]};
  	var unsubscription = {email: "johnsmith@gmail.com", categories: ["sports", "world"]};

  	request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
  		expect(res.statusCode).to.equal(200);

	    request.post({url: baseUrl + "/unsubscribe", body: unsubscription, json: true}, function(err, res, body) {
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

  it("fails with invalid provided categories", function(done) {
  	var subscription = {email: "johnsmith@gmail.com", categories: ["sports", "world"]};
    request.post({url: baseUrl + "/subscribe", body: subscription, json: true}, function(err, res, body) {
    	expect(res.statusCode).to.equal(200);

    	var unsubscription = subscription; unsubscription.categories = ["invalid", "categories"];
    	request.post({url: baseUrl + "/unsubscribe", body: unsubscription, json: true}, function(err, res, body) {
	      expect(res.statusCode).to.equal(400);

        request.post({url: baseUrl + "/reset"}, function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          done();
        });
      });

  	});
  });

});
