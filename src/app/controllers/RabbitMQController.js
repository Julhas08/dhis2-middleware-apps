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

// RabbitMQ APMQ Library
var amqp = require('amqplib/callback_api');

// RabbitMQ setup page load
exports.rabbitMQSetup = function (req, res) {

        res.render('rabbitmq-setup');

};

// RabbitMQ Sender
exports.rabbitMQSender = function (req, res) {

	amqp.connect('amqp://localhost', function(err, conn) {
	  conn.createChannel(function(err, ch) {
	    var q = 'Middleware_App';

	    ch.assertQueue(q, {durable: false});
	    // Note: on Node 6 Buffer.from(msg) should be used
	    ch.sendToQueue(q, new Buffer('This is the test message from Middleware Apps!'));
	    console.log(" [x] Sent 'This is the test message from Middleware Apps!'");
	  });
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
	});
	//setTimeout(function() { conn.close(); process.exit(0) }, 500);

        res.render('rabbitmq-setup');

};


// RabbitMQ Receiver
exports.rabbitMQReceiver = function (req, res) {

	
	amqp.connect('amqp://localhost', function(err, conn) {
	  conn.createChannel(function(err, ch) {
	    var q = 'Middleware_App';

	    ch.assertQueue(q, {durable: false});
	    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
	    ch.consume(q, function(msg) {
	      console.log(" [x] Received %s", msg.content.toString());
	    }, {noAck: true});
	  });
	});

        res.render('rabbitmq-setup');

};



