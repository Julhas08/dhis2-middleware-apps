/**
* @name DashboardController
* @author Julhas Sujan
* @version 1.0.0
*/

'use strict';
var request=require('request');
var dbConnect = require('../config/db-config');
var fn = require('../function');
var logger4js = require('../../logger/log4js');

/**
* Dashboard Default Load in GET Method
*/

module.exports.index = function index(req, res) {

        var userList = [];
		var createdFacilities=[];
		var db= dbConnect.getConnection();
	// Searching Parameters	
		var dateSince 		= fn.getTodayYYYYMMDD();
		var displayLimit	= 50;
		var requestType		= "createdSince";

	//  Database user table data
		var user;
		db.query('SELECT * FROM users').then(user => {
			userList.push(user);
	    }).catch(error => {
	    	logger4js.error("Users Information retriving issue: ",error);
	        console.log(error); // print the error;
	    });	   	

	// API data from HRIS  
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
	// APi DB Connection String				
			if(db){
	// Pull all API information		
			getApiSettingsInformation("hris").then(apiInfo => {

				let apiData      = JSON.parse(JSON.stringify(apiInfo));
				let baseUrl 	 = apiData.base_url;
				let resourcePath = apiData.resource_path;
				let username     = apiData.username;
				let password     = apiData.password;
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
					//console.log(error + " :: " + response + " :: " + body);
					//console.log(body);
					var data          = JSON.stringify(JSON.parse(body));
					var facilityInfo1 = data.replace('[','');
					var facilityInfo  = facilityInfo1.replace(']','');

					//var data = ('#{createdFacilitiesList}').toString();
					var pdata = data.replace(/&quot;/g, '"');
					var obj   = JSON.parse(pdata);

					res.render('dashboard', {
				      users: userList,
				      createdFacilitiesList: obj
				   });
				});

			});

		} else {
			logger4js.getLoggerConfig().error("Database Connection Error!");
		}			 
		
};

/**
* Dashboard Facility Information Search
*/

exports.dashboardFacilityInfoSearch = function (req, res) {

		var requestType 	= req.body.requestType;
		var dateFrom 		= req.body.dateFrom;
		var displayLimit 	= req.body.displayLimit;
		var date            = dateFrom.split("-");
		var dateSince       = date[0]+date[1]+date[2];		
		var db= dbConnect.getConnection();
		//console.log("RequestType: "+requestType+", DateSince: "+dateSince+", DisplayLimit: "+displayLimit);
		// API data from HRIS  
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
	// APi DB Connection String				
		if(db){
	// Pull all API information		
			getApiSettingsInformation("hris").then(apiInfo => {

				let apiData      = JSON.parse(JSON.stringify(apiInfo));
				let baseUrl 	 = apiData.base_url;
				let resourcePath = apiData.resource_path;
				let username     = apiData.username;
				let password     = apiData.password;
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
				var obj           = JSON.parse(pdata);
				logger4js.getLoggerConfig().debug("Facility info search result: ",obj);
				logger4js.getLoggerConfig().error("Error in searching result!",error);
				res.render('dashboard-search-result', {
			      createdFacilitiesList: obj
			    });

			});	
		});

		} else {
			logger4js.getLoggerConfig().error("Database Connection Error!");
		}	
	};	

/**
* JSON Payload Generate
*/
exports.dashControllerJsonPayload = function (req, res) {
		var requestType 	= req.body.requestType;
		var dateFrom 		= req.body.dateFrom;
		var displayLimit 	= req.body.displayLimit;
		var date            = dateFrom.split("-");
		var dateSince       = date[0]+date[1]+date[2];

		var db= dbConnect.getConnection();
		//console.log("RequestType: "+requestType+", DateSince: "+dateSince+", DisplayLimit: "+displayLimit);
		// API data from HRIS   
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
	// APi DB Connection String				
		if(db){
	// Pull all API information		
			getApiSettingsInformation("hris").then(apiInfo => {

				let apiData      = JSON.parse(JSON.stringify(apiInfo));
				let baseUrl 	 = apiData.base_url;
				let resourcePath = apiData.resource_path;
				let username     = apiData.username;
				let password     = apiData.password;
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
			        code       :  json[i].code,
			        name       :  json[i].name,
			        shortName  :  json[i].name,
			        displayName:  json[i].name,
			        displayShortName: json[i].name,
			        openingDate:  json[i].created_at,
			        divisionId :  json[i].division_code,
			        divisionName: json[i].division_name,
			        districtId :  json[i].district_code,
			        districtName: json[i].district_name,
			        upazilaId  :  json[i].upazila_code,
			        upazilaName:  json[i].upazila_name,
			        latitude   :  json[i].latitude,
			        longitude  :  json[i].longitude,
			        status     :  0,
			        parentCode :  json[i].division_code+''+json[i].district_code+''+json[i].upazila_code
			        
			    });

			    logger4js.getLoggerConfig().debug("JSON Payload for DHIS2: ",jsonArr);
			    logger4js.getLoggerConfig().error(error);
			}
	// DHIS2 Login	

			res.render('json-payload', {
		    	createdFacilitiesList: JSON.stringify(jsonArr)
		    });

			});	
			});

		} else {
			logger4js.getLoggerConfig().error("Database Connection Error!");
		}
	};		