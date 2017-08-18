module.exports.register = function (handlebars) {
  handlebars.registerHelper('ifEquals', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
