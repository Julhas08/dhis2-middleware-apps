/**
* @Logger Management
*/
let log4js = require('log4js');

module.exports = {

	getLoggerConfig: function () {
    	// Logger information in file
		log4js.configure({
		  appenders: { accesslog: { type: 'file', filename: 'log/access.log' } },
		  categories: { default: { appenders: ['accesslog'], level: 'error' } }
		});
		const logger4js = log4js.getLogger('accesslog');
		return logger4js;
    }
};

/*logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');*/
