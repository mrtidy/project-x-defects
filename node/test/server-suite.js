"use strict";

/*
 * Simple test suite for the server.
 *
 * IMPORTANT: this suite is not intended to be an exhaustive test of the
 * APIs.  The unit tests should thoroughly be testing the API logic.  This
 * suite should just make a strategic pass through the APIs to catch any
 * run-time surprises do to having the server infrastructure running.
 */

var APIeasy = require('api-easy'),
  assert = require('assert'),
  winston = require('winston');

// using a random port in hopes of avoiding conflicts with other tests
var port = Math.floor(Math.random() * 8000 + 10000);

/*
 * Turn off the default logging so we only see test results in the console.
 */
winston.add(winston.transports.File, { filename: '/tmp/main.log' });
winston.remove(winston.transports.Console);

/*
 * Start up the service infrastructure so that we can do live API testing.
 */
var service = require('../src/main').createServer(port);

var validCsv = '';

var serverSuite = APIeasy.describe('API.server');
serverSuite.use('localhost', port)
  .path('defects')
  
  .discuss('When I uploading valid CSV data')
    .setHeader('Content-Type', 'text/csv')
    .post(validCsv)
      .expect(302)
  .undiscuss()
serverSuite.export(module);

