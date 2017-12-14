/**
* @name DashboardController
* @author Julhas Sujan
* @version 1.0.0
*/
var request=require('request');
var dbConnect = require('../config/db-config');
var fn = require('../function');
var logger4js = require('../../logger/log4js');
/*
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
		var token = "5624dd3b73fa4efee010dd9c8bdd3b8e2e1837ea276f4e6cc6c921985ce84630";
		var apiUrl = "https://hrm.dghs.gov.bd/api/1.0/facilities/get?"+requestType+"="+dateSince+"&client_id=123551&offset=1&limit="+displayLimit;
		var options = {
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
};
/*
* Dashboard Facility Information Search
*/

exports.dashboardFacilityInfoSearch = function (req, res) {

		var requestType 	= req.body.requestType;
		var dateFrom 		= req.body.dateFrom;
		var displayLimit 	= req.body.displayLimit;
		var date            = dateFrom.split("-");
		var dateSince       = date[0]+date[1]+date[2];

		console.log("RequestType: "+requestType+", DateSince: "+dateSince+", DisplayLimit: "+displayLimit);
		// API data from HRIS   
		var token = "5624dd3b73fa4efee010dd9c8bdd3b8e2e1837ea276f4e6cc6c921985ce84630";
		var apiUrl = "https://hrm.dghs.gov.bd/api/1.0/facilities/get?"+requestType+"="+dateSince+"&client_id=123551&offset=1&limit="+displayLimit;

		var params = {"message": "Y U No Work"};
		var options = {
			url: apiUrl,
			method: 'GET',
			headers: {
			  'X-Auth-Token': token
			},
			from: {
			  mimeType: 'application/json',
			  params: params
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
	};	

/*
* JSON Payload Generate
*/
exports.dashControllerJsonPayload = function (req, res) {
		var requestType 	= req.body.requestType;
		var dateFrom 		= req.body.dateFrom;
		var displayLimit 	= req.body.displayLimit;
		var date            = dateFrom.split("-");
		var dateSince       = date[0]+date[1]+date[2];

		console.log("RequestType: "+requestType+", DateSince: "+dateSince+", DisplayLimit: "+displayLimit);
		// API data from HRIS   
		var token = "5624dd3b73fa4efee010dd9c8bdd3b8e2e1837ea276f4e6cc6c921985ce84630";
		var apiUrl = "https://hrm.dghs.gov.bd/api/1.0/facilities/get?"+requestType+"="+dateSince+"&client_id=123551&offset=1&limit="+displayLimit;

		var options = {
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
		
	};		