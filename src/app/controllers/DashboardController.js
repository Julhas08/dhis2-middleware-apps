/**
* @name DashboardController
* @author Julhas Sujan
* @version 1.0.0
*/

'use strict';
let request=require('request');
let dbConnect = require('../config/db-config');
let fn = require('../function');
let logger4js = require('../../logger/log4js');

/**
* Dashboard Default Load in GET Method
*/

//let auth = fn.base_64_auth("admin","district");
let urlPath  = "http://103.247.238.82:8080/dhismohfw/api/me";

module.exports.login = function index(req, res) {

// Authentication based on DHIS2 user authentication	
	let username = req.body.username;
	let password = req.body.password;
// JSON Payload options development	
	let auth = fn.base_64_auth(username,password);	 	
	 	let options = {
		    method: 'GET',
		    url: urlPath,
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
			//console.log("response.statusCode:",response.statusCode);
			if(response.statusCode == 401 || response.statusCode == 409){
				logger4js.getLoggerConfig().error("Conflicting in data posting! ",response.statusCode);
				console.log("Not found");
				res.render('login',{
					responseCode: "Sorry! Username and Password is wrong in DHIS2."
				})

			} else if(response.statusCode == 500){
				logger4js.getLoggerConfig().error("Internal server error!",response.statusCode);
				res.end('500');
				console.log("internal");
			} else if(response.statusCode == 200 || response.statusCode == 201){
				let userList = [];
		        let notificationSummary = [];
		        let summaryList = [];
				let createdFacilities=[];
				let db= dbConnect.getConnection();
			// Searching Parameters	
				let dateSince 		= fn.getTodayYYYYMMDD();
				let displayLimit	= 50;
				let requestType		= "createdSince";

			//  Database user table data
				let user;
				db.query('SELECT * FROM users').then(user => {
					userList.push(user);
			    }).catch(error => {
			    	logger4js.error("Users Information retriving issue: ",error);
			        console.log(error); // print the error;
			    });	   	

			//  Notification center data load
				let notify;
				db.query("select operation_type, count(id) from system_log where operation_type != '' and log_type= 'success' group by operation_type")
				.then(notify => {

					notificationSummary.push(notify);
					let str0 = JSON.stringify(notificationSummary);
					let str1 = str0.replace('[','');
					let str2 = str1.replace(']','');
					summaryList= str2;

				}).catch(error => {
			    	logger4js.error("Notification center summary data query issue: ",error);
			        console.log(error); // print the error;
			    });	
			    

			// API data from HRIS  
			// API Information return SQL function	
				function getApiSettingsInformation(name) {
		    	let conName = name;
			    return db.task('getApiSettingsInformation', t => {
			            return t.oneOrNone('select ap.* from api_settings ap inner join middleware_instances mi on ap.connection_name=mi.id where mi.instance_type=$1',conName)
			                .then(apiInfo => {
			                    return apiInfo;
			                });
			        });
			    }
			// APi DB Connection String				
					if(db){
			// Pull all API information		
					getApiSettingsInformation("source").then(apiInfo => {

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
						console.log("options:",options);
						request(options, function(error, response, body) {
							//console.log(error + " :: " + response + " :: " + body);
							console.log(body);
							let data          = JSON.stringify(JSON.parse(body));
							let facilityInfo1 = data.replace('[','');
							let facilityInfo  = facilityInfo1.replace(']','');

							//let data = ('#{createdFacilitiesList}').toString();
							let pdata = data.replace(/&quot;/g, '"');
							let obj   = JSON.parse(pdata);
							//console.log("summaryList:",JSON.parse(summaryList));
							res.render('dashboard', {
						      users: userList,
						      summaryList:  JSON.parse(summaryList),
						      createdFacilitiesList: obj
						   });
						});

					});

				} else {
					logger4js.getLoggerConfig().error("Database Connection Error!");
				}
			}
			
		});			 
		
};

/**
* Dashboard Facility Information Search
*/

exports.dashboardFacilityInfoSearch = function (req, res) {

		let requestType 	= req.body.requestType;
		let dateFrom 		= req.body.dateFrom;
		let displayLimit 	= req.body.displayLimit;
		let date            = dateFrom.split("-");
		let dateSince       = date[0]+date[1]+date[2];		
		let db= dbConnect.getConnection();
		//console.log("RequestType: "+requestType+", DateSince: "+dateSince+", DisplayLimit: "+displayLimit);
		// API data from HRIS  
	// API Information return SQL function	
		function getApiSettingsInformation(name) {
		    	let conName = name;
			    return db.task('getApiSettingsInformation', t => {
			            return t.oneOrNone('select ap.* from api_settings ap inner join middleware_instances mi on ap.connection_name=mi.id where mi.instance_type=$1',conName)
			                .then(apiInfo => {
			                    return apiInfo;
			                });
			        });
			}
	// APi DB Connection String				
		if(db){
	// Pull all API information		
			getApiSettingsInformation("source").then(apiInfo => {

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

				let data          = JSON.stringify(JSON.parse(body));
				let facilityInfo1 = data.replace('[','');
				let facilityInfo  = facilityInfo1.replace(']','');
				let pdata         = data.replace(/&quot;/g, '"');
				let obj           = JSON.parse(pdata);
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
		let requestType 	= req.body.requestType;
		let dateFrom 		= req.body.dateFrom;
		let displayLimit 	= req.body.displayLimit;
		let date            = dateFrom.split("-");
		let dateSince       = date[0]+date[1]+date[2];

		let db= dbConnect.getConnection();
		//console.log("RequestType: "+requestType+", DateSince: "+dateSince+", DisplayLimit: "+displayLimit);
		// API data from HRIS   
		// API Information return SQL function	
		function getApiSettingsInformation(name) {
		    	let conName = name;
			    return db.task('getApiSettingsInformation', t => {
			            return t.oneOrNone('select ap.* from api_settings ap inner join middleware_instances mi on ap.connection_name=mi.id where mi.instance_type=$1',conName)
			                .then(apiInfo => {
			                    return apiInfo;
			                });
			        });
			}
	// APi DB Connection String				
		if(db){
	// Pull all API information		
			getApiSettingsInformation("source").then(apiInfo => {

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

			let data          = JSON.stringify(JSON.parse(body));
			let facilityInfo1 = data.replace('[','');
			let facilityInfo  = facilityInfo1.replace(']','');
			let pdata         = data.replace(/&quot;/g, '"');
			let json          = JSON.parse(pdata);
			let jsonArr       = [];

			for(let i = 0; i < json.length; i++) {

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