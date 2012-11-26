/**
 * Module dependencies.
 */
var express = require('express'), 
	csvToJson = require('./csvtojson'), 
	fs = require('fs'), 
	path = require('path'), 
	util = require('util'), 
	config = require('./configuration'),
	tokenlib = require('./token');

var app = module.exports = express();

// middleware
app.use(express.bodyParser());
app.use(function(err, req, res, next) {
	console.error(err);
	console.error(err.stack);
	res.status(500);
	res.send(err.stack);
});

app.get('/tokens/verify', function(req, res, next) {
	var token = req.headers['x-reportingapi-token'];
	console.log('avast-reporting-api x-reportingapi-token: ' + token);
	
	if (!tokenlib.validate(token)) {
		next(new Error('Token is invalid: ' + token));
	}
	
	var result = {
		"status" : "ok"
	}
	
	res.send(result);
});

app.get('/tokens/refresh', function(req, res, next) {
	var token = req.headers['x-reportingapi-token'];
	console.log('avast-reporting-api x-reportingapi-token: ' + token);
	
	if (!tokenlib.validate(token)) {
		next(new Error('Token is invalid: ' + token));
	}
	
	var newToken = tokenlib.refresh();
	var result = {
		"status" : "ok",
		"token" : newToken
	}
	
	res.send(result);
});

app.get('/locales', function(req, res, next) {
	var token = req.headers['x-reportingapi-token'];
	console.log('avast-reporting-api x-reportingapi-token: ' + token);
	
	if (!tokenlib.validate(token)) {
		next(new Error('Token is invalid: ' + token));
	}
	
	res.send(config.locales);
});

app.post('/report', function(req, res, next) {
	var body = req.body;
	var token = req.headers['x-reportingapi-token'];
	console.log("avast-reporting-api request body data: " + body);
	console.log('avast-reporting-api x-reportingapi-token: ' + token);
	
	if (!tokenlib.validate(token)) {
		next(new Error('Token is invalid: ' + token));
	}

	var day = req.body.day;
	
	if (day == null) {
		next(new Error('day parameter in POST is not present'));
	} else {
		var filePath = path.join(config.absolutePathToCSVFile, config.csvFileSuffix + day + config.csvFilePostfix);
		
		if (filePath == null) {
			next(new Error('CSV file could not be found'));
		}
		
		var csvString = fs.readFileSync(filePath, config.encoding);
		
		var jsonResult = csvToJson.csvToJson(csvString)
	
		res.contentType(config.responseContentType);
	    res.send(jsonResult);
	}
});

if (!module.parent) {
	app.listen(3000);
	console.log('avast-reporting-api started on port 3000');
}