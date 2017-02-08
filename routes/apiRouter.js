var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var urlService = require('../services/urlService');
var statService = require('../services/statService');
// routing of api/v1/urls/, deal with post request of client
router.get('/urls',  function(req, res) {
	console.log(req);
	res.end('api/v1/urls handler works');
});
router.post('/urls', jsonParser, function(req, res) {
	var longUrl = req.body.longUrl;
	// call urlService 
	urlService.getShortUrl(longUrl, function(shortUrl) {
		res.json(shortUrl);
	})
});

// routing of /api/v1/urls/:shortUrl, find longUrl of shortUrl
router.get('/urls/:shortUrl', function(req, res) {
	console.log(req.params);
	if (req.params) {
		var shortUrl = req.params.shortUrl;
		console.log('shortUrl is ' + shortUrl);
		urlService.getLongUrl(shortUrl, function(longUrl) {
			res.json(longUrl);
		});
	} else {
		res.end('invalid shortUrl');
	}
	
});
// routing of /api/v1/urls/:shortUrl/:info, retrive the information of shortUrl
router.get('urls/:shortUrl/:info', function (req, res) {
	statService.getUrlInfo(req.params.shortUrl, req.params.info, function (data) {
		// if got data, send it to client
		res.json(data);
	});
});
module.exports = router;