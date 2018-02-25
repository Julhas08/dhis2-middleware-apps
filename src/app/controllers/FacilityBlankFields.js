/**
* @name FacilityBlankFields Controller
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
let url  = "https://centraldhis.mohfw.gov.bd/dhismohfw/";
module.exports.facilityDropdownLevelOne= function index(req, res) {

// Base url development for data handling					
		//let url  = "http://localhost:8080/dhis/api/organisationUnits.jspn?filter=level:eq:2";		 	
		let url  = "https://centraldhis.mohfw.gov.bd/dhismohfw/api/organisationUnits.jspn?filter=level:eq:2";		 	

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
			res.render('blank-fields-app',{
				responseInfoTwo: responseInfoTwo
			})				
			
		}); // End of request				

};


module.exports.facilityDropdownLevelTwo= function index(req, res) {
		let facilityId = req.body.facilityId;

		let level = req.body.level;
// Base url development for data handling					
		//let url  = "http://localhost:8080/dhis/api/organisationUnits/"+facilityId+"/fields=id,name,level,children[id,displayName]&paging=false";
		let url  = "https://centraldhis.mohfw.gov.bd/dhismohfw/api/organisationUnits/"+facilityId+"/fields=id,name,level,children[id,displayName]&paging=false";

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

module.exports.facilityBlankFieldsSearch= function index(req, res) {
		let facilityId = req.body.facilityId;
// Base url development for data handling					
		//let url  = "http://localhost:8080/dhis/api/organisationUnits/"+facilityId+"/fields=id,name,level,children[*]&paging=false";
		let url  = "https://centraldhis.mohfw.gov.bd/dhismohfw/api/organisationUnits/"+facilityId+"/fields=id,name,level,children[*]&paging=false";

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

module.exports.blankFieldsFacilityUpdateInfoDisplay= function index(req, res) {

		let facilityId = req.param('uid');	 	
		let url  = "https://centraldhis.mohfw.gov.bd/dhismohfw/api/organisationUnits/"+facilityId;		 	

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
			let responseInfo    = JSON.parse(body);
			let displayName = responseInfo.displayName;
			let code = responseInfo.code;
			let email = responseInfo.email;
			let phoneNumber = responseInfo.phoneNumber;

			res.render('blank-fields-facility-update',{
				displayName: responseInfo.displayName,
				code: responseInfo.id
			})				
			
		}); // End of request		

};

module.exports.blankFieldsFacilityEdit= function index(req, res) {

		let facilityId = req.param('uid');	

		let code = req.body.code;	 	
		let description = req.body.description;	 	
		let closedDate = req.body.closedDate;	 	
		let commentclosedDate = req.body.commentclosedDate;	 	
		let urlDHIS = req.body.url;	 	
		let address = req.body.address;	 	
		let email = req.body.email;	 	
		let phoneNumber = req.body.phoneNumber;	 	
		let latitude = req.body.latitude;
		let longitude = req.body.longitude;

		let url  = "https://centraldhis.mohfw.gov.bd/dhismohfw/api/organisationUnits/"+facilityId;		 	
		let jsonPayload = {
                "code": facilityCode,
                "id": id,
                "level": (parentLevel)+1,
                "name": orgJsonList.name,
                "shortName": orgJsonList.shortName,
                "openingDate": "2018-02-21"
            }
// JSON Payload options development		 	
	 	let options = {
		    method: 'PUT',
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
			let responseInfo    = JSON.parse(body);
			let displayName = responseInfo.displayName;
			let code = responseInfo.code;
			let email = responseInfo.email;
			let phoneNumber = responseInfo.phoneNumber;

			res.render('blank-fields-facility-update',{
				displayName: responseInfo.displayName,
				code: responseInfo.id
			})				
			
		}); // End of request		

};