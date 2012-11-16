/**
 * Constants relating to application conifiguration
 */
const absolutePathToCSVFile = '/Users/kristofer_pelchat/Development/github/avast-reporting-api/data/';
const encoding = 'utf8';
const responseContentType = 'application/json; charset=utf8';
const csvFileSuffix = 'Avast_Calls_Stats_';
const csvFilePostfix = '.csv';

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

module.exports = {
   absolutePathToCSVFile : absolutePathToCSVFile,
   encoding : encoding,
   responseContentType : responseContentType,
   locales : locales,
   csvFileSuffix : csvFileSuffix,
   csvFilePostfix : csvFilePostfix
};