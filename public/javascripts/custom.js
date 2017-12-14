$(document).ready( function() {
	
// Return current date time	
	function getTodayYYYYMMDD(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		if(dd<10) {
		    dd = '0'+dd
		} 
		if(mm<10) {
		    mm = '0'+mm
		} 
		return yyyy+''+mm+''+dd;
	}
// Get Random Number
	function getRandomArbitrary(min, max) {
	  	return Math.random() * (max - min) + min;
	}	
	
// Searching Facility	
   $('.facility-search-btn').click(function(e){
        e.preventDefault();

    // Requested data for posting    
        var requestType  = $('#requestType').val();
        var dateFrom     = $('#dateFrom').val();
        var displayLimit = $('#displayLimit').val();		
		var find_info = '&requestType=' + requestType+'&dateFrom='+dateFrom+'&displayLimit='+displayLimit;  
		//console.log(find_info);

		if(requestType==''){
			swal("Sorry!", "Please select searching type.","error");
		} else if(dateFrom==''){
			swal("Sorry!", "Please select your searching date.","error");
		} else{

			 $('#loaderClass').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				data: find_info,
		        //contentType: 'application/json',
	            url: '/dashboard-search',						
	            success: function(data) {
	                console.log('success');
	                //console.log(data);
	                //console.log(JSON.stringify(data));
	                $("#displayFacilityInformation").html(data);
	// Close loader        
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();
		            });
		            $(".loader").fadeOut("slow"); 
	            },
	            error: function(err){
	            	console.log(err);
	            }
	        });
		}

    });	

// Generate Payload	
   $('.json-payload-generates-btn').click(function(e){
        e.preventDefault();

    // Requested data for posting    
        var requestType  = $('#requestType').val();
        var dateFrom     = $('#dateFrom').val();
        var displayLimit = $('#displayLimit').val();		
		var find_info = '&requestType=' + requestType+'&dateFrom='+dateFrom+'&displayLimit='+displayLimit;  
		//console.log(find_info);

		if(requestType==''){
			swal("Sorry!", "Please select searching type.","error");
		} else if(dateFrom==''){
			swal("Sorry!", "Please select your searching date.","error");
		} else{

			 $('#loaderClass').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				data: find_info,
		        //contentType: 'application/json',
	            url: '/dashboard-json-payload',						
	            success: function(data) {

	                //console.log(data);
	                //console.log(JSON.stringify(data));
	                $("#displayFacilityInformation").html(data);
	                var textFieldValue = document.getElementById('displayFacilityInformationText');
					textFieldValue.value=data;
	// Close loader        
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();
		            });
		            $(".loader").fadeOut("slow"); 
	            },
	            error: function(err){
	            	console.log(err);
	            }
	        });
		}

    });	
// JSON sends to DHIS2

   $('.sends-json-dhis-btn').click(function(e){
        e.preventDefault();

    // JSOn payload ready    
        var data =$("#displayFacilityInformationText").val();
        var pdata = data.replace(/&quot;/g, '"');
        var displayLimit = $('#displayLimit').val();
        var jsonPayload; 
        if(displayLimit==1){
        	jsonPayload   = pdata.slice(4, -5);
        } else {
        	jsonPayload   = pdata.slice(3, -4);
        }
		
        console.log(jsonPayload);
    // Loader    
        $('#loaderClass').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
    // Base Url    
        var base_url = "http://localhost:8080/dhis/";
		var login = 'dhis-web-commons/security/login.action';
		var current_user_url = 'api/users.json';

	// Base64 authentication
		function base_64_auth(username,password) { 
	      return "Basic " + btoa( username + ":" + password ).toString( "base64" );
	 	}

	 	var auth = base_64_auth('admin','district');
	// Ajax Posting
		$.ajax({
			headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
			url : "http://localhost:8080/dhis/api/dataStore/OrgUnitManager/"+getTodayYYYYMMDD()+getRandomArbitrary(10,100000),
			data : jsonPayload,
			type : 'POST',
			dataType : 'json',
			crossDomain : true,
			xhrFields : {
			  'withCredentials':true
			},
			beforeSend : function(req) {
			  req.setRequestHeader('Authorization',auth);
			},
			success : function(data){
			  swal('Congratulations!','Your JSON Payload has submitted successfully.','success');
			  //userInfo();
	// Close loader        
                $('#loader').slideUp(200,function(){        
               		$('#loader').remove();
	            });
	            $(".loader").fadeOut("slow"); 
			},error : function(xhr,type,msg) {
			  console.log(xhr.responseText);
			  //console.log(type);
			  //console.log(msg);
			  swal('Sorry!',"Conflicting on JSON data.",'error');
			// Close loader        
                $('#loader').slideUp(200,function(){        
               		$('#loader').remove();
	            });
	            $(".loader").fadeOut("slow");
			}
			}); 
	    });

// Create new api settings
$('.api-settings-btn').click(function(e){
        e.preventDefault();
            // Requested data from API settings form posting    
        var connectionName = $('#connectionName').val();
        var sourceName     = $('#sourceName').val();
        var baseUrl 	   = $('#baseUrl').val();		
        var resourcePath   = $('#resourcePath').val();		
        var tokenType      = $('#tokenType').val();		
        var tokenString    = $('#tokenString').val();		
        var username       = $('#username').val();		
        var password       = $('#password').val();		
        var notes          = $('#notes').val();	

        var paramInfo = '&connectionName=' + connectionName+'&sourceName='+sourceName+'&baseUrl='+baseUrl+'&resourcePath=' + resourcePath+'&tokenType='+tokenType+'&tokenString='+tokenString+'&username=' + username+'&password='+password+'&notes='+notes;  
		console.log(paramInfo);

		if(connectionName==''){
			swal("Sorry!", "Please select connection name.","error");
		}/* else if(baseUrl==''){
			swal("Sorry!", "Please enter api base url.","error");
		} */else{

	// Loader		
			 $('.api-settings-btn').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: paramInfo,
		        //contentType: 'application/json',
	            url: '/api-settings-crud',						
	            success: function(data) {
	            	if(data=='success'){
	            		swal("Success!", "Your API settings has completed","success");
	            	} else {
	            		swal("Sorry!", "Your API settings has not been completed.","error");
	            	}
	// Close loader        
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();
		            });
		            $(".loader").fadeOut("slow"); 
	            },
	            error: function(err){
	            	console.log(err);
	// Close loader        
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();
		            });
		            $(".loader").fadeOut("slow");
	            }
	        });
		}
	

    });			


});				
    			
