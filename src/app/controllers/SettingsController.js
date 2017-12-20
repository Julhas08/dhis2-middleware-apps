/**
* @name SettingsController
* @author Julhas Sujan
* @version 1.0.0
*/
var request=require('request');
var dbConnect = require('../config/db-config');
var fn = require('../function');
var logger4js = require('../../logger/log4js');
var db = dbConnect.getConnection();
/**
* Default load api information 
*/
module.exports.index = function index(req, res) {

    var apiInfoList = [];
	 
	db.query('SELECT * FROM api_settings order by id asc limit 1').then(apiInfo => {

	// Iterate Data	
		for (var i = 0; i < apiInfo.length; i++) {

			// Create an object to save current row's data
			var apiInfoArray = {
				'id':apiInfo[i].id,
				'connection_name':apiInfo[i].connection_name,
				'source_name':apiInfo[i].source_name,
				'base_url':apiInfo[i].base_url,
				'token_type':apiInfo[i].token_type,
				'username':apiInfo[i].username,
				'notes':apiInfo[i].notes,
				'created_at':apiInfo[i].created_at,
			}
			// Add object into array
			apiInfoList.push(apiInfoArray);

		}
		//console.log(apiInfoList);
		logger4js.getLoggerConfig().debug("API Data: ",apiInfoList);	
	    res.render('api-settings',{
	   		apiInfo: apiInfoList
	    })

	}).catch(error => {		
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};

/**
* Create new api settings
*/
exports.apiCrudPOST = function (req, res) {

    
	db.query("INSERT into api_settings (connection_name,source_name,base_url,resource_path,token_type,token_string,username,password,notes) VALUES('"+req.body.connectionName+"','"+req.body.sourceName+"','"+req.body.baseUrl+"','"+req.body.resourcePath+"','"+req.body.tokenType+"','"+req.body.tokenString+"','"+req.body.username+"','"+req.body.password+"','"+req.body.notes+"')").then(user => {
        console.log("Success"); // print success;
        res.send('success');
        logger4js.getLoggerConfig().debug("SUCCESS! ");	
    })
    .catch(error => {
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
        res.send('error');
    });	
};

/**
* Default load Cron job/ schedular form 
*/

module.exports.settingsFormIndex = function index(req, res) {

    var cronJobInformation = [];
	 
	db.query('SELECT * FROM schedular_info').then(info => {

	// Iterate Data	
		for (var i = 0; i < info.length; i++) {

			// Create an object to save current row's data
			var infoArray = {
				'id':info[i].id,
				'name':info[i].name,
				'short_code':info[i].short_code,
				'is_enable':info[i].is_enable,
				'schedular_type':info[i].schedular_type,
				'start_time':info[i].start_time,
				'end_time':info[i].end_time,
				'duration':info[i].duration,
				'created_at':info[i].created_at,
			}
			// Add object into array
			cronJobInformation.push(infoArray);

		}
		//console.log(apiInfoList);
		logger4js.getLoggerConfig().debug("API Data: ",cronJobInformation);	
	    res.render('schedular-setup',{
	   		cronJobInfo: cronJobInformation
	    })

	}).catch(error => {		
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};

exports.schedularCrudPOST = function (req, res) {

	db.query("INSERT into schedular_info (name,short_code,is_enable,schedular_type,start_time,end_time,duration,notes) VALUES('"+req.body.name+"','"+req.body.short_code+"','"+req.body.is_enable+"','"+req.body.schedular_type+"','"+req.body.start_time+"','"+req.body.end_time+"','"+req.body.duration+"','"+req.body.notes+"')").then(user => {
        console.log("Schedular Setup Success"); // print success;
        res.send('success');
        logger4js.getLoggerConfig().info("SUCCESS! ");	
    })
    .catch(error => {
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
        res.send('error');
    });	
};