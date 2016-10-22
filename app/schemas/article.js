// Press Association technical test
// Author: Stuart Phillips

var mongoose = require('mongoose');

var categoriesValidator = require("../validation/categories.js").categoriesValidator[0];
var normaliseArray = require("../validation/categories.js").normaliseArray;

var ArticleSchema = new mongoose.Schema({
  publishDate: {type: Date, default: Date.now, required: false},
  categories: {type: [String], set: normaliseArray, validate: categoriesValidator, required: true},
  article: {
  	author: {type: String, required: true},
  	headline: {type: String, required: true},
  	content: {type: String, required: true}
  }
});

exports.Article = mongoose.model('Article', ArticleSchema);
