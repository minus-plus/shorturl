var UrlModel = require('../model/urlModel');
var logger = require('../log');

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

    UrlModel.findOne({longUrl: longUrl}, function(err, data){
        if (data) {
            logger.debug('Found ' + data.longUrl + ': /' + data.shortUrl + ' in MongoDb');
            callback(data);
            var dataString = JSON.stringify(data);
            // redisClient.set(data.longUrl, dataString);
            // redisClient.set(data.shortUrl, dataString);
            logger.debug('Set ' + data.longUrl + ': /' + data.shortUrl + ' in redis');
        } else {
            generateShortUrl(function(shortUrl) {
                var data = new UrlModel({
                    longUrl: longUrl,
                    shortUrl: shortUrl
                });
                data.save();
                callback(data);
                var dataString = JSON.stringify(data);
                // redisClient.set(data.longUrl, dataString);
                // redisClient.set(data.shortUrl, dataString);
                logger.debug('Add ' + data.longUrl + ': /' + data.shortUrl + ' in MongoDb');
                logger.debug('Set ' + data.longUrl + ': /' + data.shortUrl + ' in redis');

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
    {
        UrlModel.findOne({shortUrl: shortUrl}, function(err, data) {
            logger.debug(data);
            if (data) {
                callback(data);
                logger.debug('Found /' + shortUrl + ': ' + data.longUrl + ' in MongoDb');
                var dataString = JSON.stringify(data);
                // redisClient.set(data.shortUrl, dataString);
                // redisClient.set(data.longUrl, dataString);
                logger.debug('Set /' + shortUrl + ': ' + data.longUrl + ' in redis');
            }

        });
    }


	// redisClient.get(shortUrl, function(err, urlString) {
     //    if (err) {
     //        logger.debug('Error when fetching data from redis');
     //    }
     //    var urlData = JSON.parse(urlString);
     //    console.log('..... redis', typeof urlData);
	// 	if (urlData) {
	// 		logger.debug('Found /' + shortUrl + ': ' + urlData.longUrl + ' in redis');
	// 		callback(urlData);
	// 	} else
	// });
};

module.exports = {
	getLongUrl: getLongUrl,
	getShortUrl: getShortUrl
};