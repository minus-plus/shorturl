var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statService = require('../services/statService');

router.get('*', function(req, res) {
	var shortUrl = req.originalUrl.slice(1);
	
	if (shortUrl !== 'favicon.ico') {
		console.log('path ' + shortUrl + ' is captured by redirect router');
		urlService.getLongUrl(shortUrl, function(url) {
			if (url) {
				console.log('shortUrl is ' + shortUrl);
				res.redirect(url.longUrl);
				statService.saveRequest(shortUrl, req);
			} else {
				res.end('404 NOT FOUND');
			}
		});
	}
	
});



module.exports = router;