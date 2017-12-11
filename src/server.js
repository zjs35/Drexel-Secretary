var express = require('express');
var google = require("googleapis");
var app = express();

app.use(express.static('static'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http;//%s:%s', host, port);
});

var OAuth2 = google.auth.OAuth2;
var CLIENT_ID = "1017243933640-jjlv02o5f6vrpfk0nal7lcjfnnpf1iro.apps.googleusercontent.com";
var CLIENT_SECRET = "THzl-FsbX4_7h_soOLpg3fJQ";
var REDIRECT_URL = "http://localhost:3000/ouathcallback";
var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/calendar'
];


var url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    scope: scopes
});

app.get("/url", function (req, res) {
    console.log('%s', url);
    res.send(url);
});


app.get("/ouathcallback", function (req, res) {
    console.log(req.query.code);
    oauth2Client.getToken(req.query.code, function(err, token) {
        if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
        }
        oauth2Client.credentials = token;
    });
    var html_str = `<script>window.opener.postMessage("ouathcaallback", "*");</script>`;
    res.send(html_str);
});


app.get("/createEvent", function (req, res) {
    var calendar = google.calendar('v3');
    var start_time = req.query.startDatetime;
    var endtime = req.query.endDatetime;
    var event = {
        'summary': req.query.title,//req.query.title
        //'location': 'My Office',
        'description': req.query.description,//req.query.description
        'start': {
            'dateTime': start_time,//req.query.startDatetime
            'timeZone': 'America/New_York'
        },
        'end': {
            'dateTime': endtime,//req.query.endDatetime
            'timeZone': 'America/New_York'
        },
        'attendees': [
            {'email': req.query.professorEmail}//req.query.professorEmail
        ],
        "transparency": "opaque",
        "visibility": "public"
    };

    calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        resource: event,
    }, function(err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            res.send('There was an error contacting the Calendar service: ' + err);
            return;
        }

        var msg = ('Event created<br> <a  href=\"' +  event.htmlLink + '\" >' + event.htmlLink + '</a> ');
        //var msg = `"<p>Event Created</p>"`;
        console.log(msg);
        res.send(msg);
    });

});


// gets the names of staff from database to display
app.get('/teacherselect', function (req,res){
	con.query('SELECT Name, email, CalendarId FROM staff WHERE staffid = "' + req.query.id + '";' , function(err,rows,fields){
		if(err){
			console.log('Error during query processing');
			console.log(err);
			res.send('Error during query processing');
		}
		else{
			var html = "";
			var name = rows[0].Name;
			var email = rows[0].email;
			var CalendarId = rows[0].CalendarId;
			
			console.log(rows);

			var html=	'<h2>'+ name +'\'s Office Hours!</h2>'
						+'<p>Email: '+ email +'</p>'
						+'<iframe src="https://calendar.google.com/calendar/embed?src=' + CalendarId + '%40group.calendar.google.com&ctz=America%2FNew_York"'
						+'style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'

						+'<form action="javascript:makeEvent()">'
							+'Request Meeting time (date and time):'
							+'<input type="datetime-local" name="eventStartDaytime">'
							+'<input type="submit" value="Send">'
						+'</form>';
			res.send(html);
			
		}
	})
});

// gets list of teachers for given department and job
app.get('/teacherlist', function (req,res){
	var request = "";
	//if department and position are not empty retreives the list of staff names and ids
	if(req.query.dept != ""){
		if(req.query.position != ""){
			request = 'SELECT Name, staffId FROM staff WHERE department = "' + req.query.dep + '" && Status = "'+ req.query.pos +'" ;';
		}
	}
		
	con.query(request , function(err,rows,fields){
		if(err){
			console.log('Error during query processing');
			console.log(err);
			res.send('Error during query processing');
		}
		else{
			//returns string with the options for the drop down list
			var html = "";
			console.log(rows);
			for(var i = 0; i <rows.length; i++){
				html +=	'<option value="'+ rows[i].staffId +'">'+ rows[i].Name +'</option>';
			}
			res.send(html);
		}
	})
});


