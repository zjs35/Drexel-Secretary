//Using express to simplify handling of different client reqs
var express = require('express');
var app = express();
var fs = require('file-system');
//Use body parser for easier handling of post reqs
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//refer to local dir, change if moving this script to another dir
app.use(express.static('.'));
//Create an instance of a mysql connection
var mysql = require('mysql');

var con = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '0000',
	database: 'DB'
});
con.connect(function(err){
	if(err){
		console.log('Error connecting to database');
		console.log(err);
	}
	else{
		console.log('Successfully connected to database');
	}
});

//send html for office hours display page
app.get('/officeHourFinder', function (req,res){
	//query db for student info
	con.query('SELECT FIRST_NAME, LAST_NAME FROM PROFESSOR ORDER BY LAST_NAME;', function(err,rows,fields){
		if(err){
			console.log('Error during professor query processing');
			console.log(err);
			res.send('Error during professor query processing');
		}
		else{
			//start contructing html to be sent to client
			var html_str = `
				<h2>Select a Professor or TA</h2>
				<select id="p_opts">`;
			//populate drop-down with Professor info
			for(i=0; i<rows.length; i++){
				html_str += '<option value="' + rows[i].PROFESSOR_ID + '">' + rows[i].LAST_NAME + ', ' + rows[i].FIRST_NAME + '</option>';
			}
			html_str += '</select>';

			res.send(html_str););
		}
	});
});

//query db for requested table and send formatted html table back to client
app.get('/getOfficeHour', function (req,res){
	//get table name from json in url data
	var lastN = req.query.LAST_NAME;
	var firstN = req.query.FIRST_NAME;
	console.log('Processing request for PROFESSOR');
	con.query('SELECT OFFICE_HOURS FROM DB.PROFESSOR WHERE LAST_NAME = '+ lastN + ' AND FIRST_NAME = ' + firstN + ';' , function(err,rows,fields){
		if(err){
			console.log('Error during query processing');
			console.log(err);
			res.send('Error during query processing');
		}
		else{
			//contruct html to be sent to client
			var html_str = '<table border="1"><tr>';
			//process column headers
			var headers = [];
			for(i=0; i<fields.length; i++){
				headers.push(fields[i].name);
				html_str += '<th>' + fields[i].name + '</th>';
			}
			html_str += '</tr>';
			//process row values
			for(i=0; i<rows.length; i++){
				html_str += '<tr>';
				for(j=0; j<headers.length; j++){
					html_str += '<td>' + rows[i][headers[j]] + '</td>';
				}
				html_str += '</tr>';
			}
			html_str += '</table>'
			console.log('Sending officeHour');
			res.send(html_str);
		}
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

//Any other URL request will redirect to the main pages
app.get('*',function (req, res) {
	res.redirect('./index.html');
});



//Have the server listen to port 8080
app.listen(8080,function(){
	console.log('Server Running');
});
