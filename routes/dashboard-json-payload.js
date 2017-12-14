/**
* Dashboard JSON Payload
* @method {GET} jsonPayload.dashControllerJsonPayload
* @return {JSON} payload for dhis2    
*/

var express = require('express');
var router = express.Router();
var jsonPayload = require('../src/app/controllers/DashboardController');
router.post('/',jsonPayload.dashControllerJsonPayload);
module.exports = router;
