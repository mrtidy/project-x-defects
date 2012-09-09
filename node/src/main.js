"use strict";

var express = require('express'),
  util = require('util'),
  winston = require('winston');

process.on('uncaughtException', function (e) {
  winston.warn(util.format('WARNING uncaught exception: %s', e));
});

/*
 * Create and configure the HTTP server.
 *
 * - The view options turns off layouts because I just want Node for the JS logic and static for client.
 * - The express.bodyParser call tells Express to set req.body to the parsed value of the request body.
 * - The app.router call just tells Express where the routes come in priority.
 * - The express.static call sets up the static content and makes it the very last thing (before error handling).
 */
var app = express.createServer();
app.configure(function () {
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(app.router);
  app.use('/', express.static(__dirname + '/../../public'));
});

/*
 * This is a generic error handler for when an uncaught error happens within a route.
 */
app.error(function (err, req, res, next) {
  if (!res.status) {
    res.status = 500;
  }
  if (!err) {
    res.json('unexpected server failure');
  } else {
    res.json(err.message);
  }
});

/*
 * This is exposed so that automated tests may start up instances of the
 * server on random ports for testing.
 */
exports.createServer = function (port) {
  if (port) {
    app.listen(port);
  }
  return app;
};

/*
 * If nobody is loading this module then they must be trying to run the service.
 * We'll start up using a default port of 8000 but will prefer an environment
 * variable PORT if available.
 */
if (!module.parent) {
  var port = process.env.PORT || 8000;
  var startService = function (options, callback) {
    callback(null, exports.createServer(options.port));
  };
  startService({port: port}, function (err, server) {
    if (err) {
      return winston.error(util.format('Error starting server: %s', err.message));
    }
    winston.info('Server listening on http://localhost:' + port);
  });
}
