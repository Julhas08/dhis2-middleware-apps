/**
* @name SettingsController
* @author Julhas Sujan
* @version 1.0.0
*/
var request=require('request');
var dbConnect = require('../config/db-config');
var fn = require('../function');
var logger4js = require('../../logger/log4js');

/**
* Default load api information 
*/
module.exports.index = function index(req, res) {

    var apiInfoList = [];
	var db = dbConnect.getConnection(); 
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

    var db = dbConnect.getConnection();
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
