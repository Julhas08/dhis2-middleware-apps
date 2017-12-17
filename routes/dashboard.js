/**
* Dashboard default load and todays created facilities
* @method {GET} - dashboardController.index
* @return {TABLE} - list of today's facility information    
*/
var express = require('express');
var router = express.Router();
var dashboardController = require('../src/app/controllers/DashboardController');
router.all('/', dashboardController.index);
module.exports = router;
