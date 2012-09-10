"use strict";

/*
 * This file contains the logic for handling requests and responses regarding
 * defects.
 */

var csv = require('csv'),
  winston = require('winston');

// TODO - remove this; just temporarily holding the defect data in memory
// until I get DB hooked up
module.defectData;

/*
 * GET /defects will return the list of all defects available.  If there are
 * no defects the this returns 404.
 */
exports.get = function (req, res) {
  if(module.defectData) {
    res.send(module.defectData);
  } else {
    res.send(404);
  }
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

  var defectData = { metadata: {}, defects: [] };
  var rowLength;
  csv().fromStream(req).on('data', function (data, index) {
    if(index > 0) {
      defectData.defects.push({
        date: data[0],
        severities: data.slice(1, -3),
        toVerify: data[rowLength - 3],
        opened: data[rowLength - 2],
        total: data[rowLength - 1]
      });
    } else {
      rowLength = data.length;
      defectData.metadata = {
        date: data[0],
        severities: data.slice(1, -3),
        toVerify: data[rowLength - 3],
        opened: data[rowLength - 2],
        total: data[rowLength - 1]
      };
    }
  }).on('end', function (count) {
    module.defectData = defectData;
    res.send(defectData);
  });
};
