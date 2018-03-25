/**
* @name SettingsController
* @author Julhas Sujan
* @version 1.0.0
*/
let request   = require('request');
let dbConnect = require('../config/db-config');
let fn        = require('../function');
let logger4js = require('../../logger/log4js');
let db 		  = dbConnect.getConnection();
/**
* Default load api information 
*/

/*const ApiInfoSettings = require('../models').ApiInfoSettings;

module.exports = {
  create(req, res) {
    return ApiInfoSettings
      .create({
        connection_name: req.body.connection_name,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
};*/

module.exports.instancesSetup = function index(req, res) {

    let infoList = [];
	 
	db.query('SELECT * FROM middleware_instances order by id asc ').then(info => {

	// Iterate Data	
		for (let i = 0; i < info.length; i++) {

			// Create an object to save current row's data
			let instanceInfoArray = {
				'id'			 :info[i].id,
				'instance_name'  :info[i].instance_name,
				'instance_short_code' :info[i].instance_short_code,
				'facility_levels':info[i].facility_levels,
				'min_level'		 :info[i].min_level,
				'max_level'		 :info[i].max_level,
				'instance_type'	 :info[i].instance_type,
				'notes'			 :info[i].notes,
				'created_at'	 :info[i].created_at,
			}
			// Add object into array
			infoList.push(instanceInfoArray);

		}
		//console.log(instanceInfoList);
		logger4js.getLoggerConfig().debug("Middleware Instances",infoList);	
	    res.render('middleware-instances-setup',{
	   		infoList: infoList
	    })

	}).catch(error => {		
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};
/****
* Create DHIS instance
*/
exports.middlewareInstancesCreate = function (req, res) {

	db.query("INSERT into middleware_instances (instance_name,instance_short_code,facility_levels,min_level,max_level,instance_type,source_type,notes) VALUES('"+req.body.instanceName+"','"+req.body.instanceShortName+"','"+req.body.facilityLevels+"','"+req.body.minLevel+"','"+req.body.maxLevel+"','"+req.body.instanceType+"','"+req.body.sourceType+"','"+req.body.notes+"')").then(user => {

        console.log("Successfully created new connection!"); // print success;
        res.send('success');
        logger4js.getLoggerConfig().debug("SUCCESS! ");	
    })
    .catch(error => {
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
        res.send('error');
    });
};

/***
* Api settings form display with dynamic connection information
*/
module.exports.index = function index(req, res) {

    db.tx(t => {
        // `t` and `this` here are the same;
        // this.ctx = transaction config + state context;
        return t.batch([
            t.any('SELECT * FROM api_settings order by id asc limit $1',[20]),
            t.any('select *  from middleware_instances limit $1',[10])
        ]);
    })
     .then(data => {

    	let apiInfoData   = JSON.parse(JSON.stringify(data[0]));
    	let instanceInfo  = JSON.parse(JSON.stringify(data[1]));

		res.render('api-settings',{
	   		apiInfo      : apiInfoData,
	   		instanceInfo : instanceInfo
	    })
        
    })
    .catch(error => {
        logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};

/**
* Create new api settings
*/
exports.apiCrudPOST = function (req, res) {

	db.query("INSERT into api_settings (connection_name,base_url,resource_path,token_type,token_string,username,password,notes) VALUES('"+req.body.connectionName+"','"+req.body.baseUrl+"','"+req.body.resourcePath+"','"+req.body.tokenType+"','"+req.body.tokenString+"','"+req.body.username+"','"+req.body.password+"','"+req.body.notes+"')").then(user => {
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

/***
* Multiple Instances Form display
*/
exports.multipleInstancesFormDisplay = function (req, res) {

    db.tx(t => {
        return t.batch([
            t.any('select * from middleware_instances limit $1',[10]),
            t.any('select * from middleware_instances  limit $1',[10]),
            t.any('select mi.instance_name,mi.instance_type,mi.instance_short_code,mi.facility_levels,mui.notes from middleware_instances mi inner join multiple_instances mui on mui.souece_id=mi.id or mui.destination_id=mi.id limit $1',[10])
        ]);
    }).then(data => {

    	let sourceInfo       = JSON.parse(JSON.stringify(data[0]));
    	let destinationInfo  = JSON.parse(JSON.stringify(data[1]));
    	let listOfInstances  = JSON.parse(JSON.stringify(data[2]));

		res.render('multiple-instances-configure',{
	   		sourceInfo      : sourceInfo,
	   		destinationInfo : destinationInfo,
	   		listOfInstances : listOfInstances
	    })
        
    })
    .catch(error => {
        logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};
/***
* Multiple Instance create operation
*/
exports.multipleInstancesCreate = function (req, res) {

	db.query("INSERT into multiple_instances (souece_id,destination_id,notes) VALUES('"+req.body.source+"','"+req.body.destination+"','"+req.body.notes+"')").then(user => {
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
     db.tx(t => {
        return t.batch([
            t.any('SELECT * FROM schedular_info limit $1',10),
            t.any('select * from middleware_instances where instance_type=$1',["source"]),
        ]);
    }).then(data => {

    	let cronJobInformation= JSON.parse(JSON.stringify(data[0]));
    	let sourceInstance   = JSON.parse(JSON.stringify(data[1]));

    	if(cronJobInformation[0].is_enable){
			res.render('schedular-setup',{
	   			cronJobInfo: cronJobInformation,
	   			sourceInfo : sourceInstance,
	   			is_enable  : cronJobInformation[0].is_enable	
	    	})
		} else {
			res.render('schedular-setup',{
	   			cronJobInfo: cronJobInformation,
	   			sourceInfo : sourceInstance,
	   			is_enable  : 0	
	    	})
		}

        
    })
    .catch(error => {
        logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
	 
	/*db.query('SELECT * FROM schedular_info').then(info => {

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

		
	    

	}).catch(error => {		
		logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });*/
};
// Setup new schedular information
exports.schedularCrudPOST = function (req, res) {

	/*let schedularInfo = {};

	schedularInfo.name	        =req.body.name;
	schedularInfo.short_code	=req.body.short_code;
	schedularInfo.is_enable	    =req.body.is_enable;
	schedularInfo.schedular_type=req.body.schedular_type;
	schedularInfo.minutes	    =req.body.minutes;
	schedularInfo.hours			=req.body.hours;
	schedularInfo.day_of_month	=req.body.day_of_month;
	schedularInfo.month_of_year	=req.body.month_of_year;
	schedularInfo.day_of_week	=req.body.day_of_week;
	schedularInfo.exported_date_limit=req.body.exported_date_limit;
	schedularInfo.export_from_days=req.body.export_from_days;
	schedularInfo.notes	=req.body.notes;

	schedularInfo.sav(function(err){

		if(err){
			console.log("Error in saving data");
			logger4js.getLoggerConfig().error("ERROR! ",error);
        	console.log(error); // print the error;
        	res.send('error');
		} else {
			console.log("Schedular Setup Success"); // print success;
        	res.send('success');
        	logger4js.getLoggerConfig().info("SUCCESS! ");
		}


	});*/

	
	db.query("INSERT into schedular_info (name,short_code,source,is_enable,schedular_type,minutes,hours,day_of_month,month_of_year,day_of_week,exported_date_limit,export_from_days, notes) VALUES('"+req.body.name+"','"+req.body.short_code+"','"+req.body.source+"','"+req.body.is_enable+"','"+req.body.schedular_type+"','"+req.body.minutes+"','"+req.body.hours+"','"+req.body.dayOfMonth+"','"+req.body.monthOfYear+"','"+req.body.dayOfWeek+"','"+req.body.exportedDataLimit+"','"+req.body.exportFromDays+"','"+req.body.notes+"')").then(user => {
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
