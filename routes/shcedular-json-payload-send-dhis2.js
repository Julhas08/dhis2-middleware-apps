/**
* New facility JSOn payload sends to DHIS2
* @method {POST} jsonPayload.dashControllerJsonPayload
* @return {JSON} payload for dhis2    
*/

var express = require('express');
var router  = express.Router();
var cron    = require('node-cron');
var jsonPayload = require('../src/app/controllers/HrisToDhis2AutoDataSendController');
//router.post('/',jsonPayload.facilityCreateJSONPayloadSendToDHIS2);

// Running the cron job in every five minutes 
cron.schedule('* * * * *', function(){
  //console.log('running a task every minute');
  jsonPayload.facilityCreateJSONPayloadSendToDHIS2();
});

module.exports = router;
