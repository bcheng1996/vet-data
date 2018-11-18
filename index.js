var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var expstate = require('express-state');
var app = express();
var PORT = 3000;
var sys   = require('util');
var spawn = require('child_process').spawn;
var dummy  = spawn('python', ['generate_vet_data.py']);
var dataUtil = require('./data-util.js');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
expstate.extend(app);

app.set("state namespace", 'App');

var API_KEYS = {
	"GOOGLE_API_KEY": "102938120938123",
	"FACEBOOK_API_KEY": "12039812093",
}

app.expose(API_KEYS, "API_KEYS");

var vet_data = [];
var parsed_data = [];
dummy.stdout.on('data', function(data) {
    vet_data = JSON.parse(data.toString());
});


app.get("/", function(req, res) {
		parsed_data = dataUtil.parseData(vet_data);
		res.render('home', {data: parsed_data})
});


app.get("/chart/:school", function(req,res) {
	var school = req.params.school;
	console.log(school);
	var school_data = dataUtil.getSchoolData(parsed_data, school);
	res.render('chart', {data: school_data});

});

app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});
