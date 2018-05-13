/**
* @name Exchange Controller
* @author Julhas Sujan
* @version 1.0.0
*/

'use strict';
let request   = require('request');
let dbConnect = require('../config/db-config');
let fn        = require('../function');
let logger4js = require('../../logger/log4js');

// APi Connection String		
let db= dbConnect.getConnection();

module.exports = {	
	// This method is for processing source data into queues and automatic mode data exchange		
	exchangeMessages: function(channelType,jsonPayload,orgCode,orgName,parentCode,exchangeMode,operationType,queueId,durability,status){
	// Database API information		
		function getChannelSettingsInformation(name) {
		    return db.task('getChannelSettingsInformation', t => {
	            return t.oneOrNone('select aps.*,q.* from api_settings aps left join queues q on q.id=aps.queue where channel_type = $1',name)
	                .then(apiInfo => {
	                    return apiInfo;
	                });
		    });
		}
		if(db){	

/********************************************************************
***************Message Send to Destination ****************** ********
********************************************************************/			    		
// Pull DHIS2 API Connection information		
		getChannelSettingsInformation(channelType).then(apiInfo => {

			let apiData 	 = JSON.parse(JSON.stringify(apiInfo));
			let baseUrl 	 = apiData.base_url;
			let resourcePath = apiData.resource_path;
			let username     = apiData.username;
			let password     = apiData.password;		
				
		 	let rootResource = fn.getTodayYYYYMMDD()+''+fn.getRandomArbitrary(100,1000000);
		// Base64 authentication, call from function.js		 	
		 	let auth = fn.base_64_auth(username,password);

			let url, parentUID, orgJsonListPost,objOfResponse,parentIdJSON,message =null ,logType = null;
			let resourcePathAutomatic = "organisationUnits";
		// Base url development for data handling					
				url  = baseUrl+resourcePath+orgCode+'_'+parentCode;		 	

		// JSON Payload options development		 	
			 	let options = {
				    method: 'POST',
				    url: url,
				    body: jsonPayload,
				    headers: { 
				    	'Authorization': auth,
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
					from: {
					  mimeType: 'application/json'
					}
				}; // end of eoptions
				//console.log("Options Post:",options);
		// Posting JSON payload to DHIS2			
				request(options, function(error, response, body) {

					//console.log(body);
					let message = null;
					let logType = null;									
					if(response.statusCode == 409){
						logger4js.getLoggerConfig().error("Conflicting in data posting! ",response.statusCode);
						console.log("conflict");
						message = "Conflicting in data posting!";
						logType ="conflict";
					} else if (response.statusCode == 'undefined'){
						logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
						console.log("internal error");
						message = "Internal server error!";
						logType ="internal error";
					}else if(response.statusCode == 500){
						logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
						//res.end('500');
						console.log("internal error");
						message = "Internal server error!";
						logType ="internal error";
					} else if(response.statusCode == 200 || response.statusCode == 201){
						logger4js.getLoggerConfig().debug("Successfully submitted json payload! ",response.statusCode);
						console.log("success");
						//res.end('201');
						message = "Successfully submitted json payload!";
						logType ="success";
					}
			// Add in queue detail table
			
				db.query("INSERT into queue_detail (queue_id,durability,exchange_mode,operation_type,message,response_code,status, created_at) VALUES('"+apiData.queue+"','"+durability+"','"+exchangeMode+"','"+operationType+"','"+jsonPayload+"','"+response.statusCode+"','"+status+"','"+fn.getDateYearMonthDayMinSeconds()+"')").then(info => {	
						console.log("success");
					}).catch(error => {
				    	logger4js.getLoggerConfig().error("System log was not updated!",error);
				    	console.log(error);
				});	
			// System log table updates
				db.query("INSERT into system_log (module_name,table_name,exchange_mode,operation_type,log_type,message,created_date,status_code,queue) VALUES('DHIS2 Data Send','schedular_info','"+exchangeMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"'+'"+queueId+"')").then(info => {
				}).catch(error => {
			    	logger4js.getLoggerConfig().error("System log was not updated!",error);
			    	console.log(error);
			    });			
					
			}); // End of request of posting data to dhis2
								

		}).catch(error => {
		    console.log(error);
		}); 
	} // end if of DB checking 	
  		
	} // End of exchnageMessages()
};	// End of module

