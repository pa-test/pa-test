// Press Association technical test
// Author: Stuart Phillips

exports.normaliseArray = function(input) {
  for (var i = 0; i < input.length; i++) {
    input[i] = input[i].toLowerCase();
    input[i] = input[i].replace(/\s/g, '');  // remove all white space characters
  }
  return input;
}

exports.categoriesValidator = {
  validator: function(input) {
    if (input.length == 0) return false;
    var allowedCategories = ["world", "politics", "technology", "culture", "business", "lifestyle", "sports"];
    for (var i = 0; i < input.length; i++) {
      if (allowedCategories.indexOf(input[i]) == -1) {
        return false;
      }
    }
    return true;
  },
  message: "Invalid article categories provided"
}
