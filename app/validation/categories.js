// Press Association technical test
// Author: Stuart Phillips

exports.normaliseArray = function(input) {
  for (var i = 0; i < input.length; i++) {
    input[i] = input[i].toLowerCase();  // convert to lower case
    input[i] = input[i].replace(/\s/g, '');  // remove all white space characters
  }
  return input;
}

var allowedCategories = ["world", "politics", "technology", "culture", "business", "lifestyle", "sports"];
exports.allowedCategories = allowedCategories;

exports.categoriesValidator =
[{
  // do not allow empty array for subscription/upload calls
  validator: function(input) {
    if (input.length == 0) return false;  // <- do not allow
    for (var i = 0; i < input.length; i++) {
      if (allowedCategories.indexOf(input[i]) == -1) {
        return false;
      }
    }
    return true;
  },
  message: "Invalid article categories provided"
},
{
  // allow empty array for unsubscription calls
  validator: function(input) {
    for (var i = 0; i < input.length; i++) {
      if (allowedCategories.indexOf(input[i]) == -1) {
        return false;
      }
    }
    return true;
  },
  message: "Invalid article categories provided"
}];
