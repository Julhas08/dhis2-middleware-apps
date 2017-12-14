/**
* API Settings CRUD
* @method {POST} apiCrudController.apiCrudPOST
* @return    
*/
var express = require('express');
var router = express.Router();
var apiCrudController = require('../src/app/controllers/SettingsController');
router.post('/',apiCrudController.apiCrudPOST);
module.exports = router;
