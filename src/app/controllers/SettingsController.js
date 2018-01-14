/**
* @name SettingsController
* @author Julhas Sujan
* @version 1.0.0
*/
let request=require('request');
let dbConnect = require('../config/db-config');
let fn = require('../function');
let logger4js = require('../../logger/log4js');
let db = dbConnect.getConnection();
/**
* Default load api information 
*/
module.exports.index = function index(req, res) {

    let apiInfoList = [];
	 
	db.query('SELECT * FROM api_settings order by id asc limit 2').then(apiInfo => {

	// Iterate Data	
		for (let i = 0; i < apiInfo.length; i++) {

			// Create an object to save current row's data
			let apiInfoArray = {
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

    let cronJobInformation = [];
	 
	db.query('SELECT * FROM schedular_info').then(info => {

	// Iterate Data	
		for (let i = 0; i < info.length; i++) {

			// Create an object to save current row's data
			let infoArray = {
				'id':info[i].id,
				'name':info[i].name,
				'short_code':info[i].short_code,
				'is_enable':info[i].is_enable,
				'schedular_type':info[i].schedular_type,
				'minutes':info[i].minutes,
				'hours':info[i].hours,
				'day_of_month':info[i].day_of_month,
				'month_of_year':info[i].month_of_year,
				'day_of_week':info[i].day_of_week,
				'created_at':info[i].created_at,
			}
			// Add object into array
			cronJobInformation.push(infoArray);

		}
		//console.log(apiInfoList);
		logger4js.getLoggerConfig().debug("API Data: ",cronJobInformation);

		if(info[0].is_enable){
			res.render('schedular-setup',{
	   			cronJobInfo: cronJobInformation,
	   			is_enable  : info[0].is_enable	
	    	})
		} else {
			res.render('schedular-setup',{
	   			cronJobInfo: cronJobInformation,
	   			is_enable  : 0	
	    	})
		}
	    

	}).catch(error => {		
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};
// Setup new schedular information
exports.schedularCrudPOST = function (req, res) {

	db.query("INSERT into schedular_info (name,short_code,is_enable,schedular_type,minutes,hours,day_of_month,month_of_year,day_of_week,notes) VALUES('"+req.body.name+"','"+req.body.short_code+"','"+req.body.is_enable+"','"+req.body.schedular_type+"','"+req.body.minutes+"','"+req.body.hours+"','"+req.body.dayOfMonth+"','"+req.body.monthOfYear+"','"+req.body.dayOfWeek+"','"+req.body.notes+"')").then(user => {
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
// Enable or disable schedular information
exports.schedularEnableDisable = function (req, res) {

	let isEnable = req.body.is_enable;
	/*if(req.body.is_enable==" "){
		isEnable = 0;		
		console.log("Is enable in controller-0: ",req.body.is_enable);
	} else if(req.body.is_enable=="on"){
		isEnable = 1;
		console.log("Is enable in controller-1: ",req.body.is_enable);
	}*/

    db.tx(t => {
        return t.batch([
            t.none('UPDATE schedular_info SET is_enable = $1 where short_code = $2', [isEnable,"hris"])
        ]);
    })
    .then(data => {
        console.log("Schedular Setup Success: ",data); // print success;
        res.send('success');
        logger4js.getLoggerConfig().info("SUCCESS!");	
    })
    .catch(error => {
       logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
        res.send('error');
    });
};

/**
* Data Transaction Mode Setup
*/

module.exports.dataTransactionMode = function index(req, res) {

    let transactionModeInfo = [];
	 
	db.query('SELECT * FROM data_transaction_mode').then(info => {

	// Iterate Data	
		for (let i = 0; i < info.length; i++) {

			// Create an object to save current row's data
			let infoArray = {
				'id'        : info[i].id,
				'mode_type' : info[i].mode_type,
				'is_enable' : info[i].is_enable,
				'notes'     : info[i].notes,
				'created_at': info[i].created_at,
			}
			// Add object into array
			transactionModeInfo.push(infoArray);

		}
		//console.log(apiInfoList);
		logger4js.getLoggerConfig().debug("API Data: ",transactionModeInfo);

		if(info[0].is_enable){
			res.render('data-sync-mode',{
	   			resultInfo: transactionModeInfo,
	   			is_enable  : info[0].is_enable	
	    	})
		} else {
			res.render('data-sync-mode',{
	   			resultInfo: transactionModeInfo,
	   			is_enable  : 0	
	    	})
		}
	    

	}).catch(error => {		
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};

// Transaction Mode Updates
exports.dataTransactionModeUpdate = function (req, res) {

	let isEnable = req.body.is_enable;

    db.tx(t => {
        return t.batch([
            t.none('UPDATE data_transaction_mode SET mode_type = $1', [isEnable])
        ]);
    })
    .then(data => {
        console.log("Transaction Mode Setup has success: ",data); // print success;
        res.send('success');
        logger4js.getLoggerConfig().info("SUCCESS!");	
    })
    .catch(error => {
       logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
        res.send('error');
    });
};
