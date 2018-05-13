$(document).ready( function() {
const urlPath  = "https://centraldhis.mohfw.gov.bd/dhismohfw/";	
//const urlPath  = "http://localhost:8080/dhis/";	

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
// Middleware Instance Setup
$('.middleware-instances-setup-btn').click(function(e){
        e.preventDefault();
        var jsonArr       = [];
  		if($('#instanceName').val() == ''){
			swal("Sorry!", "Please enter Middleware Instance name.","error");
		} else if($('#instanceShortName').val() == ''){
			swal("Sorry!", "Please enter middleware instance short name.","error");
		} else if($('#baseUrl').val() == ''){
			swal("Sorry!", "Please enter API base url.","error");
		} else if($('#resourcePath').val() == ''){
			swal("Sorry!", "Please enter api resource path.","error");
		} else if($('#instanceType').val() == ''){
			swal("Sorry!", "Please select instance type.","error");
		} else if($('#sourceType').val() == ''){
			swal("Sorry!", "Please select source type.","error");
		}else if($('#queue').val() == ''){
			swal("Sorry!", "Please select queue.","error");
		}else{

			jsonArr.push({
	        channelName       :  $('#channelName').val(),
	        shortName 		  :  $('#shortName').val(),
	        baseUrl		      :  $('#baseUrl').val(),
	        resourcePath      :  $('#resourcePath').val(),
	        tokenType 		  :  $('#tokenType').val(),
	        tokenString		  :  $('#tokenString').val(),
	        username       	  :  $('#username').val(),
	        password 		  :  $('#password').val(),
	        channelType       :  $('#channelType').val(),
	        instanceType      :  $('#instance_type').val(),
	        queue             :  $('#queue').val(),
	        notes 		      :  $('#notes').val(),
	        });


	// Loader		
		$('.middleware-instances-setup-btn').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: {paramInfo: JSON.stringify(jsonArr)},
    			dataType: "json",
	            url: '/middleware-channel-crud',						
	            success: function(data) {
	            	console.log("data.responseText: ",data);
	            	if(data=='success'){
	            		swal("Success!", "New instance has added successfully","success");
	            	} else {
	            		swal("Sorry!", "New instance creation problem","error");
	            	}
	// Close loader and set timeout callback function 
				setTimeout(function(){	       
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();	   
		            });
		            $(".loader").fadeOut("slow"); 
		             window.location.reload();		             
	            }, 1000);  

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
// Multiple Instances Configure
$('.multiple-instances-configure-btn').click(function(e){
        e.preventDefault();
    // Requested data    
        var source      = $('#source').val();
        var destination = $('#destination').val();  			
        var notes       = $('#notes').val();	

        var paramInfo = '&source=' +source+'&destination='+destination+'&notes='+notes; 		 

		if(source==''){
			swal("Sorry!", "Source is required.");
		} else if(destination==''){
			swal("Sorry!", "Destination is required.","error");
		} else{

	// Loader		
		$('.multiple-instances-configure-btn').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: paramInfo,
		        //contentType: 'application/json',
	            url: '/multiple-instances-create',						
	            success: function(data) {
	            	if(data=='success'){
	            		swal("Success!", "New configuration has added successfully","success");
	            	} else {
	            		swal("Sorry!", "New configuration creation problem","error");
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

    // JSON payload ready    
        var data =$("#displayFacilityInformationText").val();
        var pdata = data.replace(/&quot;/g, '"');
        var displayLimit = $('#displayLimit').val();
        var jsonPayload; 
        if(displayLimit==1){
        	jsonPayload   = pdata.slice(4, -5);
        } else {
        	jsonPayload   = pdata.slice(3, -4);
        }
		
        //console.log(jsonPayload);
    // Loader    
        $('#loaderClass').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');

	// Ajax Posting
				$.ajax({
				type: 'POST',
				data: jsonPayload,
		        contentType: 'application/json',
	            url: '/facility-create-json-payload',						
	            //url: '/shcedular-json-payload-send-dhis2',						
	            success: function(result) {
	            	
	            	console.log("JSON Payload Response: ",result);
	            	if(result == 200 || result==201){
	            		swal('Congratulations!','Your JSON Payload has submitted successfully.','success');
	            	} else if(result == 409 ){
	            		swal('Sorry!','Conflicting in posting json payload','error');
	            	} else if(result == 500 ){
	            		swal('Sorry!','Internal Server Error!','error');
	            	} 

	// Result print in HTML view            	
	                $("#displayFacilityInformation").html(result);
	                var textFieldValue = document.getElementById('displayFacilityInformationText');
					textFieldValue.value=result;
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
	    });

// Create new api settings
$('.api-settings-btn').click(function(e){
        e.preventDefault();
            // Requested data from API settings form posting    
        var connectionName = $('#connectionName').val();
        var baseUrl 	   = $('#baseUrl').val();		
        var resourcePath   = $('#resourcePath').val();		
        var tokenType      = $('#tokenType').val();		
        var tokenString    = $('#tokenString').val();		
        var username       = $('#username').val();		
        var password       = $('#password').val();		
        var notes          = $('#notes').val();	

        var paramInfo = '&connectionName=' + connectionName+'&baseUrl='+baseUrl+'&resourcePath=' + resourcePath+'&tokenType='+tokenType+'&tokenString='+tokenString+'&username=' + username+'&password='+password+'&notes='+notes;  
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

// Create new Schedular Information
$('.schedular-settings-btn').click(function(e){
        e.preventDefault();
            // Requested data from API settings form posting  
        var is_enable;      
        var name           = $('#name').val();
        var short_code 	   = $('#short_code').val();
        var source   	   = $('#source').val();
        if($('#is_enable:checked').val()=='1'){
        	is_enable = 1;
        } else {
        	is_enable = 0;
        }			
        var schedular_type = $('#schedular_type').val();

        var minutes     = $('#minutes').val();		
        var hours       = $('#hours').val();		
        //var dayOfMonth  = $('#dayOfMonth').val();		
        //var monthOfYear = $('#monthOfYear').val();		
        //var dayOfWeek   = $('#dayOfWeek').val();		
        var exportedDataLimit = $('#exportedDataLimit').val();	
        var exportFromDays    = $('#exportFromDays').val();		
        var notes       = $('#notes').val();	

        //alert(exportedDataLimit+exportedDataLimit);

        var paramInfo = '&name=' + name +'&short_code='+short_code+'&source='+source+'&is_enable='+is_enable+'&schedular_type=' + schedular_type+'&minutes='+minutes+'&hours='+hours/*+'&dayOfMonth='+dayOfMonth+'&monthOfYear='+monthOfYear+'&dayOfWeek='+dayOfWeek*/+'&exportedDataLimit='+exportedDataLimit+'&exportFromDays='+exportFromDays+'&notes='+notes;  
		console.log(paramInfo);

		if(name==''){
			swal("Sorry!", "Please enter schedular name.","error");
		}else if(hours>=24){
			swal("Sorry!", "Invalid hours.","error");
			$('#hours').val('');
		} else if(minutes>=60){
			swal("Sorry!", "Invalid minutes.","error");
			$('#hours').val('');
		} else{

	// Loader		
			 $('.schedular-settings-btn').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: paramInfo,
		        //contentType: 'application/json',
	            url: '/schedular-settings-crud',						
	            success: function(data) {
	            	if(data=='success'){
	            		swal("Success!", "Your schedular settings was successful.","success");
	            	} else {
	            		swal("Sorry!", "Your schedular settings was unsuccessful.","error");
	            	}

	// Close loader and set timeout callback function 
				setTimeout(function(){	       
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();	   
		            });
		            $(".loader").fadeOut("slow"); 
		             window.location.reload();		             
	            }, 1000);  
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

// Enable or disable cron job 
$('#is_enable').on('change',function(e){

		var is_enable;
		if($('#is_enable:checked').val()=='1'){
			is_enable = 1; 

		} else if($('#is_enable:checked').val()=='on') {
			is_enable = 1;
		} else {
			is_enable = 0;
		}
        var paramInfo = '&is_enable='+is_enable;

	// Loader		
			$('#is_enable').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: paramInfo,
		        //contentType: 'application/json',
	            url: '/schedular-enable-disable',						
	            success: function(data) {
	            	if(data=='success'){
	            		swal("Success!", "Now your schedular has enabled.","success");
	            		$('#is_enable').val(' ');	
	            	} else {
	            		swal("Sorry!", "Your Schedular settings has not been completed.","error");
	            		$('#is_enable').val(' ');	
	            	}
	// Close loader and set timeout callback function 
					setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 1000);            		

	            },
	            error: function(err){
	            	console.log(err);
	// Close loader and set timeout callback function         
	                setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 3000);
	            }
	        });

    });	

// Create Data exchange mode
$('#create-exchange-mode').on('click',function(e){
		var jsonArr = [];	

		if(exchangeMode==''){
			swal("Sorry!", "Please select exchange mode.","error");
		} else {

			// Exchange mode 
			var is_enable;
			if($('#exchangeModeStatus:checked').val()=='1'){
				is_enable = 1; 

			} else if($('#exchangeModeStatus:checked').val()=='on') {
				is_enable = 1;
			} else {
				is_enable = 0;
			}

			// Auto Sync 
			let autoSyncStatus;
			if($('#autoSyncStatus:checked').val()=='1'){
				autoSyncStatus = 1; 
			} else if($('#autoSyncStatus:checked').val()=='on') {
				autoSyncStatus = 1;
			} else {
				autoSyncStatus = 0;
			}
		
			jsonArr.push({
		        exchangeMode:  $('#exchangeMode').val(),
		        modeStatus 	:  is_enable,
		        autoSyncStatus:  $('#autoSyncStatus').val(),
		        autoSyncTime:  $('#autoSyncTime').val(),
		        notes		:  $('#notes').val(),
	    	});    	

	// Loader		
			$('#exchangeMode').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: {paramInfo: JSON.stringify(jsonArr)},
		        //contentType: 'application/json',
	            url: '/create-exchange-mode',						
	            success: function(data) {
	            	if(data=='success'){
	            		swal("Success!", "Exchange mode has created successfully.","success");
	            		$('#exchangeMode').val(' ');	
	            	} else {
	            		swal("Sorry!", "Exchange mode was not created.","error");
	            		$('#exchangeMode').val(' ');	
	            	}
	// Close loader and set timeout callback function 
					setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 1000);            		

	            },
	            error: function(err){
	            	console.log(err);
	// Close loader and set timeout callback function         
	                setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 3000);
	            }
	        });
		}
});	
// Setup translator elements mapping
$('#translator-elements-mapping-btn').on('click',function(e){
		var jsonArr = [];
		if(orgUnitName==''){
			swal("Sorry!", "Please add organization unit.","error");
		} else if(orgUnitShortName==''){
			swal("Sorry!", "Please add organization unit short name.","error");
		} else if(code==''){
			swal("Sorry!", "Please add code.","error");
		} else if(openingDate==''){
			swal("Sorry!", "Please add opening date.","error");
		} else {
		
			jsonArr.push({
		        channelID  : $('#channelID').val(),
		        orgUnitName: $('#orgUnitName').val(),
		        orgUnitShortName: $('#orgUnitShortName').val(),
		        code	   : $('#code').val(),
		        description: $('#description').val(),
		        openingDate: $('#openingDate').val(),
		        closedDate : $('#closedDate').val(),
		        level1ID   : $('#level1ID').val(),
		        level1Name : $('#level1Name').val(),
		        level2ID   : $('#level2ID').val(),
		        level2Name : $('#level2Name').val(),
		        level3ID   : $('#level3ID').val(),
		        level3Name : $('#level3Name').val(),
		        level4ID   : $('#level4ID').val(),
		        level4Name : $('#level4Name').val(),
		        level5ID   : $('#level5ID').val(),
		        level5Name : $('#level5Name').val(),
		        level6ID   : $('#level6ID').val(),
		        level6Name : $('#level6Name').val(),
		        comment    : $('#comment').val(),
		        url        : $('#url').val(),
		        contactPerson: $('#contactPerson').val(),
		        address	   : $('#address').val(),
		        email      : $('#email').val(),
		        phoneNumber: $('#phoneNumber').val(),
		        latitude   : $('#latitude').val(),
		        longitude  : $('#longitude').val(),
	    	});    	

	// Loader		
			$('#translator-elements-mapping-btn').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: {paramInfo: JSON.stringify(jsonArr)},
		        //contentType: 'application/json',
	            url: '/translator-elements-map-create',						
	            success: function(data) {
	            	if(data=='success'){
	            		swal("Success!", "Translator mapping has created successfully.","success");
	            		$('#exchangeMode').val(' ');	
	            	} else {
	            		swal("Sorry!", "Translator mapping was not created.","error");
	            		$('#exchangeMode').val(' ');	
	            	}
	// Close loader and set timeout callback function 
					setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 1000);            		

	            },
	            error: function(err){
	            	console.log(err);
	// Close loader and set timeout callback function         
	                setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 3000);
	            }
	        });
		}
});
/***Data Syncronization or Transaction mode Automatic/ Manual Setup***/
// Enable or disable cron job 
$('#isEnableSynMode').on('change',function(e){

		var is_enable;
		if($('#isEnableSynMode:checked').val()=='1'){
			is_enable = 1; 

		} else if($('#isEnableSynMode:checked').val()=='on') {
			is_enable = 1;
		} else {
			is_enable = 0;
		}
        var paramInfo = '&is_enable='+is_enable;

	// Loader		
			$('#isEnableSynMode').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: paramInfo,
		        //contentType: 'application/json',
	            url: '/data-exchange-mode-update',						
	            success: function(data) {
	            	if(data=='success'){
	            		swal("Success!", "Message exchange mode has updated successfully.","success");
	            		$('#isEnableSynMode').val(' ');	
	            	} else {
	            		swal("Sorry!", "Message exchange mode was not updated.","error");
	            		$('#isEnableSynMode').val(' ');	
	            	}
	// Close loader and set timeout callback function 
					setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 1000);            		

	            },
	            error: function(err){
	            	console.log(err);
	// Close loader and set timeout callback function         
	                setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 3000);
	            }
	        });

    });	
