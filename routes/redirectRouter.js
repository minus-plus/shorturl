var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statService = require('../services/statService');
var logger = require('../log');

router.get('*', function(req, res) {
	var shortUrl = req.originalUrl.slice(1);
	
	if (shortUrl !== 'favicon.ico') {
		//logger.debug('path /' + shortUrl + ' is captured by redirect router');
		urlService.getLongUrl(shortUrl, function(url) {
			if (url) {
				logger.debug('Redirect /' + shortUrl + ' to ' + url.longUrl);
				res.redirect(url.longUrl);
				statService.saveRequest(shortUrl, req);
			} else {
				res.end('404 NOT FOUND');
			}
		});
	}
	
});



module.exports = router;