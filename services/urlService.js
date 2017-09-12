var UrlModel = require('../model/urlModel');
var redis = require('redis');
var logger = require('../log');
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);


var getCharArray = function() {
	var AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var az = 'abcdefghijklmnopqrstuvwxyz';
	var digits = '0123456789';
	var result = [];
	result = result.concat(AZ.split(''));
	result = result.concat(az.split(''));
	result = result.concat(digits.split(''));
	return result;
};
var encode = getCharArray();

var getShortUrl = function(longUrl, callback) {
	logger.debug(longUrl);
	if (longUrl.indexOf('http') === -1) {
		longUrl = 'http://' + longUrl;
	}
	redisClient.get(longUrl, function(err, shortUrl) {
        if (err) {
            logger.debug('Error when fetching data from redis');
        }
		if(shortUrl) {
			logger.debug('Found ' + longUrl + ': /' + shortUrl + ' in redis');
            console.log('........................', "2");
			callback({
				shortUrl: shortUrl,
				longUrl: longUrl
			});
		} else {
			UrlModel.findOne({longUrl: longUrl}, function(err, data){
				if (data) {
					logger.debug('Found ' + data.longUrl + ': /' + data.shortUrl + ' in MongoDb');
					callback(data);
					redisClient.set(data.longUrl, data.shortUrl);
					redisClient.set(data.shortUrl, data.longUrl);
					logger.debug('Set ' + data.longUrl + ': /' + data.shortUrl + ' in redis');
				} else {
					generateShortUrl(function(shortUrl) {
						var data = new UrlModel({
							longUrl: longUrl,
							shortUrl: shortUrl
						});
						data.save();
						callback(data);
						redisClient.set(data.longUrl, data.shortUrl);
						redisClient.set(data.shortUrl, data.longUrl);
						logger.debug('Add ' + data.longUrl + ': /' + data.shortUrl + ' in MongoDb');
						logger.debug('Set ' + data.longUrl + ': /' + data.shortUrl + ' in redis');

					});
				}
			});
		}
	});

};

var generateShortUrl = function(callback) {
	UrlModel.count({}, function(err, number) {
		var shortUrl = convertTo62(number);
		callback(shortUrl);
	});
};

var convertTo62 = function(number) {
	var result = '';
	do {
		result = encode[number % 62] + result;
		number = Math.floor(number / 62);
	} while (number);
	return result;
};

var getLongUrl = function(shortUrl, callback) {
	// 1. check if redis has this shortUrl
	redisClient.get(shortUrl, function(err, longUrl) {
        if (err) {
            logger.debug('Error when fetching data from redis');
        }
		if (longUrl) {
			logger.debug('Found /' + shortUrl + ': ' + longUrl + ' in redis');
			callback({
				shortUrl:shortUrl,
				longUrl: longUrl
			});
		} else {
			UrlModel.findOne({shortUrl: shortUrl}, function(err, data) {
				
				logger.debug(data);
				if (data) {
					callback(data);
					logger.debug('Found /' + shortUrl + ': ' + longUrl + ' in MongoDb');
					redisClient.set(data.shortUrl, data.longUrl);
					redisClient.set(data.longUrl, data.shortUrl);
					logger.debug('Set /' + shortUrl + ': ' + longUrl + ' in redis');
				}
				
			}); 
		}
	});
};

module.exports = {
	getLongUrl: getLongUrl,
	getShortUrl: getShortUrl
};