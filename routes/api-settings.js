/**
* API Settings Form
* @method {GET} apiSettings.index
* @return api setting form    
*/

var express = require('express');
var router = express.Router();
var apiSettings = require('../src/app/controllers/SettingsController');
router.get('/', apiSettings.index);
module.exports = router;
