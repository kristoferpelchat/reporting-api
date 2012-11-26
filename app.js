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

/**
 * Middleware
 */
app.use(express.bodyParser());
app.use(function(err, req, res, next) {
	console.error(err);
	console.error(err.stack);
	res.status(500);
	res.send(err.stack);
});

/**
 * Token verifcation functionality. The x-reportingapi-token HTTP header is sent
 * in and verified. The verification of the token consists of making sure it is the
 * token we have on file  (i.e. in token.txt). Resultant data is JSON sent back to
 * the client.
 */
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

/**
 * Token refresh consists of creating a new token all together. The current
 * token must be passed in as the HTTP header x-reportingapi-token. Once the 
 * token is verified a new one is created and passed back via JSON.
 */
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

/**
 * Return the supported locales. This simply sends back a JSON data object
 * created within the configuration.js. Currently only English is supported
 * for this application.
 */
app.get('/locales', function(req, res, next) {
	var token = req.headers['x-reportingapi-token'];
	console.log('avast-reporting-api x-reportingapi-token: ' + token);
	
	if (!tokenlib.validate(token)) {
		next(new Error('Token is invalid: ' + token));
	}
	
	res.send(config.locales);
});

/**
 * This is the main reporting entry point. The x-reportingapi-token HTTP
 * header must be passed in. In additon, the 'day' parameter must be passed
 * in. If it is not, we will take yesterdays date as the default. The 'locale'
 * parameter can be passed in but it is currently dropped on the floor.
 * 
 * This function simply grabs the file within the configured directory with the 
 * 'day' suffix. If the file is present, it is passed back...if not an error is 
 * thrown. The file is converted to JSON (with our csvtojson converter) before
 * it is passed back.
 */
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

/**
 * More Middleware
 */
if (!module.parent) {
	app.listen(3000);
	console.log('avast-reporting-api started on port 3000');
}