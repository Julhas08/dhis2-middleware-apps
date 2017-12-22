/**
* @name ReportsController
* @author Julhas Sujan
* @version 1.0.0
*/
var request=require('request');
var dbConnect = require('../config/db-config');
var fn = require('../function');
var logger4js = require('../../logger/log4js');
var db = dbConnect.getConnection();
/**
* Default load  
*/
'use strict';
exports.index = function index(req, res) {	 
	let logInfoArray = [];
	var query;
	if(req.body.logType){
		query = 'SELECT * FROM system_log order by id desc limit '+req.body.displayLimit;
	} else {
		query = 'SELECT * FROM system_log order by id desc limit 1';
	}
	db.query(query).then(info => {
		for (var i = 0; i < info.length; i++) {
			// Create an object to save current row's data
			var dataArray = {
				'id'           : info[i].id,
				'module_name'  : info[i].module_name,
				'table_name'   : info[i].table_name,
				'log_type'     : info[i].log_type,
				'message'      : info[i].message,
				'status_code'  : info[i].status_code,
				'created_date' : info[i].created_date,
			}
			// Add object into array
			logInfoArray.push(dataArray);

		}
		if(req.body.logType){
			res.render('system-log-detail',{
	   			logInfo: logInfoArray
	    	})
		} else {
			res.render('system-log',{
	   			logInfo: logInfoArray
	    	})
		}
	    
	    console.log(logInfoArray);

	}).catch(error => {		
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};
