/**
* @name Funtion JS contains all basic functions 
* @author Julhas Sujan
* @version 1.0.0
*/
module.exports = {
// DHIS2 Duplicate JSON object 
//return an array of objects according to key, value, or key and value matching


	/*//return an array of values that match on a certain key
	getValues: function (obj, key) {
	    let objects = [];
	    for (let i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        if (typeof obj[i] == 'object') {
	            objects = objects.concat(getValues(obj[i], key));
	        } else if (i == key) {
	            objects.push(obj[i]);
	        }
	    }
	    return objects;
	},

	//return an array of keys that match on a certain value
	getKeys: function(obj, val) {
	    let objects = [];
	    for (let i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        if (typeof obj[i] == 'object') {
	            objects = objects.concat(getKeys(obj[i], val));
	        } else if (obj[i] == val) {
	            objects.push(i);
	        }
	    }
	    return objects;
	},*/


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
    	let today = new Date();
		let dd    = today.getDate();
		let mm    = today.getMonth()+1; //January is 0!
		let yyyy  = today.getFullYear();

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
// Return Year month day with seconds
    getDateYearMonthDayMinSeconds: function () {
    	
		return new Date().toLocaleString(); //2017-12-22 00:05:01
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