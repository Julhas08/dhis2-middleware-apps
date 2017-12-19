/**
* @name DHIS2Controller
* @author Julhas Sujan
* @version 1.0.0
*/

'use strict';
var request=require('request');
var dbConnect = require('../config/db-config');
var fn = require('../function');
var logger4js = require('../../logger/log4js');

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
	getJSONPayloadFromHris: function(){

	let requestType 	= "createdSince";
	//let dateFrom 		= req.body.dateFrom;
	let displayLimit 	= 1;
	//let date            = dateFrom.split("-");
	let dateSince       = "20171201";
		if(db){
	/********************************************************************
	**********************Generate JSON Payload from HRIS System ********
	*********************************************************************/	
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

		request(options, function(error, response, body) {

			var data          = JSON.stringify(JSON.parse(body));
			var facilityInfo1 = data.replace('[','');
			var facilityInfo  = facilityInfo1.replace(']','');
			var pdata         = data.replace(/&quot;/g, '"');
			var json          = JSON.parse(pdata);
			var jsonArr       = [];

			for(var i = 0; i < json.length; i++) {

				jsonArr.push({
			        code       	:  json[i].code,
			        name       	:  json[i].name,
			        shortName  	:  json[i].name,
			        displayName	:  json[i].name,
			        displayShortName: json[i].name,
			        openingDate	:  json[i].created_at,
			        divisionId 	:  json[i].division_code,
			        divisionName:  json[i].division_name,
			        districtId 	:  json[i].district_code,
			        districtName:  json[i].district_name,
			        upazilaId  	:  json[i].upazila_code,
			        upazilaName	:  json[i].upazila_name,
			        latitude   	:  json[i].latitude,
			        longitude  	:  json[i].longitude,
			        status     	:  0,
			        parentCode 	:  json[i].division_code+''+json[i].district_code+''+json[i].upazila_code
			        
			    });

			    logger4js.getLoggerConfig().debug("JSON Payload for DHIS2: ",jsonArr);
			    //logger4js.getLoggerConfig().error(error);
			}			
			
	// JSON Posting Start
				var jsonPayload = JSON.stringify(jsonArr);
				return jsonPayload;

			});	// End Request body 
		});// End APi Settings info


		} else {
			logger4js.getLoggerConfig().error("Database Connection Error!");
		}	
	},	
	facilityCreateJSONPayloadSendToDHIS2: function(){

	// Receive JSON Payload		

		let requestType 	= "createdSince";
		//let dateFrom 		= req.body.dateFrom;
		let displayLimit 	= 10;
		//let date            = dateFrom.split("-");
		let dateSince       = "20171201";


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

			var data          = JSON.stringify(JSON.parse(body));
			var facilityInfo1 = data.replace('[','');
			var facilityInfo  = facilityInfo1.replace(']','');
			var pdata         = data.replace(/&quot;/g, '"');
			var json          = JSON.parse(pdata);
			var jsonArr       = [];

			//console.log("JSON Length: ",json.length)
			for(var i = 0; i < json.length; i++) {

					jsonArr.push({
				        code       	:  json[i].code,
				        name       	:  json[i].name,
				        shortName  	:  json[i].name,
				        displayName	:  json[i].name,
				        displayShortName: json[i].name,
				        openingDate	:  json[i].created_at,
				        divisionId 	:  json[i].division_code,
				        divisionName:  json[i].division_name,
				        districtId 	:  json[i].district_code,
				        districtName:  json[i].district_name,
				        upazilaId  	:  json[i].upazila_code,
				        upazilaName	:  json[i].upazila_name,
				        latitude   	:  json[i].latitude,
				        longitude  	:  json[i].longitude,
				        status     	:  0,
				        parentCode 	:  json[i].division_code+''+json[i].district_code+''+json[i].upazila_code
				        
				    });
				
				    logger4js.getLoggerConfig().debug("JSON Payload for DHIS2: ",jsonArr);
				    logger4js.getLoggerConfig().error(error);

				let jsonData   = jsonArr;
				let orgCode	   = json[i].code;
				let parentCode = json[i].division_code+''+json[i].district_code+''+json[i].upazila_code;
		/********************************************************************
		********************** DHIS2 Connection Open and Payload posting*****
		********************************************************************/
			
			
			    if(db){	
			// Pull all API information		
					getApiSettingsInformation("dhis2").then(apiInfo => {

						let apiData      = JSON.parse(JSON.stringify(apiInfo));
						let baseUrl 	 = apiData.base_url;
						let resourcePath = apiData.resource_path;
						let username     = apiData.username;
						let password     = apiData.password;	
						var data          = JSON.stringify(jsonData);
						var pdata         = data.replace(/&quot;/g, '"');
						var json          = JSON.stringify(JSON.parse(pdata));
						let facilityInfo1 = json.replace('[','');
						let jsonPayload  = facilityInfo1.replace(']','');

					 	let rootResource = fn.getTodayYYYYMMDD()+''+fn.getRandomArbitrary(100,1000000);
					// Base64 authentication, call from function.js		 	
					 	let auth = fn.base_64_auth(username,password);
					// Base url development for data handling		 	
					 	var url = baseUrl+resourcePath+orgCode+'_'+parentCode;
					// JSON Payload options development		 	
					 	var options = {
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
						};
					// Posting JSON payload to DHIS2			
						request(options, function(error, response, body) {

							if(response.statusCode == 409){
								logger4js.getLoggerConfig().error("Conflicting in data posting! ",response.statusCode);
								console.log("conflict");
								//res.end('409');
							} else if(response.statusCode == 500){
								logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
								//res.end('500');
								console.log("internal");
							} else if(response.statusCode == 200 || response.statusCode == 201){
								logger4js.getLoggerConfig().debug("Successfully submitted json payload! ",response.statusCode);
								console.log("success");
								//res.end('201');
							}
							
						});
					}).catch(error => {
					    console.log(error);
					});

					jsonArr = [];
					
				} // end if 		
				}

			});	// End Request body 
		});// End APi Settings info
	   		

	}
	
	
};	

