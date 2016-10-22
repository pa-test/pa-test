// Press Association technical test
// Author: Stuart Phillips

var mongoose = require('mongoose');

var categoriesValidator = require("../validation/categories.js").categoriesValidator;
var normaliseArray = require("../validation/categories.js").normaliseArray;

var UserSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, required: true},
  categories: {type: [String], set: normaliseArray, validate: categoriesValidator, required: true}
});

exports.User = mongoose.model('User', UserSchema);
