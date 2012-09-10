"use strict";

/*
 * This file contains the logic for handling requests and responses regarding
 * defects.
 */

var async = require('async'),
  csv = require('csv'),
  pg = require('pg'),
  util = require('util'),
  winston = require('winston');

var postgresUrl = process.env.DATABASE_URL || 'tcp://defects:defects@localhost/defects';

var insertTemplate = 'INSERT INTO %s(date, sev1, sev2, sev3, to_verify, opened, total) VALUES ($1, $2, $3, $4, $5, $6, $7)';
var selectTemplate = 'SELECT date, sev1, sev2, sev3, to_verify, opened, total FROM %s';

/*
 * GET /defects will return the list of all defects available.  If there are
 * no defects the this returns 404.
 */
exports.get = function (req, res) {
  pg.connect(postgresUrl, function(err, client) {
    client.query(util.format(selectTemplate, 'metadata'), function (err, metadataResult) {
      if(err != null) {
        winston.warn(util.format('unexpected error querying metadata: %s', err));
        res.send(err, 500);
        return;
      }
      if(metadataResult.rows.length < 1) {
        res.send(404);
        return;
      }
      if(metadataResult.rows.length > 1) {
        winston.error('metadata corrupt; cleanup required');
        res.send('metadata table is corrupt', 500);
        return;
      }
      var defectData = { metadata: {}, defects: [] };
      defectData.metadata = {
        date: metadataResult.rows[0].date,
        severities: [metadataResult.rows[0].sev1, metadataResult.rows[0].sev2, metadataResult.rows[0].sev3],
        toVerify: metadataResult.rows[0].to_verify,
        opened: metadataResult.rows[0].opened,
        total: metadataResult.rows[0].total
      };
      pg.connect(postgresUrl, function(err, client) {
        client.query(util.format(selectTemplate, 'defect_count'), function (err, defectsResult) {
          if(err != null) {
            winston.warn(util.format('unexpected error querying defect counts: %s', err));
            res.send(err, 500);
            return;
          }
          if(defectsResult.rows.length < 1) {
            res.send(404);
            return;
          }
          async.forEach(defectsResult.rows, function (item, next) {
            defectData.defects.push({
              date: item.date,
              severities: [item.sev1, item.sev2, item.sev3],
              toVerify: item.to_verify,
              opened: item.opened,
              total: item.total
            });
            next();
          }, function (error) {
            res.json(defectData, 200);
          });
        });
      });
    });
  });
};

/*
 * POST /defects currently only accepts CSV data and then returns JSON data.
 * The first row of the CSV is required and the values there are stored as the
 * metadata until it is changed.  We expect the format of the raw data to be
 * date, some number of columns of defects opened on the date by severity,
 * total defects left to verify, total defects opened on the date, and then
 * the total defects.
 */
exports.post = function (req, res) {
  if(!req.is('text/csv')) {
    res.send('Content-Type: text/csv required.', 400);
    return;
  }

  var rowLength;
  csv().fromStream(req).on('data', function (data, index) {
    if(index > 0) {
      pg.connect(postgresUrl, function(err, client) {
        client.query(util.format(insertTemplate, 'defect_count'), [
          data[0], data[1], data[2], data[3], data[4], data[5], data[6]],
          function (err, defectsResult) {
            if(err != null) {
              winston.warn(util.format('unexpected error inserting detect counts: %s', err));
              res.send(err, 500);
              return;
            }
          }
        );
      });
    } else {
      rowLength = data.length;
      pg.connect(postgresUrl, function(err, client) {
        client.query(util.format(insertTemplate, 'metadata'), [
          data[0], data[1], data[2], data[3], data[4], data[5], data[6]],
          function (err, defectsResult) {
            if(err != null) {
              winston.warn(util.format('unexpected error inserting metadata: %s', err));
              res.send(err, 500);
              return;
            }
          }
        );
      });
    }
  }).on('end', function (count) {
    res.redirect('/defects');
  });
};
