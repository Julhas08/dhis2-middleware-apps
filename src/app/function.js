/**
* @name Funtion JS contains all basic functions 
* @author Julhas Sujan
* @version 1.0.0
*/
module.exports = {

//  DHIS2 base authentication
	base_64_auth: function (username,password) { 
        return "Basic " + new Buffer(username + ':' + password).toString( "base64" );
 	},
 	/*getApiSettingsInformation: function (name) {
    	let conName = name;
	    return db.task('getApiSettingsInformation', t => {
            return t.oneOrNone('SELECT * FROM api_settings where connection_name=$1',conName)
                .then(apiInfo => {
                    return apiInfo;
                });
	    });
	},*/


// Today's date return  	
	getTodayYYYYMMDD: function () {
    	var today = new Date();
		var dd    = today.getDate();
		var mm    = today.getMonth()+1; //January is 0!
		var yyyy  = today.getFullYear();

		if(dd<10) {
		    dd = '0'+dd
		} 
		if(mm<10) {
		    mm = '0'+mm
		} 
		return yyyy+''+mm+''+dd;
    },
// Return Arbitary number     
    getRandomArbitrary: function(min, max) {
	  	return Math.random() * (max - min) + min;
	},
// Return Year month day 
    getDateYearMonthDay: function () {
    	date =  new Date();
		date.toDateString() // "Thu Dec 29 2011"
		date.toUTCString()  // "Fri, 30 Dec 2011 02:14:56 GMT"
		date.getMonth()     // 11
		date.getDate()      // 29
		date.getFullYear()  // 2011
		return date.getFullYear()+''+date.getMonth()+''+date.getDate();
    },

    getApiSettingsInformation: function () {
    	
    	let conName = name;
	    return db.task('getApiSettingsInformation', t => {
            return t.oneOrNone('SELECT * FROM api_settings where connection_name=$1',conName)
                .then(apiInfo => {
                    return apiInfo;
                });
        });
    },


};