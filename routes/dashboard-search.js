/**
* Dashboard Facility Information Searching
* @method {POST} dashController.dashboardFacilityInfoSearch
* @return {TABLE} list of facility information    
*/
var express = require('express');
var router = express.Router();
var dashController = require('../src/app/controllers/DashboardController');
router.post('/',dashController.dashboardFacilityInfoSearch);
module.exports = router;
