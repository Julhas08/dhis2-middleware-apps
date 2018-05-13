/**
* @name MultipleDHISInteroperability Controller
* @author Julhas Sujan
* @version 1.0.0
*/

'use strict';
let request   = require('request');
let dbConnect = require('../config/db-config');
let fn        = require('../function');
let logger4js = require('../../logger/log4js');
// APi Connection String		
let db = dbConnect.getConnection();
// Base64 authentication, call from function.js		 	
let auth = fn.base_64_auth("julhas","Julhas@dhis2.28");
//let auth = fn.base_64_auth("admin","district");
let urlPath  = "https://centraldhis.mohfw.gov.bd/dhismohfw/";
//let urlPath  = "http://localhost:8080/dhis/";

module.exports.multipleDhisInteroperabilityDashboard= function index(req, res) {

// Base url development for data handling		 	
		let url  = urlPath+"api/organisationUnits.jspn?filter=level:eq:2";		 	

// JSON Payload options development		 	
	 	let options = {
		    method: 'GET',
		    url: url,
		    //body: jsonPayload,
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
			let responseInfo      = JSON.parse(body);
			let responseInfoTwo = responseInfo.organisationUnits;
			//console.log(responseInfoFour);
			res.render('multiple-dhis-interoperability-dashboard',{
				responseInfoTwo: responseInfoTwo
			})				
			
		}); // End of request				

};

module.exports.multipleDHISSearchResultDisplay = function index(req, res) {
		let facilityId = req.body.facilityId;
// Base url development for data handling	
		let url  = urlPath+"api/organisationUnits/"+facilityId+"/fields=id,name,level,children[*]&paging=false";

// JSON Payload options development		 	
	 	let options = {
		    method: 'GET',
		    url: url,
		    //body: jsonPayload,
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
			let responseInfo      = JSON.parse(body);
			res.send(responseInfo)				
			
		}); // End of request				

};

// Multiple dhis interoperability data submit
module.exports.multipleDHISSearchResultSubmit = function index(req, res) {
		let facilityId = req.body.facilityId;
// Base url development for data handling	
		let url  = urlPath+"api/organisationUnits/"+facilityId+"/fields=id,name,shortName,code,openingDate, parent, level,children[*]&paging=false";

// JSON Payload options development		 	
	 	let options = {
		    method: 'GET',
		    url: url,
		    //body: jsonPayload,
		    headers: { 
		    	'Authorization': auth,
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
			from: {
			  mimeType: 'application/json'
			}
		}; // end of options

	
		request(options, function(error, response, body) {			
			let responseInfo      = JSON.stringify(JSON.parse(body));			
			console.log(responseInfo);


			
		}); // End of get request				

};