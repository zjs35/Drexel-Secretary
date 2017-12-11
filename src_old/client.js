function displayHome(){
  var msg = `
    <h2>Welcome to !</h2>
  	<h2>Using This Page</h2>
  	<p>Yo are in the Main menu. Click menu to nevagate to other content</p>`;
  $("#content").html(msg);
}

//get and display Table Display prompts on main page
function displayFindOfficeHourPage(){
	//Create URL to tables page
	var URL = 'http://localhost:8080/officeHourFinder';

	//Construct AJAX request to localhost
	$.ajax({
		type: 'GET',
		url: URL,
		data: '{}',
		dataType: 'html',
		success: function(msg){
			$('#content').html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert('Error contacting server!');
		}
	});
}

//get a specific database table to display on Database Tables page
function getOfficeHour(){
	//get selected table option
	var dropdown = $('#opts').get(0);
  // Need some parsing here
	var LAST_NAME = dropdown.options[dropdown.selectedIndex].value;
  var FIRST_NAME = dropdown.options[dropdown.selectedIndex].value;
	var URL = 'http://localhost:8080/getOfficeHour';

	//Construct AJAX request to localhost
	$.ajax({
		type: 'GET',
		url: URL,
		data: {'LAST_NAME':LAST_NAME, 'FIRST_NAME':FIRST_NAME},
		dataType: 'html',
		success: function(msg){
			$('#out').html(msg);
		},
		error: function(xhr, ajaxOptions, thrownError){
			alert('Error contacting server!');
		}
	});
}

//make Event and send it to server
function makeEvent(){
	//get selected table option
	var email = $('#ProffEmail').get(0);
  //Need some parsing here
	//var NAME = dropdown.options[dropdown.selectedIndex].value;
	var URL = 'http://localhost:8080/getOfficeHour';
  var startTime =  parseDate($('input[name=eventStartDaytime]').val())  ,
      endTime = new Date ( startTime );
  endTime.setMinutes ( startTime.getMinutes() + 30 );

  var event = {
    'summary': 'Event Test',
    'location': 'My Office',
    'description': 'I love google api',
    'start': {
      'dateTime': startTime,
      'timeZone': 'America/New_York'
    },
    'end': {
      'dateTime': endTime,
      'timeZone': 'America/New_York'
    },
    'attendees': [
      {'email': email}
    ],
    "transparency": "opaque",
    "visibility": "public"
  };
}

// parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4]); // months are 0-based
}
