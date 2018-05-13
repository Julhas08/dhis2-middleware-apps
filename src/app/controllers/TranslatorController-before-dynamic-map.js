/**
* @name Message Translator Controller
* @author Julhas Sujan
* @version 1.0.0
*/

'use strict';
let request   = require('request');
let dbConnect = require('../config/db-config');
let fn        = require('../function');
let logger4js = require('../../logger/log4js');
let exchanger = require('./ExchangeController');
// APi Connection String		
let db= dbConnect.getConnection();
module.exports = {	
	// This method is for processing source data into queues and automatic mode data exchange		
	processMessages: function(requestType, modeType,exportLimit,exportFromDays){

		//let requestType 	= "createdSince";
		//let dateFrom 		= req.body.dateFrom;
		let displayLimit 	= exportLimit;
		//let date            = dateFrom.split("-");
		let dateSince       = "20180101";
		//let dateSince       = fn.getTodayYYYYMM()+exportFromDays;
		let exchangeMode;
		if(modeType==0){
			exchangeMode   = "persistent";
		} else {
			exchangeMode   = "automatic";
		}
		let operationType   = null; 

		//console.log("Dynamic dateSince: ",dateSince);
		// Database API information		
		function getChannelSettingsInformation(name) {
		    return db.task('getChannelSettingsInformation', t => {
	            return t.oneOrNone('select aps.*,q.* from api_settings aps left join queues q on q.id=aps.queue where channel_type = $1',name)
	                .then(apiInfo => {
	                    return apiInfo;
	                });
		    });
		}

/**********************************************************************
**********************Generate JSON Payload from source system ********
**********************************************************************/	
		getChannelSettingsInformation("source").then(apiInfo => {

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
		//console.log("Options:",options);		

		// To get source information			
			request(options, function(error, response, body) {
				//console.log("response:",response);
				let data          = JSON.stringify(JSON.parse(body));
			
				let facilityInfo1 = data.replace('[','');
				let facilityInfo  = facilityInfo1.replace(']','');
				let pdata         = data.replace(/&quot;/g, '"');
				let json          = JSON.parse(pdata);
				let jsonArr       = [];
				let i, status;
		// Status Management 
				if(requestType=="createdSince") {
					status        = 'create';
					operationType = "created";

				} else if(requestType=="updatedSince") {
					status        = 'update';
					operationType = "updated";

				} if(requestType == "deletedSince") {
					status 		  = 'delete';
					operationType = "deleted";
				}		
				//console.log("JSON: ",json)
		// JSON Payload Generate from source		
				for(i = 0; i < json.length; i++) {

					let unionCode,upazilaCode,unionName,upazilaName;
					let openingDate  = (json[i].created_at).split(" "); 

					if(json[i].union_code == null){
						unionCode = '';
						unionName = '';
					} else {
						unionCode = json[i].union_code;
						unionName = json[i].union_name +" Union";
					}

					if(json[i].upazila_code == null){
						upazilaCode = '';
						upazilaName = '';
					} else {
						upazilaCode = json[i].upazila_code;
						upazilaName = json[i].upazila_name + " Upazila";
					}

					let shortName = json[i].name.split(" ");
				    let createdAt = json[i].created_at.split(" ");

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
				        phoneNumber	:  json[i].mobile1,
				        email   	:  json[i].email1,
				        created 	:  createdAt[0],
				        facilitytypeCode:  json[i].facilitytype_code,
				        facilitytypeName:  json[i].facilitytype_name,
				        status     	:  status,
				        parent      : {
				        				code:json[i].division_code+''+json[i].district_code+''+upazilaCode+''+unionCode,
				        				name:unionName,
				        				parent: {
				        					code:json[i].division_code+''+json[i].district_code+''+upazilaCode,
				        					name:upazilaName,
				        					parent: {
				        						code:json[i].division_code+''+json[i].district_code,
				        						name:json[i].district_name,
				        						parent: {
				        							code:json[i].division_code,
				        							name:json[i].division_name
				        						}
				        					}
				        				}
				        			},  
				        parentCode 	:  json[i].division_code+''+json[i].district_code+''+upazilaCode+''+unionCode
				        
				    });
				//console.log("jsonArr: ",jsonArr);
				logger4js.getLoggerConfig().debug("JSON Payload for DHIS2: ",jsonArr);
				logger4js.getLoggerConfig().error(error);

				let orgCode	   = json[i].code;
				let orgName    = json[i].name;
				let parentCode = json[i].division_code+''+json[i].district_code+''+upazilaCode+''+unionCode;
				//console.log("jsonData:", jsonData);
				var jsonData     = JSON.stringify(jsonArr);
				var pdataSource  = jsonData.replace(/&quot;/g, '"');
				var sourceMessageParse   = JSON.stringify(JSON.parse(pdataSource));
				let sourceMessageReplace = sourceMessageParse.replace('[','');
				let jsonPayload  = sourceMessageReplace.replace(']','');

/********************************************************************
********************** Durability checking ***************** ********
********************************************************************/	
		// Check the durability if durable the data will be stored in queue table	
				if(apiData.durability=='durable' && modeType==0){
			// Add in queue detail table
					db.query("INSERT into queue_detail (queue_id,exchange_mode,operation_type,message,response_code,created_at) VALUES('"+apiData.queue+"','"+exchangeMode+"','"+operationType+"','"+jsonPayload+"','"+response.statusCode+"','"+fn.getDateYearMonthDayMinSeconds()+"')").then(info => {	
						console.log("success");
					}).catch(error => {
				    	logger4js.getLoggerConfig().error("System log was not updated!",error);
				    	console.log(error);
				    });	
			// System log table updates
				let logType=null,message=null;
					db.query("INSERT into system_log (module_name,table_name,exchange_mode,operation_type,log_type,message,created_date,status_code,queue) VALUES('DHIS2 Data Send','schedular_info','"+exchangeMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"','"+apiData.queue+"')").then(info => {
					}).catch(error => {
				    	logger4js.getLoggerConfig().error("System log was not updated!",error);
				    	console.log(error);
				    });		   
			// Make sure to empty the jsonArr = [];
				jsonArr = [];	     
			// Transient Durability  
				} else if (apiData.durability=='transient' && modeType==0){
			// Call exchange controller
					exchanger.exchangeMessages("destination",jsonPayload,orgCode,orgName,parentCode,exchangeMode,operationType,apiData.queue);
				} else {
			// Automatic Mode Message Transfer		

				}
			jsonArr = [];	

			} // End loop 

			});	// End Request body
		});// End ChannelSettings or source api 	   		
	}
};	

