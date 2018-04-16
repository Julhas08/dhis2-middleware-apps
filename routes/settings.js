/**
* API Settings Form
* @method {GET} apiSettings.index
* @return api setting form    
*/

let express = require('express');
let router = express.Router();
// APi Settings Controller Import
let settings = require('../src/app/controllers/SettingsController');
let rabbitmq = require('../src/app/controllers/RabbitMQController');
let queuesRoutes = require('../src/app/controllers/QueuesController');

// DHIS2 Instances Setup
router.get('/middleware-channel-setup', settings.channelSetup);
router.post('/middleware-channel-crud', settings.middlewareInstancesCreate);

// Multiple instances configure
router.get('/multiple-instances-configure', settings.multipleInstancesFormDisplay);
router.post('/multiple-instances-create', settings.multipleInstancesCreate);

// API Setting form load
router.get('/api-settings', settings.index);

// API settings Controller
router.post('/api-settings-crud',settings.apiCrudPOST);

// Schedular setting form load
router.get('/schedular-setup', settings.settingsFormIndex);

// Schedular setting CURD
router.post('/schedular-settings-crud', settings.schedularCrudPOST);
// Schedular eenable/ disabled
router.post('/schedular-enable-disable', settings.schedularEnableDisable);

// Data Sync Mode Management 
router.get('/data-sync-mode', settings.dataTransactionMode);
router.post('/data-transaction-mode-enable', settings.dataTransactionModeUpdate);

// Delete API/  Channel Setup
router.post('/delete-channel-settings', settings.deleteChannelSettings)
;
// RabbitMQ setup
router.get('/rabbitmq-setup', rabbitmq.rabbitMQSetup);
router.post('/rabbitmq-sender', rabbitmq.rabbitMQSender);
router.post('/rabbitmq-receiver', rabbitmq.rabbitMQReceiver);

// Queues
router.get('/queues', queuesRoutes.allQueues);
router.post('/add-new-queue', queuesRoutes.addNewQueue);
module.exports = router;