// Enable/ disable auto sync 
$('#autoSyncStatus').on('change',function(e){

		var is_enable;
		if($('#autoSyncStatus:checked').val()=='1'){
			is_enable = 1; 

		} else if($('#autoSyncStatus:checked').val()=='on') {
			is_enable = 1;
		} else {
			is_enable = 0;
		}
        var paramInfo = '&is_enable='+is_enable;

	// Loader		
			$('#autoSyncStatus').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: paramInfo,
		        //contentType: 'application/json',
	            url: '/auto-sync-mode-update',						
	            success: function(data) {
	            	if(data=='success'){
	            		swal("Success!", "Auto sync has updated successfully.","success");
	            		$('#autoSyncStatus').val(' ');	
	            	} else {
	            		swal("Sorry!", "Auto sync was not updated.","error");
	            		$('#autoSyncStatus').val(' ');	
	            	}
	// Close loader and set timeout callback function 
					setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 1000);            		

	            },
	            error: function(err){
	            	console.log(err);
	// Close loader and set timeout callback function         
	                setTimeout(function(){	       
		                $('#loader').slideUp(200,function(){        
		               		$('#loader').remove();	   
			            });
			            $(".loader").fadeOut("slow"); 
			             window.location.reload();
		            }, 3000);
	            }
	        });

    });

