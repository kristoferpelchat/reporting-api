var request = require('request'), vows = require('vows'), assert = require('assert'), config = require('../configuration'), fs = require('fs');

vows.describe('/avast/testing/locales').addBatch({
	"AVAST testing of locales" : {
		"AVAST testing of locales" : {
			"A GET to /locales - positive1" : {
				topic : function() {
					request({
						uri : 'http://localhost:3000/locales',
						method : 'GET',
						headers : {
							'x-reportingapi-token' : fs.readFileSync(config.tokenTextFile, config.encoding)
						}
					}, this.callback)
				},
				"should respond with 200" : function(err, res, body) {
					assert.equal(res.statusCode, 200);
				},
				"should respond with ok" : function(err, res, body) {
					var result = JSON.parse(body);
					assert.equal(result.locales[0].locale, "en-us");
					assert.equal(result.locales[0].language, "English");
					assert.equal(result.locales[0].country, "United States");
				}
			},
			"A GET to /locales - negative1" : {
				topic : function() {
					request({
						uri : 'http://localhost:3000/locales',
						method : 'GET',
						headers : {
							'x-reportingapi-token' : ''
						}
					}, this.callback)
				},
				"should respond with 500" : function(err, res, body) {
					assert.equal(res.statusCode, 500);
				}
			}
		}
	}
}).export(module);

vows.describe('/avast/testing/tokens/verify').addBatch({
	"AVAST testing of token verification" : {
		"AVAST testing of token verification" : {
			"A GET to /tokens/verify - positive1" : {
				topic : function() {
					request({
						uri : 'http://localhost:3000/tokens/verify',
						method : 'GET',
						//body : JSON.stringify({
						//	test : 'data'
						//}),
						headers : {
							//'Content-Type' : 'application/json',
							'x-reportingapi-token' : fs.readFileSync(config.tokenTextFile, config.encoding)
						}
					}, this.callback)
				},
				"should respond with 200" : function(err, res, body) {
					assert.equal(res.statusCode, 200);
				},
				"should respond with ok" : function(err, res, body) {
					var result = JSON.parse(body);
					assert.equal(result.status, "ok");
				}//,
				//"should respond with x-reportingapi-token" : function(err, res, body) {
				//	assert.include(res.headers, 'x-reportingapi-token');
				//}
			},
			"A GET to /tokens/verify - negative1" : {
				topic : function() {
					request({
						uri : 'http://localhost:3000/tokens/verify',
						method : 'GET',
						//body : JSON.stringify({
						//	test : 'data'
						//}),
						headers : {
							//'Content-Type' : 'application/json',
							'x-reportingapi-token' : ''
						}
					}, this.callback)
				},
				"should respond with 500" : function(err, res, body) {
					assert.equal(res.statusCode, 500);
				}
			}
		}
	}
}).export(module);

vows.describe('/avast/testing/report').addBatch({
	"AVAST testing of report" : {
		"AVAST testing of report" : {
			"A POST to report - positive1" : {
				topic : function() {
					request({
						uri : 'http://localhost:3000/report',
						method : 'POST',
						body : JSON.stringify({
							day : "2012-11-14"
						}),
						headers : {
							'Content-Type' : 'application/json',
							'x-reportingapi-token' : fs.readFileSync(config.tokenTextFile, config.encoding)
						}
					}, this.callback)
				},
				"should respond with 200" : function(err, res, body) {
					assert.equal(res.statusCode, 200);
				},
				"should respond with resultant data" : function(err, res, body) {
					var result = JSON.parse(body);
					assert.equal(result[0].Date, "2012-11-14");
					assert.equal(result[0]['Company Name'], "PlumChoice");
					assert.equal(result[0].Locale, "en-us");
					assert.equal(result[0].Offered, "452");
					assert.equal(result[0].Answered, "386");
					assert.equal(result[0]['Avg Time to Abandon'], "267");
					assert.equal(result[0].ASA, "86");
					assert.equal(result[0]['AHT Calls'], "904");
					assert.equal(result[0]['Max Delay'], "1829");
					assert.equal(result[0]['SL (120)'], "305");
					assert.equal(result[0]['Sales Calls'], "32");
					assert.equal(result[0]['Total Sales'], "0");
					assert.equal(result[0].Returns, "0");
					assert.equal(result[0]['Qualified Virus Removal'], "0");
					assert.equal(result[0]['Avast free user'], "0");
					assert.equal(result[0]['Avast paid user'], "0");
					assert.equal(result[0]['Not having avast license'], "215");
					assert.equal(result[0].NPS, ".5625");
					assert.equal(result[0].CSAT, ".8125");
				}
			},
			"A POST to report - negative1" : {
				topic : function() {
					request({
						uri : 'http://localhost:3000/report',
						method : 'POST',
						body : JSON.stringify({
							day : "2012-11-15"
						}),
						headers : {
							'Content-Type' : 'application/json',
							'x-reportingapi-token' : ''
						}
					}, this.callback)
				},
				"should respond with 500 - negative1" : function(err, res, body) {
					assert.equal(res.statusCode, 500);
				}
			},
			"A POST to report - negative2" : {
				topic : function() {
					request({
						uri : 'http://localhost:3000/report',
						method : 'POST',
						body : JSON.stringify({
							day : "2012-11-15"
						}),
						headers : {
							'Content-Type' : 'application/json',
							'x-reportingapi-token' : fs.readFileSync(config.tokenTextFile, config.encoding)
						}
					}, this.callback)
				},
				"should respond with 500 - negative2" : function(err, res, body) {
					assert.equal(res.statusCode, 500);
				}
			},
			"A POST to report - negative3" : {
				topic : function() {
					request({
						uri : 'http://localhost:3000/report',
						method : 'POST',
						body : JSON.stringify({
							locale : 'foo'
						}),
						headers : {
							'Content-Type' : 'application/json',
							'x-reportingapi-token' : fs.readFileSync(config.tokenTextFile, config.encoding)
						}
					}, this.callback)
				},
				"should respond with 500 - negative3" : function(err, res, body) {
					assert.equal(res.statusCode, 500);
				}
			}
		}
	}
}).export(module);
