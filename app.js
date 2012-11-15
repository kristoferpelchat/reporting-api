/**
 * Module dependencies.
 */

var express = require('express'), csvToJson = require('./csvtojson'), fs = require('fs'), path = require('path'), util = require('util');

var app = module.exports = express();

// middleware
app.use(express.bodyParser());

/**
 * These are all the supported locales for this system
 */
var locales = {
	"locales" : [{
		"locale" : "en-us",
		"language" : "English",
		"country" : "United States"
	}]
}

app.get('/locales', function(req, res, next) {
	res.send(locales);
});

app.get('/report', function(req, res, next) {
	var approot = __dirname;
	var filePath = path.join(approot, './data/', '20121108');
	
	var csvString = fs.readFileSync(filePath, "utf8");
	
	var jsonResult = csvToJson.csvToJson(csvString)

	res.contentType("application/json; charset=utf8");
    res.send(jsonResult);
});


if (!module.parent) {
	app.listen(3000);
	console.log('Express started on port 3000');
}