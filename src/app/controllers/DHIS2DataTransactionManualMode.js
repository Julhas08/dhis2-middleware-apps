/**
* @name DHIS2Controller
* @author Julhas Sujan
* @version 1.0.0
*/

'use strict';
let request   = require('request');
let dbConnect = require('../config/db-config');
let fn        = require('../function');
let logger4js = require('../../logger/log4js');

/**
* JSON payload send to DHIS2
* Create new facility request in dhis2 facility register app
*/

// APi Connection String		
let db= dbConnect.getConnection();
module.exports = {	
	
	facilityCreateJSONPayloadSendToDHIS2: function(requestType, modeType, exportLimit, exportFromDays){

	// API Information return SQL function	
		function getApiSettingsInformation(name) {
		    	let conName = name;
			    return db.task('getApiSettingsInformation', t => {
			            return t.oneOrNone('select * from api_settings where channel_type = $1',conName)
			                .then(apiInfo => {
			                    return apiInfo;
			                });
			        });
			}
	// Receive JSON Payload		

		//let requestType 	= "createdSince";
		//let dateFrom 		= req.body.dateFrom;
		let displayLimit 	= exportLimit;
		//let date            = dateFrom.split("-");
		let dateSince       = "2018-03-03";
		//let dateSince       = fn.getTodayYYYYMM()+exportFromDays;
		let operationMode   = "manual";
		let operationType   = null; 

		/********************************************************************
		**********************Generate JSON Payload from HRIS System ********
		********************************************************************/	
		getApiSettingsInformation("source").then(apiInfo => {

			let apiData      = JSON.parse(JSON.stringify(apiInfo));
			let baseUrl 	 = apiData.base_url;
			let resourcePath = apiData.resource_path;
			let username     = apiData.username;
			let password     = apiData.password;

			// Base url development for data handling					
		    let urlApi  = baseUrl+resourcePath+dateSince;		 	
			// JSON Payload options development		 	
			 	let options = {
				    method: 'GET',
				    url: urlApi,
				    headers: { 
				    	'Authorization': fn.base_64_auth(username,password),
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
					from: {
					  mimeType: 'application/json'
					}
				}; // end of eoptions

	/**********************************************************
	****************DHIS2 Data Store Updates ******************
	**********************************************************/
			//console.log("options: ",options);
		// To get HRIS information			
			request(options, function(error, response, body) {
				
				let data = JSON.stringify(JSON.parse(body).organisationUnits);
			
		// Destination API Information dynamic
				getApiSettingsInformation("destination").then(apiInfo => {

					let apiData      = JSON.parse(JSON.stringify(apiInfo));
					let baseUrl 	 = apiData.base_url;
					let resourcePath = apiData.resource_path;
					let username     = apiData.username;
					let password     = apiData.password;	
					
				 	let rootResource = fn.getTodayYYYYMMDD()+fn.getRandomArbitrary(1,100);
				// Base64 authentication, call from function.js		 	
				 	let auth = fn.base_64_auth(username,password);
				 	let dateTime = fn.getTodayYYYYMMDD();
				 	let rootId  = 1000001;
				 	let parentCode,status;
				 // Status Management 
					if(requestType=="createdSince") {
						status = 'create';
						operationType = "created";
					} else if(requestType=="updatedSince") {
						status = 'update';
						operationType = "updated";
					} else if(requestType=="deletedSince") {
						status = 'delete';
						operationType = "deleted";
					}
				for (var i = 0; i < JSON.parse(body).organisationUnits.length; i++) {
					
					let orgCode=JSON.parse(body).organisationUnits[i].code;
					let orgName=JSON.parse(body).organisationUnits[i].name;

					if(orgCode=="undefined"){
						orgCode = dateTime;
					} 

					let parentCode = JSON.parse(body).organisationUnits[i].parent.code;
					
					if(parentCode=='undefined'){
						parentCode = dateTime;
					} 

					
				// JSON Payload options development	
					let jsonDataString = JSON.parse(body).organisationUnits[i];

				// Add new json key	
					jsonDataString.status=status;
					let openingDateString = jsonDataString.openingDate.split("T");
					jsonDataString.openingDate=openingDateString[0];

				// Remove some JSON key	
					delete jsonDataString.created;
					delete jsonDataString.lastUpdated;
					delete jsonDataString.href;

					 	let options = {
						    method: 'POST',
						    url: baseUrl+resourcePath+orgCode+'_'+parentCode,
						    body: JSON.stringify(jsonDataString),
						    headers: { 
						    	'Authorization': auth,
						        'Accept': 'application/json',
						        'Content-Type': 'application/json' 
						    },
							from: {
							  mimeType: 'application/json'
							}
						}; // end of eoptions
						request(options, function(error, response, body) {
							let message = null;
							let logType = null;	
							if(response.statusCode == 409){
								logger4js.getLoggerConfig().error("Conflicting in data posting! ",response.statusCode);
								console.log("conflict");
								//res.end('409');
								message = "Conflicting in data posting!";
								logType ="conflict";
							} else if (response.statusCode == 'undefined'){
								logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
								//res.end('500');
								console.log("internal error");
								message = "Internal server error!";
								logType ="internal error";
							}else if(response.statusCode == 500){
								logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
								console.log("internal error");
								message = "Internal server error!";
								logType ="internal error";
							} else if(response.statusCode == 200 || response.statusCode == 201){
								logger4js.getLoggerConfig().debug("Successfully submitted json payload! ",response.statusCode);
								console.log("success");
								message = "Successfully submitted json payload!";
								logType ="success";

							}
					// System log table updates
							db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+operationMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
						    })
						    .catch(error => {
						    	logger4js.getLoggerConfig().error("System log was not updated!",error);
						    	console.log(error);
						    });	

						});		
				} // end of for loop		
				}); // End of request of posting data to dhis2		
			}); // end of destination api pull section		

		});	// End Request body of Source
		//});// End APi Settings info	   		
	}
};	

