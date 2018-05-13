/**
* Dashboard default load and todays created facilities
* @method {GET} - dashboardController.index
* @return {TABLE} - list of today's facility information    
*/
let express = require('express');
let router = express.Router();
let dashboardController = require('../src/app/controllers/DashboardController');
let queuesRoutes = require('../src/app/controllers/QueuesController');

// Dashboard Default Load
router.all('/dashboard', dashboardController.login);

// Dashboard Searching
router.post('/dashboard-search',dashboardController.dashboardFacilityInfoSearch);

// Dashboard JSON Payload generates
router.post('/dashboard-json-payload',dashboardController.dashControllerJsonPayload);

module.exports = router;
