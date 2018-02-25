/**
* @name DHIS2Controller
* @author Julhas Sujan
* @version 1.0.0
*/

'use strict';
let request=require('request');
let dbConnect = require('../config/db-config');
let fn = require('../function');
let logger4js = require('../../logger/log4js');

/**
* JSON payload send to DHIS2
* Create new facility request in dhis2 facility register app
*/

// APi Connection String		
let db= dbConnect.getConnection();
module.exports = {	

// API Information return SQL function	
	getApiSettingsInformation: function(name) {
    	let conName = name;
	    return db.task('getApiSettingsInformation', t => {
            return t.oneOrNone('SELECT * FROM api_settings where connection_name=$1',conName)
                .then(apiInfo => {
                    return apiInfo;
            	});
        });
	},	
	
	sendInformationInDHISAutomaticMode: function(requestType, modeType,exportLimit,exportFromDays){

// Receive JSON Payload		

	//let requestType 	= "createdSince";
	//let dateFrom 		= req.body.dateFrom;
	let displayLimit 	= exportLimit;
	//let date            = dateFrom.split("-");
	let dateSince       = fn.getTodayYYYYMM()+exportFromDays;

	
	console.log("Dynamic dateSince: ",dateSince);


	/********************************************************************
	**********************Generate JSON Payload from HRIS System ********
	********************************************************************/	
	this.getApiSettingsInformation("hris").then(apiInfo => {

		let apiData      = JSON.parse(JSON.stringify(apiInfo));
		let baseUrl 	 = apiData.base_url;
		let resourcePath = apiData.resource_path;
		let tokenType    = apiData.token_type;
		let token        = apiData.token_string;

		let apiUrl = baseUrl+resourcePath+requestType+"="+dateSince+"&client_id=123551&offset=1&limit="+displayLimit;
		
		let options = {
			url: apiUrl,
			method: 'GET',
			headers: {
			  'X-Auth-Token': token
			},
			from: {
			  mimeType: 'application/json'
			}
		};

// Database API information		
		function getApiSettingsInformation(name) {
	    	let conName = name;
		    return db.task('getApiSettingsInformation', t => {
		            return t.oneOrNone('SELECT * FROM api_settings where connection_name=$1',conName)
		                .then(apiInfo => {
		                    return apiInfo;
		                });
		        });
		}

	// Request send to DHIS2 Data Store Manager				
		request(options, function(error, response, body) {

			let data          = JSON.stringify(JSON.parse(body));
			let facilityInfo1 = data.replace('[','');
			let facilityInfo  = facilityInfo1.replace(']','');
			let pdata         = data.replace(/&quot;/g, '"');
			let json          = JSON.parse(pdata);
			let jsonArr       = [];
			let i, status;
	// JSON Payload Generate		
			for(i = 0; i < json.length; i++) {

					let openingDate = (json[i].created_at).split(" ");
					let shortName     = json[i].name.split(" "); 
					jsonArr.push({
				        code       	:  json[i].code,
				        name       	:  json[i].name,
				        shortName  	:  shortName[0]+' '+shortName[1]+' '+shortName[2],
				        displayName	:  json[i].name,
				        displayShortName: json[i].name,
				        openingDate	:  openingDate[0],
				        divisionId 	:  json[i].division_code,
				        divisionName:  json[i].division_name,
				        districtId 	:  json[i].district_code,
				        districtName:  json[i].district_name,
				        upazilaId  	:  json[i].upazila_code,
				        upazilaName	:  json[i].upazila_name,
				        latitude   	:  json[i].latitude,
				        longitude  	:  json[i].longitude,
				        status     	:  status,
				        parentCode 	:  json[i].division_code+''+json[i].district_code+''+json[i].upazila_code
				        
				    });
				
				logger4js.getLoggerConfig().debug("JSON Payload for DHIS2: ",jsonArr);
				logger4js.getLoggerConfig().error(error);

				let jsonData   = jsonArr;
				let orgCode	   = json[i].code;
				let orgName    = json[i].name;
				let parentCode = json[i].division_code+''+json[i].district_code+''+json[i].upazila_code;
				
	/********************************************************************
	********************** DHIS2 Connection Open and Payload posting*****
	********************************************************************/		
		
		    if(db){	
		// Pull all API information		
				getApiSettingsInformation("dhis2_central").then(apiInfo => {

					let apiData      = JSON.parse(JSON.stringify(apiInfo));
					let baseUrl 	 = apiData.base_url;
					let resourcePath = apiData.resource_path;
					let username     = apiData.username;
					let password     = apiData.password;	
					var data         = JSON.stringify(jsonData);
					var pdata        = data.replace(/&quot;/g, '"');
					var json         = JSON.stringify(JSON.parse(pdata));
					let facilityInfo1= json.replace('[','');
					let jsonPayload  = facilityInfo1.replace(']','');

				// Base64 authentication, call from function.js		 	
				 	let auth = fn.base_64_auth(username,password);

				/**********************************************************
				***************Data Transaction Mode**********************
				*******************Automatic(1)/ Manual(0)*****************/

				let method = null, operationMode=null, operationType=null, url, parentUID, orgJsonListPost,objOfResponse,parentIdJSON,message =null ,logType = null;
				let resourcePathAutomatic = "organisationUnits";

				/************************************************
				************New Facility Creation Panel**********
				*************************************************/
						if(requestType=="createdSince") {

							operationMode = "automatic";
							operationType = "new_facility";
							method = "GET";

				// Parent ID search base url 			
							url = baseUrl+'organisationUnits.json?fields=id&filter=code:eq:'+parentCode;
				// Search parent 11 digits UID
								
								let options = {
								    method: method,
								    url: url,
								    //body: orgJsonListPost,
								    headers: { 
								    	'Authorization': auth,
								        'Accept'       : 'application/json',
								        'Content-Type' : 'application/json' 
								    },
									from: {
									 	 mimeType: 'application/json'
									}
								};
				// Request for searching parent UID
								request(options, function(error, response, body){

								objOfResponse = JSON.parse(body);
				// If server not connected or internal error		
								if(objOfResponse.httpStatusCode!=500){

				// Check Parent id exist or not | if no parent just skip this id	
									if(objOfResponse.organisationUnits[0] == null || objOfResponse.organisationUnits[0] == 'undefined'){

										console.log("Sorry no parent found!");
										message ="Sorry no parent found!";
										// System log table updates
										logType ="undefined";
										db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+operationMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
									    }).catch(error => {
									    	console.log("Sorry could not update log table for httpStatusCode of parent searching!");
									    });
									} else {
									
									parentIdJSON  = objOfResponse.organisationUnits[0];	
									parentUID     = parentIdJSON.id;
				// Append parent id with existing json payload    
		                    		const newJsonPayload = JSON.parse(jsonPayload);
		                    		newJsonPayload.parent = {"id":parentUID};
		                    		orgJsonListPost = JSON.stringify(newJsonPayload);

		        // POST Data URL for Facility Management 
									let postUrl  = baseUrl+resourcePathAutomatic;
									
				// POST JSON Payload Authentication Options	 	
								 	let options = {
									    method: 'POST',
									    url: postUrl,
									    body: orgJsonListPost,
									    headers: { 
									    	'Authorization': auth,
									        'Accept': 'application/json',
									        'Content-Type': 'application/json' 
									    },
										from: {
										  mimeType: 'application/json'
										}
									}; // end of options
									//console.log("options",options);
				// Posting JSON payload to DHIS2			
									request(options, function(error, response, body) {
		
										if(response.statusCode == 409){
											logger4js.getLoggerConfig().error("Conflicting in data posting! ",response.statusCode);
											console.log("conflict");
											//res.end('409');
											message = "Conflicting in data posting!";
											logType ="conflict";
										} else if (response.statusCode == 'undefined'){
											logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
											//res.end('500');
											console.log("Internal server error! response.statusCode:",response.statusCode);
											message = "Internal server error!";
											logType ="internal error";
										}else if(response.statusCode == 500){
											logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
											//res.end('500');
											console.log("Internal server error! response.statusCode:",response.statusCode);
											message = "Internal server error!";
											logType ="internal error";
										} else if(response.statusCode == 200 || response.statusCode == 201){
											logger4js.getLoggerConfig().debug("Successfully submitted json payload! ",response.statusCode);
											console.log("success");
											//res.end('201');
											message = "Successfully submitted json payload!";
											logType ="success";
										}
								// System log table updates
										db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+operationMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
									    }).catch(error => {
									    	console.log("Sorry could not update log table for posting in dhis2");
									    });			
										
									}); // End of request

									} // end if statement of parent id return	
									} else {
										message ="Internal Server Error";
										// System log table updates
										db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','internal server error','"+operationMode+"','"+operationType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
									    }).catch(error => {
									    	console.log("Sorry could not update log table!"+message);
									    });
									} // End of internal or server error
													
								});	

					/************************************************
					************Existing Facility Update Panel*******
					*************************************************/		
						} else if(requestType=="updatedSince") {
							status = 2;

					/************************************************
					************Facility Delete Panel****************
					*************************************************/		
						} else if(requestType=="deletedSince") {
							operationMode = "automatic";
							operationType = "delete_facility";
							method = "GET";

				// Parent ID search base url 			
							url = baseUrl+'organisationUnits.json?fields=id&filter=code:eq:'+orgCode;
				// Search parent 11 digits UID
								
								let options = {
								    method: method,
								    url: url,
								    //body: orgJsonListPost,
								    headers: { 
								    	'Authorization': auth,
								        'Accept'       : 'application/json',
								        'Content-Type' : 'application/json' 
								    },
									from: {
									 	 mimeType: 'application/json'
									}
								};
				// Request for searching parent UID
								request(options, function(error, response, body){									
									objOfResponse = JSON.parse(body);
									//console.log("objOfResponse",objOfResponse);
				// If server not connected or internal error		
								if(objOfResponse.httpStatusCode!=500){

				// Check Parent id exist or not | if no parent just skip this id		 	
								
									if(objOfResponse.organisationUnits[0] == null || objOfResponse.organisationUnits[0] == 'undefined'){
										logType = "error";
										console.log("Sorry no facility found for deleteing org unit!");
										message ="Sorry no facility found!";

										// System log table updates
										db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+operationMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
									    }).catch(error => {
									    	console.log("Sorry could not update log table for httpStatusCode of facility code searching!");
									    });
									} else {
									
									parentIdJSON  = objOfResponse.organisationUnits[0];	
									parentUID     = parentIdJSON.id;
				// Append parent id with existing json payload    
		                    		const newJsonPayload = JSON.parse(jsonPayload);
		                    		newJsonPayload.parent = {"id":parentUID};
		                    		orgJsonListPost = JSON.stringify(newJsonPayload);

		        // POST Data URL for Facility Management 
									let postUrl  = baseUrl+resourcePathAutomatic;
									
				// POST JSON Payload Authentication Options	 	
								 	let options = {
									    method: 'DELETE',
									    url: postUrl,
									    //body: orgJsonListPost,
									    headers: { 
									    	'Authorization': auth,
									        'Accept': 'application/json',
									        'Content-Type': 'application/json' 
									    },
										from: {
										  mimeType: 'application/json'
										}
									}; // end of options
									//console.log("options",options);
				// Posting JSON payload to DHIS2			
									request(options, function(error, response, body) {
		
										if(response.statusCode == 409){
											logger4js.getLoggerConfig().error("Conflicting in data posting! ",response.statusCode);
											console.log("conflict");
											//res.end('409');
											message = "Conflicting in data posting!";
											logType ="conflict";
										} else if (response.statusCode == 'undefined'){
											logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
											//res.end('500');
											console.log("Internal server error! response.statusCode:",response.statusCode);
											message = "Internal server error!";
											logType ="internal error";
										}else if(response.statusCode == 500){
											logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
											//res.end('500');
											console.log("Internal server error! response.statusCode:",response.statusCode);
											message = "Internal server error!";
											logType ="internal error";
										} else if(response.statusCode == 200 || response.statusCode == 201){
											logger4js.getLoggerConfig().debug("Successfully deleted facility information! ",response.statusCode);
											console.log("success");
											//res.end('201');
											message = "deleted facility information!";
											logType ="success";
										}
								// System log table updates
										db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+operationMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
									    }).catch(error => {
									    	console.log("Sorry could not update log table for posting in dhis2");
									    });			
										
									}); // End of request

									} // end if statement of parent id return	
									} else {
										message ="Internal Server Error";
										// System log table updates
										db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+operationMode+"','"+operationType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
									    }).catch(error => {
									    	console.log("Sorry could not update log table!"+message);
									    });
									} // End of internal or server error
													
								});
						}				

				}).catch(error => {
				    console.log(error);
				});

				jsonArr = [];
				
			} // end if 		
			} // End loop 

		});	// End Request body
	});// End APi Settings info	   		
}
};	

