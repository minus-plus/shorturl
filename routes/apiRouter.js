var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var urlService = require('../services/urlService');
var statService = require('../services/statService');


router.post('/urls', jsonParser, function(req, res) {
	var longUrl = req.body.longUrl;
	urlService.getShortUrl(longUrl, function(shortUrl) {
		res.json(shortUrl);
	})
});

router.get('/urls/:shortUrl', function(req, res) {

	if (req.params) {
		var shortUrl = req.params.shortUrl;
		urlService.getLongUrl(shortUrl, function(urlData) {
			res.json(urlData);
		});
	} else {
		res.end('invalid shortUrl');
	}
	
});


router.get('/urls/:shortUrl/:info', function (req, res) {
	statService.getUrlInfo(req.params.shortUrl, req.params.info, function (data) {
		res.json(data);
	});
});


module.exports = router;