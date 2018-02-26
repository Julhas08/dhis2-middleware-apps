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
//let auth = fn.base_64_auth("julhas","Julhas@dhis2.28");
let auth = fn.base_64_auth("admin","district");
//let urlPath  = "https://centraldhis.mohfw.gov.bd/dhismohfw/";
let urlPath  = "http://localhost:8080/dhis/";

module.exports.facilityDropdownLevelOne= function index(req, res) {

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
		let url  = urlPath+"api/organisationUnits/"+facilityId+"/fields=id,name,level,children[id,displayName]&paging=false";

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

module.exports.blankFieldsFacilityUpdateInfoDisplay= function index(req, res) {

		let facilityId = req.param('uid');
		let url  = urlPath+"api/organisationUnits/"+facilityId;	 	

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

			let code 		= responseInfo.code;
			let description	= responseInfo.description;
			let closedDate	= responseInfo.closedDate;
			let comment	    = responseInfo.comment;
			let url	        = responseInfo.url;
			let address	    = responseInfo.address;
			let email 		= responseInfo.email;
			let phoneNumber = responseInfo.phoneNumber;
			let displayName = responseInfo.displayName;
			let shortName   = responseInfo.shortName;
			let openingDate = responseInfo.openingDate;
			let parent      = responseInfo.parent;

			if (displayName == null) {
				displayName = '';
			}

			if (code == null){
				code = '';
			}

			if(description == null){
				description =null;
			}

			res.render('blank-fields-facility-update',{
				displayName,code,description,closedDate,comment,url,address,email,phoneNumber
			})				
			
		}); // End of request		

};

module.exports.blankFieldsFacilityEdit= function index(req, res) {

		let facilityUid     = req.body.uid;	
		let codeReq 		= req.body.code;
		let descriptionReq  = req.body.description;		 	
		let closedDateReq   = req.body.closedDate;	 	
		let commentReq      = req.body.comment;	 	
		let urlDHISReq 		= req.body.url;	 	
		let addressReq  	= req.body.address;	 	
		let emailReq  		= req.body.email;	 	
		let contactPersonReq= req.body.contactPerson;	 	
		let phoneNumberReq  = req.body.phoneNumber;	 	
		let latitudeReq  	= req.body.latitude;
		let longitudeReq  	= req.body.longitude;

		let url  = urlPath+"api/organisationUnits/"+facilityUid;	

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

// Get JSON data based on the requested id			
		request(options, function(error, response, body) {
			let responseInfo= JSON.parse(body);
			
			let code 		= responseInfo.code;
			let description	= responseInfo.description;
			let closedDate	= responseInfo.closedDate;
			let comment	    = responseInfo.comment;
			let url	        = responseInfo.url;
			let address	    = responseInfo.address;
			let email 		= responseInfo.email;
			let phoneNumber = responseInfo.phoneNumber;
			let displayName = responseInfo.displayName;
			let shortName   = responseInfo.shortName;
			let openingDate = responseInfo.openingDate;
			let parent      = responseInfo.parent;

			if(codeReq == null || codeReq == ''){
				codeReq = null;
			} else if(code != null){
				codeReq = code;
			} else {
				codeReq = '';
			}

			if(closedDateReq == null || closedDateReq == ''){
				closedDateReq = null;
			} else if(closedDate != null){
				closedDateReq = closedDate;
			} else {
				closedDateReq = '';
			}

			if(descriptionReq == null || descriptionReq == ''){
				descriptionReq = null;
			} else if(description != null){
				descriptionReq = description;
			} else {
				descriptionReq = '';
			}

			let jsonPayload = {
				"code"   : codeReq,
				"id"     : facilityUid,
				"name"   : displayName,
				"shortName": shortName,
				"openingDate": openingDate,
				"description": description,
				"closedDate" : closedDateReq,
				"comment"    : commentReq, 
				"url"		 : urlDHISReq,
				"contactPerson": contactPersonReq,
				"address": addressReq,
				"email": emailReq,
				"phoneNumber": phoneNumberReq,
				"coordinates": "["+latitudeReq+","+longitudeReq+"]",
				"parent": parent
			}
			console.log(jsonPayload);
			// Post JSON in DHIS2
				let options = {
				    method: 'PUT',
				    url: url,
				    body: JSON.stringify(jsonPayload),
				    headers: { 
				    	'Authorization': auth,
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				    },
					from: {
					  mimeType: 'application/json'
					}
				}; // end of eoptions
			
			request(options, function(error, response, body) {

				let responseInfo    = JSON.parse(body);	

			}); // End of PUT request				
			
		}); // End of request		

};