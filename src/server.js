var express = require('express');
var google = require("googleapis");
var app = express();
var mysql = require('mysql');

app.use(express.static('static'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http;//%s:%s', host, port);
});

var con = mysql.createConnection({
		// host: 'localhost',
		// user: 'Suarez914',
		// password: 'Suarez914',
		// database: 'STAFFINFO'

    host: '127.0.0.1',
    user: 'root',
    // password: '0000',
    // database: 'DB'
    password: 'woody2999*',
    database: 'staffinfo'

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
// gets the names of staff from database to display
app.get('/teacherselect', function (req,res){
    con.query('SELECT Name, email, CalendarId FROM staff WHERE staffid = "' + req.query.id + '";' , function(err,rows){
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
            var html =`     
                        <h2>`+ name +`'s Office Hours!</h2>
                        <p1 >Email: </p1>
                        <p id="email">`+ email +`</p>
                        <iframe src="https://calendar.google.com/calendar/embed?src=`+ CalendarId +`%40group.calendar.google.com&ctz=America%2FNew_York"
                            style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
                        <div id="form" class="mui-form">
                            <form action="javascript:sendEvent()">
                                <!--Name: <input type="text" name="stuedntname" required>-->
                                Event Title: <input type="text" name="title" required>
                                Event Description: <input type="text" name="description" required>
                                Start Time: <input type="datetime-local" name="startTime" required>
                                Duration: <select name="duration" id="duration">
                                <option value=30>30 Min</option>
                                <option value=60>1 Hr</option>
                            </select>
                                <button type="submit" class="like" name="foo" value="bar">Make Appointment</button>
                            </form>
                        </div>`;

            console.log(html);
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
			request = 'SELECT Name, staffId FROM staff WHERE department = "' + req.query.dept + '" && Status = "'+ req.query.position +'" ;';
		}
	}
		
	con.query(request , function(err,rows,fields){
		if(err){
			console.log('Error during query processing');
			console.log(err);
			res.send('Error during query processing');
		}
		else{
			console.log(rows);
			res.send(rows);
		}
	})
});


