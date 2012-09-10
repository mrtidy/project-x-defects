"use strict";

/*
 * This file contains the logic for handling requests and responses regarding
 * defects.
 */

var winston = require('winston');

/*
 * GET /defects will return the list of all defects available.  If there are
 * no defects the this returns 404.
 */
exports.get = function (req, res) {
  var defectData = {
    "metadata": {
      date: "Date",
      severities: ["Sev2", "Sev3", "Sev4"],
      toVerify: "To Verify",
      opened: "Total Open Defects",
      total: "Total Bugs"
    }, 
    "defects": [
      {date: "2012-01-01", severities: [1, 229, 61], toVerify: 159, opened: 291, total: 1223},
      {date: "2012-01-02", severities: [1, 232, 61], toVerify: 147, opened: 294, total: 1228},
      {date: "2012-01-03", severities: [2, 238, 67], toVerify: 147, opened: 306, total: 1240},
      {date: "2012-01-04", severities: [2, 237, 66], toVerify: 154, opened: 305, total: 1252},
      {date: "2012-01-05", severities: [2, 228, 59], toVerify: 170, opened: 289, total: 1261},
      {date: "2012-01-06", severities: [2, 228, 59], toVerify: 162, opened: 289, total: 1263},
      {date: "2012-01-07", severities: [2, 228, 59], toVerify: 162, opened: 289, total: 1263},
      {date: "2012-01-08", severities: [2, 228, 59], toVerify: 161, opened: 289, total: 1263},
      {date: "2012-01-09", severities: [1, 224, 62], toVerify: 158, opened: 287, total: 1267}
    ]
  };
	res.send(defectData);
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
  var defectData = {
    "metadata": {
      date: "Date",
      severities: ["Sev2", "Sev3", "Sev4"],
      toVerify: "To Verify",
      opened: "Total Open Defects",
      total: "Total Bugs"
    }, 
    "defects": [
      {date: "2012-01-01", severities: [1, 229, 61], toVerify: 159, opened: 291, total: 1223},
      {date: "2012-01-02", severities: [1, 232, 61], toVerify: 147, opened: 294, total: 1228},
      {date: "2012-01-03", severities: [2, 238, 67], toVerify: 147, opened: 306, total: 1240}
    ]
  };
  res.send(defectData);
};
