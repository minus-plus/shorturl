var RequestModel = require('../model/requestModel');
var geoip = require('geoip-lite');

var saveRequest = function(shortUrl, req) {
	var ip = req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    var geo = geoip.lookup(ip);
    var country = geo ? geo.country : "Unkown";
	var requestInfo = {
		shortUrl: shortUrl,
		referer: req.headers.referer || 'Unkown',
		platform: req.useragent.platform || 'Unkown',
		browser: req.useragent.browser ||'Unkown',
		country: country,
		timestamp: new Date(),
	};
	var reqestData = new RequestModel(requestInfo);
	reqestData.save();
}

var getUrlInfo = function (shortUrl, info, callback) {
    if (info === "totalClicks") {
        RequestModel.count({ shortUrl: shortUrl}, function (err, data) {
            callback(data);
        });
        return;
    }

    var groupId = "";

    if (info === "hour") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"},
            hour: { $hour: "$timestamp"},
            minutes: { $minute: "$timestamp"}
        }
    } else if (info === "day") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"},
            hour: { $hour: "$timestamp"}
        }
    } else if (info === "month") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"}
        }
    } else {
        groupId = "$" + info;
    }

    RequestModel.aggregate([
        {
            $match: {
                shortUrl: shortUrl
            }
        },
        {
            $sort: {
                timestamp: -1
            }
        },
        {
            $group: {
                _id: groupId,
                count: {
                    $sum: 1
                }
            }
        }
    ], function (err, data) {
        callback(data);
    });
};

module.exports = {
    saveRequest: saveRequest,
    getUrlInfo: getUrlInfo
};