/****************************************************************
***************************Reports Area**************************
*****************************************************************/

	
// Searching Facility	
   $('.log-history-search').click(function(e){
        e.preventDefault();

    // Requested data for posting    
        var logType      = $('#logType').val();
        var dateFrom     = $('#dateFrom').val();
        var displayLimit = $('#displayLimit').val();		
		var find_info = '&logType=' + logType+'&dateFrom='+dateFrom+'&displayLimit='+displayLimit;  
		console.log(find_info);

		if(logType==''){
			swal("Sorry!", "Please select searching type.","error");
		} /*else if(dateFrom==''){
			swal("Sorry!", "Please select your searching date.","error");
		}*/ else{

			 $('.log-history-search').after('<div class="loader"><img src="images/loading-small.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				data: find_info,
		        //contentType: 'application/json',
	            url: '/log-history-search',						
	            success: function(data) {
	                console.log('success');
	                if(window != undefined){
	                	console.log("Sorry in error log!");
	                }
	                //console.log(data);
	                //console.log(JSON.stringify(data));
	                $("#displayLogInformation").html(data);
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
/************************************************
******************Facility Blank Fields**********
*************************************************/

$('#facilityLevel2').change(function(){
	$('#facilityLevel3').html('');
	var facilityId = $('#facilityLevel2').val();
	var level = 3;	
	var findInfo = '&facilityId=' + facilityId+'&level=' + level; 

	$('#facilityLevel2').after('<div class="loader"><img src="images/loading-small.gif" alt="Searching......" /></div>');
	// Ajax posting 
	$.ajax({
		type: 'POST',
		data: findInfo,
        url: '/facility-blank-fields-dropdown',						
        success: function(data) {
            var dataJSON = $.parseJSON(JSON.stringify(data));
	         $('#facilityLevel3').append('<option value="">Select District</option>');
	         for (i=0; i < dataJSON.children.length; i++){
	         	var id=dataJSON.children[i].id;
	         	var displayName=dataJSON.children[i].displayName;
	         	$('#facilityLevel3').append('<option value='+id+'>'+displayName+'</option>');
	         	$('#facilityLevel3').trigger("chosen:updated");	         	
	         }
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
});   

$('#facilityLevel3').change(function(){
	$('#facilityLevel4').html('');
	var facilityId = $('#facilityLevel3').val();
	var level = 4;	
	var findInfo = '&facilityId=' + facilityId+'&level=' + level;  
	$('#facilityLevel3').after('<div class="loader"><img src="images/loading-small.gif" alt="Searching......" /></div>');
	// Ajax posting 
	$.ajax({
		type: 'POST',
		data: findInfo,
        url: '/facility-blank-fields-dropdown',						
        success: function(data) {
            var dataJSON = $.parseJSON(JSON.stringify(data));

	         $('#facilityLevel4').append('<option value="">Select Upazila</option>');
	         for (i=0; i < dataJSON.children.length; i++){
	         	var id=dataJSON.children[i].id;
	         	var displayName=dataJSON.children[i].displayName;
	         	$('#facilityLevel4').append('<option value='+id+'>'+displayName+'</option>');
	         	$('#facilityLevel4').trigger("chosen:updated");	         	
	         }
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
}); 

$('#facilityLevel4').change(function(){
	$('#facilityLevel5').html('');
	var facilityId = $('#facilityLevel4').val();
	var level = 5;	
	var findInfo = '&facilityId=' + facilityId+'&level=' + level;   
	$('#facilityId').after('<div class="loader"><img src="images/loading-small.gif" alt="Searching......" /></div>');
	// Ajax posting 
	$.ajax({
		type: 'POST',
		data: findInfo,
        url: '/facility-blank-fields-dropdown',						
        success: function(data) {
            var dataJSON = $.parseJSON(JSON.stringify(data));

	         $('#facilityLevel5').append('<option value="">Select Union</option>');
	         for (i=0; i < dataJSON.children.length; i++){
	         	var id=dataJSON.children[i].id;
	         	var displayName=dataJSON.children[i].displayName;
	         	$('#facilityLevel5').append('<option value='+id+'>'+displayName+'</option>');
	         	$('#facilityLevel5').trigger("chosen:updated");	         	
	         }
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
}); 
// Search blank fields in DHIS2 

$('.search-blank-fields').click(function(e){
	e.preventDefault();
	var facilityId = null;
	var level2 = $('#facilityLevel2').val(); // division
	var level3 = $('#facilityLevel3').val(); // district
	var level4 = $('#facilityLevel4').val(); // upazila
	var level5 = $('#facilityLevel5').val(); // Union

	
	if(level2 !='' && level3 !='' && level4 !='' && level5 !='') {
		facilityId = level5;

	} else if(level2 !='' && level3 !='' && level4 !='' && level5 ==''){
		facilityId = level4;

	} else if(level2 !='' && level3 !='' && level4=='' && level5==''){
		facilityId = level3;

	} else if(level2 !='' && level3 =='' && level4 =='' && level5 ==''){
		facilityId = level2;
	} 	
	var findInfo = '&facilityId=' + facilityId; 

	$('.search-blank-fields').after('<div class="loader"><img src="images/loading-small.gif" alt="Searching......" /></div>');
	// Ajax posting 
	$.ajax({
		type: 'POST',
		data: findInfo,
        url: '/facility-blank-fields-search',						
        success: function(data) {
            var dataJSON = $.parseJSON(JSON.stringify(data));
            let fieldsInfoArray = [];
            let sn =1;
            for (i=0; i < dataJSON.children.length; i++){

            	let editFacility = "<a href='http://localhost:8082/blank-facility-update?uid="+dataJSON.children[i].id+"' target='_blank'><button class='btn btn-primary' style='cursor:pointer' id="+dataJSON.children[i].id+">Edit</button></a>";

            	let editFacilityInDHIS = "<a href='"+urlPath+"dhis-web-maintenance/#/edit/organisationUnitSection/organisationUnit/"+dataJSON.children[i].id+"' target='_blank'><button class='btn btn-primary' style='cursor:pointer' id="+dataJSON.children[i].id+">Edit in DHIS</button></a>";

            	
            	//let coordinates = dataJSON.children[i].coordinates;
            	let coordinates = code = address= contactPerson =phoneNumber = email = null;
            	if(dataJSON.children[i].code == null || dataJSON.children[i].code ==''){
            		code = '';
            	} else {
            		code = dataJSON.children[i].code;
            	}

            	if(dataJSON.children[i].address == null || dataJSON.children[i].address ==''){
            		address = '';

            	} else {
            		address = dataJSON.children[i].address;
            	}
            	if(dataJSON.children[i].contactPerson == null || dataJSON.children[i].contactPerson ==''){
            		contactPerson = '';
            	} else {
            		contactPerson = dataJSON.children[i].contactPerson;
            	}

            	if(dataJSON.children[i].phoneNumber == null || dataJSON.children[i].phoneNumber ==''){
            		phoneNumber = '';
            	} else {
            		phoneNumber = dataJSON.children[i].phoneNumber;
            	}

            	if(dataJSON.children[i].email == null || dataJSON.children[i].email ==''){
            		email = '';
            	} else {
            		email = dataJSON.children[i].email;
            	}

            	if(level5 !='' && dataJSON.children[i].coordinates !=''){
            		coordinates = dataJSON.children[i].coordinates;
            	} /*else if(level5 !='' && dataJSON.children[i].coordinates ==''){
            		coordinates = '';
            	}*/ else {
            		coordinates = '';
            	}
            	
            	fieldsInfoArray.push([
            		sn++, 
            		dataJSON.children[i].displayName,
            		code,
            		address,
            		contactPerson,
            		phoneNumber,
            		email,
            		coordinates, 
            		editFacility,
            		editFacilityInDHIS
            	]);	         	
	         		         	
	         }
	        

            if(dataJSON==null){

			swal({   title: "Sorry!",   text: "There is no data in your selection parameter.",   type: "error",confirmButtonText: "Cool" });

			$('#loader').slideUp(200,function(){		
			$('#loader').remove();});
			$(".loader").fadeOut("slow");
			var dataTable = $('#displayFacilityBlankFieldsInfo').DataTable(); 
				dataTable.clear();
			    dataTable.row.add([
			        '',
			        '',
			        '',
			        '',
			        '',
			        '',
			        '',
			        '',
			        '',
			        ''
			    ]).draw();
		}
		$('#displayFacilityBlankFieldsInfo').DataTable( {
		        data: fieldsInfoArray,
		        columns: [
		            
		            { title: "S/N" },
		            { title: "Facility Name" },
		            { title: "Code" },
		            { title: "Address" },
		            { title: "Contact Person" },
		            { title: "Email" },
		            { title: "Mobile" },
		            { title: "Co-ordinates" },
		            { title: "Edit" },
		            { title: "DHIS Edit" }
		        ],
		        destroy: true, 
		        "pageLength": 30,
		        className: "dt-specialColorTH"
		} );
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
});
});

// Update facility Information
$('.blank-facility-info-update-btn').click(function(e){
	e.preventDefault();

	var code 		= $('#code').val();  
	var description = $('#description').val();  
	var closedDate 	= $('#closeDate').val();  
	var comment 	= $('#comment').val();  
	var url 		= $('#url').val();  
	var address 	= $('#address').val();  
	var email 		= $('#email').val();  
	var contactPerson = $('#contactPerson').val();  
	var phoneNumber = $('#phoneNumber').val();  
	var latitude 	= $('#latitude').val();  
	var longitude 	= $('#longitude').val();
// Get url param, UID	
	var parseQueryString = function(url) {
		  var urlParams = {};
		  url.replace(
		    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
		    function($0, $1, $2, $3) {
		      urlParams[$1] = $3;
		    }
		  );
		  
		  return urlParams;
	}
	var urlToParse = location.search;  
	var result     = parseQueryString(urlToParse );  
	var uid        = result.uid;

	var findInfo = '&uid=' + uid+'&code=' + code+'&description=' + description+'&closedDate=' + closeDate+'&comment=' + comment+'&url=' + url+'&address=' + address+'&email=' + email+'&contactPerson='+contactPerson+'&phoneNumber=' + phoneNumber+'&latitude=' + latitude+'&longitude=' + longitude;

	$('.blank-facility-info-update-btn').after('<div class="loader"><img src="images/loading-small.gif" alt="Searching......" /></div>');
	// Ajax posting 
	$.ajax({
		type: 'POST',
		data: findInfo,
        url: '/blank-fields-facility-update',						
        success: function(data) {
            var dataJSON = $.parseJSON(JSON.stringify(data));
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
});

/*******************************************************
******************Multiple DHIS2 Interoperability ******
********************************************************/

$('.search-multiple-instances-sync-type-btn').click(function(e){
	e.preventDefault();

	var facilityId = null;
	var level2 = $('#facilityLevel2').val(); // division
	var level3 = $('#facilityLevel3').val(); // district
	var level4 = $('#facilityLevel4').val(); // upazila
	var level5 = $('#facilityLevel5').val(); // Union

	
	if(level2 !='' && level3 !='' && level4 !='' && level5 !='') {
		facilityId = level5;

	} else if(level2 !='' && level3 !='' && level4 !='' && level5 ==''){
		facilityId = level4;

	} else if(level2 !='' && level3 !='' && level4=='' && level5==''){
		facilityId = level3;

	} else if(level2 !='' && level3 =='' && level4 =='' && level5 ==''){
		facilityId = level2;
	} 	
	var findInfo = '&facilityId=' + facilityId; 

	$('.search-multiple-instances-sync-type-btn').after('<div class="loader"><img src="images/loading-small.gif" alt="Searching......" /></div>');
	// Ajax posting 
	$.ajax({
		type: 'POST',
		data: findInfo,
        url: '/multiple-dhis-sync-type-search',						
        success: function(data) {
            var dataJSON = $.parseJSON(JSON.stringify(data));
            let fieldsInfoArray = [];
            let sn =1;
            for (i=0; i < dataJSON.children.length; i++){
            	
            	//let coordinates = dataJSON.children[i].coordinates;
            	let coordinates = code = address= contactPerson =phoneNumber = email = null;
            	if(dataJSON.children[i].code == null || dataJSON.children[i].code ==''){
            		code = '';
            	} else {
            		code = dataJSON.children[i].code;
            	}

            	if(dataJSON.children[i].address == null || dataJSON.children[i].address ==''){
            		address = '';

            	} else {
            		address = dataJSON.children[i].address;
            	}
            	if(dataJSON.children[i].contactPerson == null || dataJSON.children[i].contactPerson ==''){
            		contactPerson = '';
            	} else {
            		contactPerson = dataJSON.children[i].contactPerson;
            	}

            	if(dataJSON.children[i].phoneNumber == null || dataJSON.children[i].phoneNumber ==''){
            		phoneNumber = '';
            	} else {
            		phoneNumber = dataJSON.children[i].phoneNumber;
            	}

            	if(dataJSON.children[i].email == null || dataJSON.children[i].email ==''){
            		email = '';
            	} else {
            		email = dataJSON.children[i].email;
            	}

            	if(level5 !='' && dataJSON.children[i].coordinates !=''){
            		coordinates = dataJSON.children[i].coordinates;
            	} /*else if(level5 !='' && dataJSON.children[i].coordinates ==''){
            		coordinates = '';
            	}*/ else {
            		coordinates = '';
            	}
            	
            	fieldsInfoArray.push([
            		sn++, 
            		dataJSON.children[i].displayName,
            		code,
            		address,
            		contactPerson,
            		phoneNumber,
            		email,
            		coordinates
            	]);	         	
	         		         	
	         }
	        

            if(dataJSON==null){

			swal({   title: "Sorry!",   text: "There is no data in your selection parameter.",   type: "error",confirmButtonText: "Cool" });

			$('#loader').slideUp(200,function(){		
			$('#loader').remove();});
			$(".loader").fadeOut("slow");
			var dataTable = $('#displayData').DataTable(); 
				dataTable.clear();
			    dataTable.row.add([
			        '',
			        '',
			        '',
			        '',
			        '',
			        '',
			        '',
			        '',
			        '',
			        ''
			    ]).draw();
		}
		$('#displayData').DataTable( {
		        data: fieldsInfoArray,
		        columns: [
		            
		            { title: "S/N" },
		            { title: "Facility Name" },
		            { title: "Code" },
		            { title: "Address" },
		            { title: "Contact Person" },
		            { title: "Email" },
		            { title: "Mobile" },
		            { title: "Co-ordinates" },
		            { title: "Edit" },
		            { title: "DHIS Edit" }
		        ],
		        destroy: true, 
		        "pageLength": 30,
		        className: "dt-specialColorTH"
		} );
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
});

$('.sync-multiple-dhis-datasubmit-btn').click(function(e){
	e.preventDefault();

	var facilityId = null;
	var level2 = $('#facilityLevel2').val(); // division
	var level3 = $('#facilityLevel3').val(); // district
	var level4 = $('#facilityLevel4').val(); // upazila
	var level5 = $('#facilityLevel5').val(); // Union

	$('.sync-multiple-dhis-datasubmit-btn').after('<div class="loader"><img src="images/loading-small.gif" alt="Searching......" /></div>');
	
	if(level2 !='' && level3 !='' && level4 !='' && level5 !='') {
		facilityId = level5;

	} else if(level2 !='' && level3 !='' && level4 !='' && level5 ==''){
		facilityId = level4;

	} else if(level2 !='' && level3 !='' && level4=='' && level5==''){
		facilityId = level3;

	} else if(level2 !='' && level3 =='' && level4 =='' && level5 ==''){
		facilityId = level2;
	} 	
	var findInfo = '&facilityId=' + facilityId; 

	$.ajax({
		type: 'POST',
		data: findInfo,
        url: '/multiple-dhis-sync-submit',						
        success: function(data) {
        	console.log(data);
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

});	

// All delete operations
$('.delete-settings').click(function(e){
		e.preventDefault();

	var id = $(this).val();
	var flag	  = id.split("_");
	var findInfo = '&id=' + flag[0]+'&flag=' + flag[1]; 
	swal({
	  title: "Are you sure?",
	  text: "Your will not be able to recover this data!",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonClass: "btn-danger",
	  confirmButtonText: "Yes, delete it!",
	  closeOnConfirm: false
	},
	function(){

		$.ajax({
			type: 'POST',
			data: findInfo,
	        url: '/delete-channel-settings',						
	        success: function(data) {
	        	console.log(data);
	        	if(data=='success'){
	        		swal("Thanks!", "Your channel information has been deleted successfully.","success");
	        	}
		// Close loader and set timeout callback function 
				setTimeout(function(){	       
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();	   
		            });
		            $(".loader").fadeOut("slow"); 
		             window.location.reload();
	            }, 1000);  

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
		//swal("Deleted!", "Your imaginary file has been deleted.", "success");
	});
});



// RabbitMQ Operations
$('.rabbitmqsender-btn').click(function(e){
		e.preventDefault();

	var id =123;
	var findInfo = '&id=' + id; 
	swal({
	  title: "Are you sure?",
	  text: "Your will not be able to recover this data!",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonClass: "btn-danger",
	  confirmButtonText: "Yes, send it!",
	  closeOnConfirm: false
	},
	function(){

		$.ajax({
			type: 'POST',
			data: findInfo,
	        url: '/rabbitmq-sender',						
	        success: function(data) {
	        	console.log(data);
	        	if(data=='success'){
	        		swal("Thanks!", "Your message has sent","success");
	        	}
		// Close loader and set timeout callback function 
			setTimeout(function(){	       
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();	   
		            });
		            $(".loader").fadeOut("slow"); 
		             window.location.reload();
	            }, 1000);  

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

	});
});

// RabbitMQ Operations
$('.rabbitmqreceiver-btn').click(function(e){
	e.preventDefault();

	var id = 1234;
	var findInfo = '&id=' + id; 
	swal({
	  title: "Are you sure?",
	  text: "Your will not be able to recover this data!",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonClass: "btn-danger",
	  confirmButtonText: "Yes, want to procced!",
	  closeOnConfirm: false
	},
	function(){

		$.ajax({
			type: 'POST',
			data: findInfo,
	        url: '/rabbitmq-receiver',						
	        success: function(data) {
	        	console.log(data);
	        	if(data=='success'){
	        		swal("Thanks!", "Your message has sent","success");
	        	}
		// Close loader and set timeout callback function 
			setTimeout(function(){	       
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();	   
		            });
		            $(".loader").fadeOut("slow"); 
		             window.location.reload();
	            }, 1000);  

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

	});
});

// New Queue Setup-queue-setup-btn
$('.queue-setup-btn').click(function(e){
        e.preventDefault();
        var jsonArr = [];
  		if($('#queueName').val() == ''){
			swal("Sorry!", "Please enter queue name.","error");
		} else if($('#durability').val() == ''){
			swal("Sorry!", "Please select durability.","error");
		} else if($('#autoDelete').val() == ''){
			swal("Sorry!", "Please select auto delete type.","error");
		} else if($('#maxLength').val() == ''){
			swal("Sorry!", "Please add max lenth.","error");
		} else{

			jsonArr.push({
	        	queueName   : $('#queueName').val(),
	        	durability 	: $('#durability').val(),
	        	autoDelete	: $('#autoDelete').val(),
	        	autoExpire	: $('#autoExpire').val(),
	        	maxLength	: $('#maxLength').val(),
	        	routingKey	: $('#routingKey').val(),
	        });


	// Loader		
		$('.queue-setup-btn').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: {paramInfo: JSON.stringify(jsonArr)},
    			dataType: "json",
	            url: '/add-new-queue',						
	            success: function(data) {
	            	
	            	if(data=='success'){
	            		swal("Success!", "New queue has added successfully","success");
	            	} else {
	            		swal("Sorry!", "Queue creation problem","error");
	            	}
	// Close loader and set timeout callback function 
				setTimeout(function(){	       
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();	   
		            });
		            $(".loader").fadeOut("slow"); 
		             window.location.reload();		             
	            }, 1000);  

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
// Modal over modal and close the top most modal
$('.modal-auto-close').click(function(e) {
   
    $('#viewMessageSummary').modal('hide');
});

$('.syncDurableMessages').click(function(e) {
   
   // Loader		
		$('#syncDurableMessages').after('<div class="loader"><img src="images/load.gif" alt="Searching......" /></div>');
	// Ajax posting 
			$.ajax({
				type: 'POST',
				cache: false,
				data: "Julhas",
    			dataType: "json",
	            url: '/durable-queue-sync',						
	            success: function(data) {
	            	
	            	if(data=='success'){
	            		swal("Success!", "New queue has added successfully","success");
	            	} else {
	            		swal("Sorry!", "Queue creation problem","error");
	            	}
	// Close loader and set timeout callback function 
				setTimeout(function(){	       
	                $('#loader').slideUp(200,function(){        
	               		$('#loader').remove();	   
		            });
		            $(".loader").fadeOut("slow"); 
		             window.location.reload();		             
	            }, 1000);  

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


});
    			
