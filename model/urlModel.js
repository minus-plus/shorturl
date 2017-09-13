var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
	shortUrl: String,
	longUrl: String,
	create_at: {type: Date, default: Date.now}
});

var urlModel = mongoose.model('UrlModel', UrlSchema);

module.exports = urlModel;