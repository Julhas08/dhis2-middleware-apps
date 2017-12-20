/**
* Dashboard default load and todays created facilities
* @method {GET} - dashboardController.index
* @return {TABLE} - list of today's facility information    
*/
var express = require('express');
var router = express.Router();
var dashboardController = require('../src/app/controllers/DashboardController');
// Dashboard Default Load
router.all('/dashboard', dashboardController.index);

// Dashboard Searching
router.post('/dashboard-search',dashboardController.dashboardFacilityInfoSearch);

// Dashboard JSON Payload generates
router.post('/dashboard-json-payload',dashboardController.dashControllerJsonPayload);


module.exports = router;
