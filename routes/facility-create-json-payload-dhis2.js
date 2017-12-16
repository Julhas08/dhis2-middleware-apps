/**
* New facility JSOn payload sends to DHIS2
* @method {POST} jsonPayload.dashControllerJsonPayload
* @return {JSON} payload for dhis2    
*/

var express = require('express');
var router = express.Router();
var jsonPayload = require('../src/app/controllers/DHIS2Controller');
router.post('/',jsonPayload.facilityCreateJSONPayloadSendToDHIS2);
module.exports = router;
