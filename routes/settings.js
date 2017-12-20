/**
* API Settings Form
* @method {GET} apiSettings.index
* @return api setting form    
*/

var express = require('express');
var router = express.Router();
// APi Settings Controller Import
var settings = require('../src/app/controllers/SettingsController');

// API Setting form load
router.get('/api-settings', settings.index);

// API settings Controller
router.post('/api-settings-crud',settings.apiCrudPOST);

// Schedular setting form load
router.get('/schedular-setup', settings.settingsFormIndex);

// Schedular setting CURD
router.post('/schedular-settings-crud', settings.schedularCrudPOST);

module.exports = router;
