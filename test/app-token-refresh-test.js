var request = require('request'),
	vows = require('vows'),
	assert = require('assert'),
	config = require('../configuration'),
	fs = require('fs');

var tokenFromFile = fs.readFileSync(config.tokenTextFile, config.encoding);

vows.describe('/avast/testing/tokens/refresh').addBatch({
	"AVAST testing of token refresh": {
		"AVAST testing of token refresh": {
			"A GET to /tokens/refresh - positive1": {
				topic: function() {
					request({
						uri: 'http://localhost:3000/tokens/refresh',
						method: 'GET',
						//body : JSON.stringify({
						//	test : 'data'
						//}),
						headers: {
							//'Content-Type' : 'application/json',
							'x-reportingapi-token': tokenFromFile
						}
					}, this.callback);
				},
				"should respond with 201": function(err, res, body) {
					assert.equal(res.statusCode, 201);
				},
				"should respond with ok": function(err, res, body) {
					var result = JSON.parse(body);
					assert.equal(result.status, "ok");
				}
			},
			"A GET to /tokens/refresh - negative1": {
				topic: function() {
					request({
						uri: 'http://localhost:3000/tokens/refresh',
						method: 'GET',
						//body : JSON.stringify({
						//	test : 'data'
						//}),
						headers: {
							//'Content-Type' : 'application/json',
							'x-reportingapi-token': ''
						}
					}, this.callback);
				},
				"should respond with 401": function(err, res, body) {
					assert.equal(res.statusCode, 401);
				},
				"should respond with error": function(err, res, body) {
					var result = JSON.parse(body);
					assert.equal(result.status, "error");
				}
			}
		}
	}
}).export(module);