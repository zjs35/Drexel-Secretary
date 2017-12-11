// You'll need a single TembooSession object in your code, eg:
var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession("marcohwlam", "myFirstApp", "6zKAg4rIO5UQc9f5THiprhWZda4umVNd");
var Google = require("temboo/Library/Google/OAuth");
var GoogleCal = require("temboo/Library/Google/Calendar");

var initializeOAuthChoreo = new Google.InitializeOAuth(session);
var finalizeOAuthChoreo = new Google.FinalizeOAuth(session);

//Client ID
var CLIENT_ID = "1017243933640-ut5gjuvpv7c0s82puu4sp6q19ln9snkd.apps.googleusercontent.com";
var CLIENT_SECRET = "CGv9OpKFhYWmg9-vxMH95Q0D";

// Instantiate and populate the input set for the choreo
var initializeOAuthInputs = initializeOAuthChoreo.newInputSet();

// Instantiate and populate the input set for the choreo
var finalizeOAuthInputs = finalizeOAuthChoreo.newInputSet();

// Set inputs
initializeOAuthInputs.set_ForwardingURL("https://localhost:3000");
initializeOAuthInputs.set_Scope("https://www.googleapis.com/auth/calendar");
initializeOAuthInputs.set_ClientID(CLIENT_ID);

// Run the choreo, specifying success and error callback handlers
initializeOAuthChoreo.execute(
    initializeOAuthInputs,
    // function(results){
    //   console.log(results.get_AuthorizationURL());
    // },

    function(results){
      console.log(results.get_CallbackID());
      // finalizeOAuthInputs.set_CallbackID(results.get_CallbackID());
    },

    function(error){console.log(error.type); console.log(error.message);}
);


// Set inputs
finalizeOAuthInputs.set_ClientSecret(CLIENT_SECRET);
//finalizeOAuthInputs.set_CallbackID("marcohwlam/309e1e40-6e0d-43f5-b4ae-8235ca39107e");
finalizeOAuthInputs.set_ClientID(CLIENT_ID);
// Run the choreo, specifying success and error callback handlers
finalizeOAuthChoreo.execute(
    finalizeOAuthInputs,
    function(results){console.log(results.get_AccessToken());},
    function(error){console.log(error.type); console.log(error.message);}
);



var getAllCalendarsChoreo = new GoogleCal.GetAllCalendars(session);

// Instantiate and populate the input set for the choreo
var getAllCalendarsInputs = getAllCalendarsChoreo.newInputSet();

// Set inputs
getAllCalendarsInputs.set_RefreshToken("1/vNZ4l7p7Pb3STRRls4hQTWQhywJhDMvBAq_IRdozS4w");
getAllCalendarsInputs.set_ClientSecret("CGv9OpKFhYWmg9-vxMH95Q0D");
getAllCalendarsInputs.set_ClientID("1017243933640-ut5gjuvpv7c0s82puu4sp6q19ln9snkd.apps.googleusercontent.com");

// Run the choreo, specifying success and error callback handlers
getAllCalendarsChoreo.execute(
    getAllCalendarsInputs,
    function(results){console.log(results.get_NewAccessToken());},
    function(error){console.log(error.type); console.log(error.message);}
);


// var createEventChoreo = new GoogleCal.CreateEvent(session);
//
// // Instantiate and populate the input set for the choreo
// var createEventInputs = createEventChoreo.newInputSet();
//
// // Set inputs
// createEventInputs.set_EventTitle("Testing");
// createEventInputs.set_StartDate("2017-12-11");
// createEventInputs.set_RefreshToken("1/vNZ4l7p7Pb3STRRls4hQTWQhywJhDMvBAq_IRdozS4w");
// createEventInputs.set_EndTime("12:30:00");
// createEventInputs.set_ClientSecret("CGv9OpKFhYWmg9-vxMH95Q0D");
// createEventInputs.set_CalendarID("marcohwlam@gmail.com");
// createEventInputs.set_StartTime("12:00:00");
// createEventInputs.set_ClientID("1017243933640-ut5gjuvpv7c0s82puu4sp6q19ln9snkd.apps.googleusercontent.com");
// createEventInputs.set_EndDate("2017-12-11");
//
// // Run the choreo, specifying success and error callback handlers
// createEventChoreo.execute(
//     createEventInputs,
//     function(results){console.log(results.get_TimezoneSetting());},
//     function(error){console.log(error.type); console.log(error.message);}
// );
