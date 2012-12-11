/**
 * Constants relating to application conifiguration
 */
const absolutePathToCSVFile = __dirname.concat('/test/data/');
const encoding = 'utf8';
const responseContentType = 'application/json; charset=utf8';
const csvFileSuffix = 'Avast_Calls_Stats_';
const csvFilePostfix = '.csv';
const tokenCipherAlgorithm = 'aes-256-cbc';
const tokenCipherKey = 'InmbuvP6Z8';
const tokenCipherFormat = 'hex';
const tokenTextFile = __dirname.concat('/token.txt');
const dayDateFormat = 'YYYY-MM-DD';
const log4jsFileLocation = __dirname.concat('/logs/avast-reporting-api.log');
const log4jsLogLevel = 'DEBUG'; //TRACE, DEBUG, WARN, INFO, ERROR, FATAL
const appListenPort = 3000; 

/**
 * These are all the supported locales for this system
 */
var locales = {
	"locales": [{
		"locale": "en-us",
		"language": "US (English)",
		"country": "United States"
	}, {
		"locale": "es-us",
		"language": "US (Spanish)",
		"country": "United States"
	}, {
		"locale": "es-mx",
		"language": "Mexico",
		"country": "Mexico"
	}, {
		"locale": "es-es",
		"language": "Spain",
		"country": "Spain"
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
	log4jsLogLevel: log4jsLogLevel,
	appListenPort: appListenPort
};