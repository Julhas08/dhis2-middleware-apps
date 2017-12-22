/**
* @method {GET} apiSettings.index
* @return api setting form    
*/

var express = require('express');
var router = express.Router();
// APi Settings Controller Import
var reports = require('../src/app/controllers/ReportsController');

// System Log
router.get('/system-log', reports.index);
// Dashboard Searching
router.post('/log-history-search',reports.index);

module.exports = router;
