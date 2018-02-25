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
		
		facilityCreateJSONPayloadSendToDHIS2: function(requestType, modeType,exportLimit,exportFromDays){

	// Receive JSON Payload		

		//let requestType 	= "createdSince";
		//let dateFrom 		= req.body.dateFrom;
		let displayLimit 	= exportLimit;
		//let date            = dateFrom.split("-");
		let dateSince       = fn.getTodayYYYYMM()+exportFromDays;
		let operationMode   = "manual";
		let operationType   = null; 

		//console.log("Dynamic dateSince: ",dateSince);


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

	/**********************************************************
	****************DHIS2 Data Store Updates ******************
	**********************************************************/
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
				//console.log("HRIS data: ",data);
				let facilityInfo1 = data.replace('[','');
				let facilityInfo  = facilityInfo1.replace(']','');
				let pdata         = data.replace(/&quot;/g, '"');
				let json          = JSON.parse(pdata);
				let jsonArr       = [];
				let i, status;
		// Status Management 
				if(requestType=="createdSince") {
					status = 1;
					operationType = "created";
				} else if(requestType=="updatedSince") {
					status = 2;
					operationType = "updated";
				} if(requestType=="deletedSince") {
					status = 3;
					operationType = "deleted";
				}		
				//console.log("JSON: ",json)
		// JSON Payload Generate		
				for(i = 0; i < json.length; i++) {

						let unionCode,upazilaCode,facilityMinLevel,facilityMaxLevel;
						let openingDate  = (json[i].created_at).split(" "); 
					
					// Facility Level combination	
						if(json[i].district_code != null && json[i].upazila_code != null && json[i].union_code == null ){
							facilityMinLevel = 1;
							facilityMaxLevel = 2;
						} else {
							facilityMinLevel = 3;
							facilityMaxLevel = 6;
						}
						
						if(json[i].union_code == null){
							unionCode = '';
						} else {
							unionCode = json[i].union_code;
						}

						if(json[i].upazila_code == null){
							upazilaCode = '';
						} else {
							upazilaCode = json[i].upazila_code;
						}

						let shortName = json[i].name.split(" ");

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
					        upazilaId  	:  upazilaCode,
					        upazilaName	:  json[i].upazila_name,
					        unionId 	:  json[i].union_code,
					        unionName	:  json[i].union_name,
					        latitude   	:  json[i].latitude,
					        longitude  	:  json[i].longitude,
					        mobile1  	:  json[i].mobile1,
					        email1  	:  json[i].email1,
					        createdAt 	:  json[i].created_at,
					        status     	:  status,
					        parentCode 	:  json[i].division_code+''+json[i].district_code+''+upazilaCode+''+unionCode
					        
					    });
					
					logger4js.getLoggerConfig().debug("JSON Payload for DHIS2: ",jsonArr);
					logger4js.getLoggerConfig().error(error);

					let jsonData   = jsonArr;
					let orgCode	   = json[i].code;
					let orgName    = json[i].name;
					let parentCode = json[i].division_code+''+json[i].district_code+''+upazilaCode+''+unionCode;
					//console.log("jsonData:", jsonData);

		/********************************************************************
		********************** DHIS2 Connection Open and Payload posting*****
		********************************************************************/		
			
			    if(db){
			// Dynamic dhis instance selection and data send
			   	let infoList = [];
	 
				db.query('select api.connection_name, mi.min_level, mi.max_level from api_settings api inner join middleware_instances mi on mi.instance_short_code=api.connection_name inner join multiple_instances mui on mui.destination_id=mi.id').then(info => {

			// Iterate Data	
					for (let i = 0; i < info.length; i++) {

						let connection_name = info[i].connection_name;
						let min_level 		= info[i].min_level;
						let max_level 		= info[i].max_level;

			// Seperate facilities level	
				if(min_level == facilityMinLevel && max_level==facilityMaxLevel){
					console.log("min_level: "+min_level+" facilityMinLevel:"+facilityMinLevel+" max_level: "+max_level+" facilityMaxLevel:"+facilityMaxLevel);
					// Pull all API information		
					getApiSettingsInformation(connection_name).then(apiInfo => {

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
					 	let rootResource = fn.getTodayYYYYMMDD()+''+fn.getRandomArbitrary(100,1000000);
			
			// Base64 authentication, call from function.js		 	
					 	let auth = fn.base_64_auth(username,password);

						let url, parentUID, orgJsonListPost,objOfResponse,parentIdJSON,message =null ,logType = null;
						let resourcePathAutomatic = "organisationUnits";
					/*************************************************************
					******************Manual Mode data send to Data Store App*****
					**************************************************************/ 
			
			// Base url development for data handling					
							url  = baseUrl+resourcePath+orgCode+'_'+parentCode;		 	
							//console.log(jsonPayload);
			
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

			// Posting JSON payload to DHIS2			
							request(options, function(error, response, body) {

								let message = null;
								let logType = null;	
								//console.log("response:",response);
								/*console.log("body:",body);*/
								//console.log("response:",response);
								/*console.log("response:",response.statusCode);
								console.log("body-httpStatusCode:",body.httpStatusCode);
								console.log("Body-Message:",body.message);
								console.log("Body-Status COde:",body.httpStatus);*/
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
						// System log table updates
								db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+operationMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
								//db.query("INSERT into system_log (module_name,table_name,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
							    })
							    .catch(error => {
							    	logger4js.getLoggerConfig().error("System log was not updated!",error);
							    	console.log(error);
							    });			
								
							}); // End of request
					

					}).catch(error => {
					    console.log(error);
					});
				} else {

					// Pull all API information		
					getApiSettingsInformation(connection_name).then(apiInfo => {

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
					 	let rootResource = fn.getTodayYYYYMMDD()+''+fn.getRandomArbitrary(100,1000000);
			
			// Base64 authentication, call from function.js		 	
					 	let auth = fn.base_64_auth(username,password);

						let url, parentUID, orgJsonListPost,objOfResponse,parentIdJSON,message =null ,logType = null;
						let resourcePathAutomatic = "organisationUnits";
					/*************************************************************
					******************Manual Mode data send to Data Store App*****
					**************************************************************/ 
			
			// Base url development for data handling					
							url  = baseUrl+resourcePath+orgCode+'_'+parentCode;		 	
							//console.log(jsonPayload);
			
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

			// Posting JSON payload to DHIS2			
							request(options, function(error, response, body) {

								let message = null;
								let logType = null;	
								//console.log("response:",response);
								/*console.log("body:",body);*/
								//console.log("response:",response);
								/*console.log("response:",response.statusCode);
								console.log("body-httpStatusCode:",body.httpStatusCode);
								console.log("Body-Message:",body.message);
								console.log("Body-Status COde:",body.httpStatus);*/
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
						// System log table updates
								db.query("INSERT into system_log (module_name,table_name,operation_mode,operation_type,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+operationMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
								//db.query("INSERT into system_log (module_name,table_name,log_type,message,created_date,status_code) VALUES('DHIS2 Data Send','schedular_info','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"')").then(info => {
							    })
							    .catch(error => {
							    	logger4js.getLoggerConfig().error("System log was not updated!",error);
							    	console.log(error);
							    });			
								
							}); // End of request
					

					}).catch(error => {
					    console.log(error);
					});

				}		
			

					jsonArr = [];
				}

				}).catch(error => {		
					logger4js.getLoggerConfig().error("ERROR! ",error);
			        console.log(error); // print the error;
			    });
			
					
				} // end if 		
				} // End loop 

			});	// End Request body
		});// End APi Settings info	   		
	}
};	

