var express = require('express');
var google = require("googleapis");
var app = express();

var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession("marcohwlam", "myFirstApp", "6zKAg4rIO5UQc9f5THiprhWZda4umVNd");
var Google = require("temboo/Library/Google/OAuth");
var GoogleCal = require("temboo/Library/Google/Calendar");

var initializeOAuthChoreo = new Google.InitializeOAuth(session);
var finalizeOAuthChoreo = new Google.FinalizeOAuth(session);

app.use(express.static('static'));

// app.get('/', funcion(req,res){
//   res.send('Hallo World');
// });

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http;//%s:%s', host, port);
});

//Client ID
var CLIENT_ID = "1017243933640-ut5gjuvpv7c0s82puu4sp6q19ln9snkd.apps.googleusercontent.com";
var CLIENT_SECRET = "CGv9OpKFhYWmg9-vxMH95Q0D";

// Instantiate and populate the input set for the choreo
var initializeOAuthInputs = initializeOAuthChoreo.newInputSet();
var finalizeOAuthInputs = finalizeOAuthChoreo.newInputSet();
var url;
var call_back_id;
var refresh_token;
var access_token;
var redirectUrl = "http://localhost:3000";
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

// Set inputs
initializeOAuthInputs.set_ForwardingURL("http://localhost:3000/oauthcallback");
initializeOAuthInputs.set_Scope("https://www.googleapis.com/auth/calendar");
initializeOAuthInputs.set_ClientID(CLIENT_ID);

// Run the choreo, specifying success and error callback handlers
initializeOAuthChoreo.execute(
    initializeOAuthInputs,
    function(results){
      //console.log(results.get_AuthorizationURL());
      url = results.get_AuthorizationURL();
      console.log(url);
      call_back_id = results.get_CallbackID();
      console.log(call_back_id);
      // Set inputs
      finalizeOAuthInputs.set_ClientID(CLIENT_ID);
      finalizeOAuthInputs.set_ClientSecret(CLIENT_SECRET);
      finalizeOAuthInputs.set_CallbackID(call_back_id);
    },

    function(error){console.log(error.type); console.log(error.message);}
);


app.get("/url", function(req, res){
  console.log('%s', url);
  res.send(url);
});


app.get("/tokens", function(req, res){
  var code = req.query.code;
  finalizeOAuthChoreo.execute(
      finalizeOAuthInputs,
      function(results){
        refresh_token = results.get_RefreshToken();
        access_token = results.get_AccessToken();
        console.log(refresh_token);
      },
      function(error){console.log(error.type); console.log(error.message);}
  );
});


app.get("/createEvent", function(req, res){

});
