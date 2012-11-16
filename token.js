var crypto = require('crypto'),
	config = require('./configuration'),
	fs = require('fs');

exports.validate = function(token) {
	var tokenFromFile = fs.readFileSync(config.tokenTextFile, config.encoding);
	console.log('avast-reporting-api tokenFromFile is: ' + tokenFromFile);
	
	if (token == tokenFromFile) {
		return true;
	}
	
	return false;
}

exports.refresh = function() {
	var newToken = createToken();
	fs.writeFileSync(config.tokenTextFile, newToken, config.encoding);
	console.log('avast-reporting-api tokenFromFile on refresh is: ' + newToken);
	
	return newToken;
}

function createToken() {
	var epoch = new Date().getTime().toString();
	var cipher = crypto.createCipher(config.tokenCipherAlgorithm, config.tokenCipherKey);
	var crypted = cipher.update(epoch, config.encoding, config.tokenCipherFormat);
	crypted += cipher.final(config.tokenCipherFormat);
	console.log("crypted is: " + crypted);
	return crypted;
}

function decryptToken(token) {
	var decipher = crypto.createDecipher(config.tokenCipherAlgorithm, config.tokenCipherKey);
	var dec = decipher.update(crypted, config.tokenCipherFormat, config.encoding);
	dec += decipher.final(config.encoding);
	console.log("dec is: " + dec);
	return dec;
}
