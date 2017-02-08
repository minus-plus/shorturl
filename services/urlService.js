var UrlModel = require('../model/urlModel');
var redis = require('redis');

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
	console.log(longUrl);
	if (longUrl.indexOf('http') === -1) {
		longUrl = 'http://' + longUrl;
	}
	redisClient.get(longUrl, function(err, shortUrl) {
		if(shortUrl) {
			console.log('Found longUrl : shortUrl in redis');
			callback({
				shortUrl: shortUrl,
				longUrl: longUrl
			});
		} else {
			UrlModel.findOne({longUrl: longUrl}, function(err, data){
				if (data) {
					console.log('Found longUrl : shortUrl in MongoDb');
					callback(data);
					redisClient.set(data.longUrl, data.shortUrl);
					redisClient.set(data.shortUrl, data.longUrl);
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
}

var getLongUrl = function(shortUrl, callback) {
	// 1. check if redis has this shortUrl
	redisClient.get(shortUrl, function(err, longUrl) {
		if (longUrl) {
			console.log('Found shortUrl : longUrl in redis');
			callback({
				shortUrl:shortUrl,
				longUrl: longUrl
			});
		} else {
			UrlModel.findOne({shortUrl: shortUrl}, function(err, data) {
				callback(data);
				redisClient.set({shortUrl, longUrl});
				redisClient.set(longUrl, shortUrl);
			}); 
		}
	});
}

module.exports = {
	getLongUrl: getLongUrl,
	getShortUrl: getShortUrl
};