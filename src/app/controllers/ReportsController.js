/**
* @name ReportsController
* @author Julhas Sujan
* @version 1.0.0
*/
//let request=require('request');
let dbConnect = require('../config/db-config');
let fn = require('../function');
let logger4js = require('../../logger/log4js');
let db = dbConnect.getConnection();
/**
* Default load  
*/
'use strict';
exports.index = function index(req, res) {	 
	let logInfoArray = [];
	let query;
	if(req.body.logType && !req.body.dateTo){
		query = 'SELECT * FROM system_log where log_type=$1 order by id desc limit '+req.body.displayLimit;

	} else if ( req.body.logType && req.body.dateFrom && req.body.dateTo){
		query = 'SELECT * FROM system_log where log_type='+req.body.logType+' and created_date between '+req.body.dateFrom+' and '+req.body.dateTo+'order by id desc limit '+req.body.displayLimit;
	} else {
		query = 'SELECT * FROM system_log order by id desc limit 20';
	}
	function getSystemLogDetail() {
	    return db.task('getApiSettingsInformation', t => {
            return t.many(query,[req.body.logType])
                .then(info => {
                    return info;
                });
	        });
	}
	getSystemLogDetail().then(info => {
		for (let i = 0; i < info.length; i++) {
			// Create an object to save current row's data
			let dataArray = {
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
	   			logInfo: JSON.parse(JSON.stringify(logInfoArray))
	    	})
		} else {
			res.render('system-log',{
	   			logInfo: JSON.parse(JSON.stringify(logInfoArray))
	    	})
		}
	    //setTimeout(function(){console.log('from timeout');},0);
	    //console.log(JSON.stringify(logInfoArray));
	}).catch(error => {
	    console.log(error);
	});


};
