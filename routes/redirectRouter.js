var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statService = require('../services/statService');

router.get('/', function(req, res) {
	console.log('captured by redirect router');
	var shortUrl = req.originalUrl.slice(1);
	urlService.getLongUrl(shortUrl, function(url) {
		if (url) {
			res.redirect(url.longUrl);
			statService.saveRequest(shortUrl, req);
		} else {
			res.end('404 NOT FOUND');
		}
	})
});



module.exports = router;