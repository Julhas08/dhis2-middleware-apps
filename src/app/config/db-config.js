/**
* pg-promise import
*/
var pgp = require('pg-promise')({
   noWarnings: true
});

module.exports = {

	getConnection: function () {
    	var connection = {
		    host:     'localhost', // server name or IP address;
		    port: 	  5432,
		    database: 'middleware',
		    user:     'postgres',
		    password: ''
		};
		var db = pgp(connection);

		// Database connection error handling 
		db.connect()
	    .then(function (obj) {
	        obj.done(); // success, release connection;
	    })
	    .catch(function (error) {
	    	logger.error("DB CONNECTION ERROR:", error.message);
	        console.log("ERROR DB Connection: ", error.message);
	    });	
		
		return db;
    }
};