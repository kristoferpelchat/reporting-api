/**
 * Constants relating to application conifiguration
 */
const absolutePathToCSVFile = '/Users/kristofer_pelchat/Development/github/avast-reporting-api/test/data/';
const encoding = 'utf8';
const responseContentType = 'application/json; charset=utf8';
const csvFileSuffix = 'Avast_Calls_Stats_';
const csvFilePostfix = '.csv';
const tokenCipherAlgorithm = 'aes-256-cbc';
const tokenCipherKey = 'InmbuvP6Z8';
const tokenCipherFormat = 'hex';
const tokenTextFile = './token.txt';
const dayDateFormat = 'YYYY-MM-DD';
const log4jsFileLocation = 'logs/avast-reporting-api.log';
const log4jsLogLevel = 'DEBUG'; //TRACE, DEBUG, WARN, INFO, ERROR, FATAL

/**
 * These are all the supported locales for this system
 */
var locales = {
	"locales": [{
		"locale": "en-us",
		"language": "English",
		"country": "United States"
	}]
}

module.exports = {
	absolutePathToCSVFile: absolutePathToCSVFile,
	encoding: encoding,
	responseContentType: responseContentType,
	locales: locales,
	csvFileSuffix: csvFileSuffix,
	csvFilePostfix: csvFilePostfix,
	tokenCipherAlgorithm: tokenCipherAlgorithm,
	tokenCipherKey: tokenCipherKey,
	tokenCipherFormat: tokenCipherFormat,
	tokenTextFile: tokenTextFile,
	dayDateFormat: dayDateFormat,
	log4jsFileLocation: log4jsFileLocation,
	log4jsLogLevel: log4jsLogLevel
};