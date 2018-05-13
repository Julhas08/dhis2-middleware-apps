/**
* @name QueuesController
* @author Julhas Sujan
* @version 1.0.0
*/
let request   = require('request');
let dbConnect = require('../config/db-config');
let fn        = require('../function');
let logger4js = require('../../logger/log4js');
let db 		  = dbConnect.getConnection();

// All Queues
exports.allQueues = function (req, res) {
	db.tx(t => {
        return t.batch([
            t.any('select * from queues'),
            
            t.any('select q.name,response_code, count(qd.id) as totalMessage from queues q inner join queue_detail qd on q.id=qd.queue_id group by qd.response_code,q.name'),

            t.any("select api.channel_name,q.name as queue_name,q.durability,q.delete_status,q.expire_status,q.max_length,q.routing_key,qd.* from queues q inner join queue_detail qd on q.id=qd.queue_id inner join api_settings as api on api.queue=q.id where api.channel_type='destination' and (qd.response_code=201 or qd.response_code=200) and qd.durability='durable'"),

            t.any("select api.channel_name,q.name as queue_name,q.durability,q.delete_status,q.expire_status,q.max_length,q.routing_key,qd.* from queues q inner join queue_detail qd on q.id=qd.queue_id inner join api_settings as api on api.queue=q.id where api.channel_type='destination' and (qd.response_code=409 or qd.response_code=409) and qd.durability='durable'"),

            t.any("select api.channel_name,q.name as queue_name,q.durability,q.delete_status,q.expire_status,q.max_length,q.routing_key,qd.* from queues q inner join queue_detail qd on q.id=qd.queue_id inner join api_settings as api on api.queue=q.id where api.channel_type='destination' and (qd.response_code=500 or qd.response_code=500) and qd.durability='durable'"),
        ]);
    }).then(data => {

    	let queueInfo    = JSON.parse(JSON.stringify(data[0]));
        let queueSummary = JSON.parse(JSON.stringify(data[1]));
        let successQueueDetail  = JSON.parse(JSON.stringify(data[2]));
        let conflictQueueDetail  = JSON.parse(JSON.stringify(data[3]));
    	let errorQueueDetail  = JSON.parse(JSON.stringify(data[4]));

		res.render('queues',{
	   		queueInfo   : queueInfo,
	   		queueSummary : queueSummary,
            successQueueDetail: successQueueDetail,
            conflictQueueDetail: conflictQueueDetail,
            errorQueueDetail: errorQueueDetail,
	    })
        
    })
    .catch(error => {
        logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
    });
};

// Create new queue
exports.addNewQueue = function (req, res) {
    let dataReq1 = req.body.paramInfo.replace('[','');
	let dataReq  = dataReq1.replace(']','');
	var info = JSON.parse(dataReq);

    db.tx(t => {
        return t.batch([
            t.none("INSERT into queues (name,durability,delete_status,expire_status,max_length,routing_key,created_at) VALUES('"+info.queueName+"','"+info.durability+"','"+info.autoDelete+"','"+info.autoExpire+"','"+info.maxLength+"','"+info.routingKey+"','"+fn.getDateYearMonthDayMinSeconds()+"')")
        ]);
    })
    .then(data => {
    	console.log("success");
        res.send('success');
        logger4js.getLoggerConfig().info("SUCCESS!");   
    })
    .catch(error => {
       logger4js.getLoggerConfig().error("ERROR! ",error);
        console.log(error); // print the error;
        res.send('error');
    });

};

// Sync information in every five minutes
exports.syncDurableMessages = function (req, res) {
    let exchangePeiod;
    function getChannelSettingsInformation(name) {
            return db.task('getChannelSettingsInformation', t => {
                return t.oneOrNone('select aps.*,q.* from api_settings aps left join queues q on q.id=aps.queue where channel_type = $1',name)
                    .then(apiInfo => {
                        return apiInfo;
                    });
            });
        }

// Get sync mode period    
    db.tx(t => {
        return t.batch([
            t.any('select sync_period from exchange_mode')          
           
        ]);
    }).then(data => {

// Refresh the page in periodic manner
        exchangePeiod = JSON.parse(JSON.stringify(data[0]));
        //console.log(parseInt(exchangePeiod[0].sync_period));
        var minutes = parseInt(exchangePeiod[0].sync_period), the_interval = minutes * 60 * 1000;
            setInterval(function() {
                db.tx(t => {
                    return t.batch([
                        t.any('select id, message from queue_detail where status=$1',['pending'])          
                    ]);
                }).then(data => {
                    let jsonPayload = JSON.parse(JSON.stringify(data[0]));
                    console.log(jsonPayload[0].message);
            // Get destination         
                getChannelSettingsInformation("destination").then(apiInfo => {

                            let apiData      = JSON.parse(JSON.stringify(apiInfo));
                            let baseUrl      = apiData.base_url;
                            let resourcePath = apiData.resource_path;
                            let username     = apiData.username;
                            let password     = apiData.password;  

                        // Base64 authentication, call from function.js         
                            let auth = fn.base_64_auth(username,password);

                            let url, parentUID, orgJsonListPost,objOfResponse,parentIdJSON,message =null ,logType = null;
                            let resourcePathAutomatic = "organisationUnits";
                        // Base url development for data handling                   
                                url  = baseUrl+resourcePath+jsonPayload[0].message.id;         

                        // JSON Payload options development         
                                let options = {
                                    method: 'POST',
                                    url: url,
                                    body: jsonPayload[0].message,
                                    headers: { 
                                        'Authorization': auth,
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json' 
                                    },
                                    from: {
                                      mimeType: 'application/json'
                                    }
                                }; // end of eoptions
                                console.log("Options Post:",options);
                        // Posting JSON payload to DHIS2            
                                request(options, function(error, response, body) {

                                    //console.log(body);
                                    let message = null;
                                    let logType = null;

                            // Add in queue detail table
                                let status ='transferred';
                                db.query("update queue_detail set status='"+status+"'").then(info => {   
                                        console.log("success");
                                    }).catch(error => {
                                        logger4js.getLoggerConfig().error("System log was not updated!",error);
                                        console.log(error);
                                }); 
                            // System log table updates
                                /*db.query("INSERT into system_log (module_name,table_name,exchange_mode,operation_type,log_type,message,created_date,status_code,queue) VALUES('DHIS2 Data Send','schedular_info','"+exchangeMode+"','"+operationType+"','"+logType+"','"+message+''+parentCode+','+orgName+"','"+fn.getDateYearMonthDayMinSeconds()+"','"+response.statusCode+"'+'"+queueId+"')").then(info => {
                                }).catch(error => {
                                    logger4js.getLoggerConfig().error("System log was not updated!",error);
                                    console.log(error);
                                });  */       
                                    
                            }); // End of request of posting data to dhis2
                                                

                        }).catch(error => {
                            console.log(error);
                        });  
                    
            }).catch(error => {
                logger4js.getLoggerConfig().error("ERROR! ",error);
                console.log(error); // print the error;
            });

              console.log("I am doing my 1 minute check....");



            }, the_interval);
                
        }).catch(error => {
            logger4js.getLoggerConfig().error("ERROR! ",error);
            console.log(error); // print the error;
    });    


};
