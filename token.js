var crypto = require('crypto'),
	config = require('./configuration'),
	fs = require('fs'),
	log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file(config.log4jsFileLocation), 'avast-reporting-api');
var logger = log4js.getLogger('avast-reporting-api');
logger.setLevel(config.log4jsLogLevel);

/**
 * Publically facing method to validate the token passed in. Validation
 * consists of making certain the token is what we already have saved
 * off in token.txt.
 * 
 * @param {Object} token
 */
exports.validate = function(token) {
	var tokenFromFile = fs.readFileSync(config.tokenTextFile, config.encoding);
	logger.debug('avast-reporting-api tokenFromFile is: ' + tokenFromFile);

	if (token == tokenFromFile) {
		return true;
	}

	return false;
};

/**
 * Publically facing method to refresh/regenerate the token. A new token
 * is generated, passed back and written in token.txt.
 */
exports.refresh = function() {
	var newToken = createToken();
	fs.writeFileSync(config.tokenTextFile, newToken, config.encoding);
	logger.debug('avast-reporting-api tokenFromFile on refresh is: ' + newToken);

	return newToken;
};

/**
 * Private method to create the token from epoch.
 */
function createToken() {
	var epoch = new Date().getTime().toString();
	var cipher = crypto.createCipher(config.tokenCipherAlgorithm, config.tokenCipherKey);
	var crypted = cipher.update(epoch, config.encoding, config.tokenCipherFormat);
	crypted += cipher.final(config.tokenCipherFormat);
	logger.debug("crypted is: " + crypted);
	return crypted;
}

/**
 * Private method to decrypt the token passing back epoch.
 * 
 * @param {Object} token
 */
function decryptToken(token) {
	var decipher = crypto.createDecipher(config.tokenCipherAlgorithm, config.tokenCipherKey);
	var dec = decipher.update(token, config.tokenCipherFormat, config.encoding);
	dec += decipher.final(config.encoding);
	logger.debug("dec is: " + dec);
	return dec;
}