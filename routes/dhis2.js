/**
* New facility JSOn payload sends to DHIS2
* @method {POST} jsonPayload.dashControllerJsonPayload
* @return {JSON} payload for dhis2    
*/
// Database Cooneciton String
let dbConnect = require('../src/app/config/db-config');
let db = dbConnect.getConnection();
let logger4js = require('../src/logger/log4js');
let express = require('express');
let router  = express.Router();
let cron    = require('node-cron');

// Transaction Automatic Mode
let transactionAutomaticMode = require('../src/app/controllers/DataTransactionAutomaticMode');

// Transaction Manual mode that means all operations will be based on DHIS2 Facility Register App
let transactionManualMode = require('../src/app/controllers/DataTransactionManualMode');
let dhis2Contorller     = require('../src/app/controllers/DHIS2Controller');

// Send JSON Payload from Dashboard to DHIS2
router.post('/facility-create-json-payload',dhis2Contorller.facilityCreateJSONPayloadSendToDHIS2);

// Schedular seetings information from schedular_info table
function getCronJobSettingsInformation(name) {
	let conName = name;
    return db.task('getApiSettingsInformation', t => {
        return t.oneOrNone('SELECT * FROM schedular_info where short_code=$1',conName)
            .then(info => {
            	return info;                
            }).catch(error=> {
        		console.log("Information not found");
        		logger4js.getLoggerConfig().error("Schedular cron job Information not found.");
    		});
    });
}

// Data Transaction mode (Automatic or Manual)
function getDataTrasactionMode() {

    return db.task('getApiSettingsInformation', t => {
        return t.oneOrNone('SELECT mode_type FROM data_transaction_mode')
            .then(info => {
            	return info;                
            }).catch(error=> {
        		console.log("Information not found");
        		logger4js.getLoggerConfig().error("Data transaction mode  Information not found.");
    		});
    });
}
getCronJobSettingsInformation("hris").then(info => {

	let data      = JSON.parse(JSON.stringify(info));
	let isEnable, minutes, hours, dayOfMonth, monthOfYear, dayOfWeek, year;

	if(data==null){
		isEnable  = 0;
	} else {

		if(data.is_enable == null){
			console.log("Cron job is not enabled.");
			logger4js.getLoggerConfig().error("Cron job is not enabled.");
		} else if ( data.minutes==null){
			console.log("Cron job minutes has not been set.");
			logger4js.getLoggerConfig().error("Cron job minutes has not been set.");
		} else if ( data.hours==null){
			console.log("Cron job hours has not been set.");
			logger4js.getLoggerConfig().error("Cron job hours has not been set.");
		} else {

			isEnable  = data.is_enable;		
			// Schedular core parameters
			minutes   = data.minutes;
			hours     = data.hours;

			console.log("Cron job is running! System Status: ", isEnable);
			logger4js.getLoggerConfig().error("Cron job status:",isEnable);
			let schedularTask = ["createdSince","updatedSince","deletedSince"];
			// if Schedular settings is on
			/**
			* * * * * *
			| | | | | | 
			| | | | | +-- Year              (range: 1900-3000)
			| | | | +---- Day of the Week   (range: 1-7, 1 standing for Monday)
			| | | +------ Month of the Year (range: 1-12)
			| | +-------- Day of the Month  (range: 1-31)
			| +---------- Hour              (range: 0-23)
			+------------ Minute            (range: 0-59)
			0 0 * * * *   Daily at midnight
			*/
			if(isEnable==1){
				// Get Data Transaction mode 
				let mode_type;
				getDataTrasactionMode().then(info => {
					let transactionMode = JSON.parse(JSON.stringify(info));
					
					if(transactionMode == null){
						mode_type = 0;
						console.log("Mode Type: Manual",transactionMode.mode_type);

					} else {
						if(transactionMode.mode_type==null){

							console.log("Sorry! No Setup data in transaction mode table.");
							logger4js.getLoggerConfig().error("Sorry! No Setup data in transaction mode table.");

						} else {
				/****** Automatic Transaction Mode is in seperate method *****/
							if(transactionMode.mode_type==1){
								console.log("Mode Type: Automatic",transactionMode.mode_type);
								let modeType = transactionMode.mode_type;
							// Running the cron job in every five minutes 
								cron.schedule(''+minutes+' '+hours+' * * *', function(){ // 14:59 
								  //console.log('running a task every minute');
								  for (let i = 0; i < schedularTask.length; i++) {	  	
								  	transactionAutomaticMode.sendInformationInDHISAutomaticMode(schedularTask[i], modeType);
								  }
								  
								});
				/*** Manual Transaction Mode ****/				
							} else {
								console.log("Mode Type: Manual",transactionMode.mode_type);
								let modeType = transactionMode.mode_type;
							// Running the cron job in every five minutes 
								cron.schedule(''+minutes+' '+hours+' * * *', function(){ // 14:59 
								  //console.log('running a task every minute');
								  for (let i = 0; i < schedularTask.length; i++) {	  	
								  	transactionManualMode.facilityCreateJSONPayloadSendToDHIS2(schedularTask[i], modeType);
								  }
								  
								});
							}
							
						}
					}
				});	
				
			}
		}
			
	}
}).catch(error => {
    console.log(error);
});	

module.exports = router;
