var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var urlService = require('../services/urlService');
// routing of api/v1/
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

// get long url for short url
router.get('/urls/:shortUrl', function(req, res) {
	var shortUrl = res.params.shortUrl;
	urlService.getLongUrl(shortUrl, function(longUrl) {
		res.json(longUrl);
	});
});

module.exports = router;