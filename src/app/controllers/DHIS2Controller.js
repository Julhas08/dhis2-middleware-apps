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

exports.facilityCreateJSONPayloadSendToDHIS2 = function (req, res) {

	//return an array of objects according to key, value, or key and value matching
		/*function getObjects(obj, key, val) {
		    var objects = [];
		    for (var i in obj) {
		        if (!obj.hasOwnProperty(i)) continue;
		        if (typeof obj[i] == 'object') {
		            objects = objects.concat(getObjects(obj[i], key, val));    
		        } else 
		        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
		        if (i == key && obj[i] == val || i == key && val == '') { //
		            objects.push(obj);
		        } else if (obj[i] == val && key == ''){
		            //only add if the object is not already in the array
		            if (objects.lastIndexOf(obj) == -1){
		                objects.push(obj);
		            }
		        }
		    }
		    return objects;
		}

		//return an array of values that match on a certain key
		function getValues(obj, key) {
		    var objects = [];
		    for (var i in obj) {
		        if (!obj.hasOwnProperty(i)) continue;
		        if (typeof obj[i] == 'object') {
		            objects = objects.concat(getValues(obj[i], key));
		        } else if (i == key) {
		            objects.push(obj[i]);
		        }
		    }
		    return objects;
		}

		//return an array of keys that match on a certain value
		function getKeys(obj, val) {
		    var objects = [];
		    for (var i in obj) {
		        if (!obj.hasOwnProperty(i)) continue;
		        if (typeof obj[i] == 'object') {
		            objects = objects.concat(getKeys(obj[i], val));
		        } else if (obj[i] == val) {
		            objects.push(i);
		        }
		    }
		    return objects;
		}


		var json = '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","ID":"44","str":"SGML","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';

		var js = JSON.parse(json);

		//example of grabbing objects that match some key and value in JSON
		console.log(getObjects(js,'ID','SGML'));*/
	

	// Receive JSON Payload
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

	// Date and random arbitary function call from function.js		 	
			 	let rootResource = fn.getTodayYYYYMMDD()+''+fn.getRandomArbitrary(100,1000000);

	// Base64 authentication, call from function.js		 	
			 	var auth = fn.base_64_auth(username,password);
	// Base url development for data handling		 	
			 	var url = baseUrl+resourcePath+rootResource;
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

