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
/*
* JSON payload send to DHIS2
* Create new facility request in dhis2 facility register app
*/

exports.facilityCreateJSONPayloadSendToDHIS2 = function (req, res) {

	// Receive JSON Payload
		//console.log("JSON Payload Received in Controller: ",req.body);
		var jsonPayload   = JSON.stringify(req.body);

	// API Information return SQL function	
		function getApiSettingsInformation(name) {
	    	let conName = name;
		    return db.task('getApiSettingsInformation', t => {
		            return t.oneOrNone('SELECT * FROM api_settings where connection_name=$1',conName)
		                .then(apiInfo => {
		                    return apiInfo;
		                });
		        });
		}
	
	// APi Connection String		
		let db= dbConnect.getConnection();		
			if(db){
	// Pull all API information		
			getApiSettingsInformation("dhis2").then(apiInfo => {

				let apiData      = JSON.parse(JSON.stringify(apiInfo));
				let baseUrl 	 = apiData.base_url;
				let resourcePath = apiData.resource_path;
				let username     = apiData.username;
				let password     = apiData.password;

	// Base64 authentication
				function base_64_auth(username,password) { 
			      return "Basic " + new Buffer(username + ':' + password).toString( "base64" );
			 	}

			 	var auth = base_64_auth(username,password);
			 	console.log("auth", auth);
			 	var url = baseUrl+resourcePath+"3234345354";
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
				request(options, function(error, response, body) {

					if(response.statusCode == 409){
						logger4js.getLoggerConfig().error("Conflicting in data posting! ",response.statusCode);
						console.log("conflict");
						res.end('409');
					} else if(response.statusCode == 500){
						logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
						res.end('500');
						console.log("internal");
					} else if(response.statusCode == 200 || response.statusCode == 201){
						logger4js.getLoggerConfig().debug("Successfully submitted json payload! ",response.statusCode);
						console.log("success");
						res.end('201');
					}	
					
				});

		    })
		    .catch(error => {
		        console.log(error);
		    });
		} else {
			logger4js.getLoggerConfig().error("Database Connection Error!");
		}

	
};	

