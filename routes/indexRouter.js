// routing handler for request of index.html
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require('../log');

router.get('/', function (req, res) {
	logger.debug('GET index.html');
  	res.sendFile('index.html', {root: path.join(__dirname, '../public/views/')})
});

module.exports = router;