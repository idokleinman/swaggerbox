'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var data = require('./api/helpers/data');
// var settings = require('./settings');
// var box = require('./api/controllers/box');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

config.swaggerSecurityHandlers = {
  oauth2: function securityHandler1(req, authOrSecDef, scopesOrApiKey, cb) {
    // your security code
    cb();
  }
};


SwaggerExpress.create(config, async function(err, swaggerExpress) {
  if (err) { throw err; }

  await data.generateMockData(25);

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/box']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/box');
  }
});
