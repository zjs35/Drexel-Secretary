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

//Any other URL request will redirect to the main page
app.get('*',function (req, res) {
	res.redirect('./index.html');
});

//Have the server listen to port 8080
app.listen(8080,function(){
	console.log('Server Running');
});
