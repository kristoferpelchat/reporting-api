/**
 * This Javascript file will handle conversion from CSV to JSON
 */
var config = require('./configuration'),
	log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file(config.log4jsFileLocation), 'avast-reporting-api');
var logger = log4js.getLogger('avast-reporting-api');
logger.setLevel(config.log4jsLogLevel);

/**
 * Private function to simply log a message to STDOUT or STDERR
 * 
 * @param {Object} message
 * @param {Object} errorlogger.debug
 */
function setMessage(message, error) {
	if (error) {
		logger.error("csvtojson ERROR: " + message);
	} else {
		if (message.trim() != '') {
			logger.debug("csvtojson: " + message);
		}
	}
}

/**
 * Proviate method to parse the CSV line itself
 * 
 * @param {Object} line
 */
function parseCSVLine(line) {
	line = line.split(',');

	// check for splits performed inside quoted strings and correct if needed
	for (var i = 0; i < line.length; i++) {
		var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
		var quote = "";
		if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
		if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";

		if (quote != "") {
			var j = i + 1;

			if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");

			while (j < line.length && chunk.charAt(chunk.length - 1) != quote) {
				line[i] += ',' + line[j];
				line.splice(j, 1);
				chunk = line[j].replace(/[\s]*$/g, "");
			}

			if (j < line.length) {
				line[i] += ',' + line[j];
				line.splice(j, 1);
			}
		}
	}

	for (var i = 0; i < line.length; i++) {
		// remove leading/trailing whitespace
		line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");

		// remove leading/trailing quotes
		if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
		else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
	}

	return line;
}

/**
 * This is the publically facing method to convert the CSV
 * text passed in. Result will be the JSON version of this.
 * If there are multiple records, each record is an object
 * in the JSON passed back.
 * @param {Object} csvText
 */
exports.csvToJson = function(csvText) {
	var message = "";
	var error = false;
	var jsonText = "";

	if (csvText == "") {
		error = true;
		message = "No CSV data present";
	}

	if (!error) {
		var csvRows = csvText.split(/[\r\n]/g);
		// split into rows

		// get rid of empty rows
		for (var i = 0; i < csvRows.length; i++) {
			if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "") {
				csvRows.splice(i, 1);
				i--;
			}
		}

		if (csvRows.length < 2) {
			error = true;
			message = "The CSV text MUST have a header row!";
		} else {
			var objArr = [];

			for (var i = 0; i < csvRows.length; i++) {
				csvRows[i] = parseCSVLine(csvRows[i]);
			}

			for (var i = 1; i < csvRows.length; i++) {
				if (csvRows[i].length > 0) objArr.push({});

				for (var j = 0; j < csvRows[i].length; j++) {
					objArr[i - 1][csvRows[0][j]] = csvRows[i][j];
				}
			}

			jsonText = JSON.stringify(objArr, null, "\t");
		}
	}

	setMessage(message, error);

	return jsonText;
};