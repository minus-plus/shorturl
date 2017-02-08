mongoose = require('mongoose');
mongoose.connect("mongodb://minus_plus:000000@ds145669.mlab.com:45669/shorturl");
var db = mongoose.connection;
var Schema = mongoose.Schema;

var UrlSchema = mongoose.Schema({
	shortUrl: String,
	longUrl: String
});

var UrlModel = mongoose.model('UrlModel', UrlSchema);
var google = new UrlModel({
	longUrl: 'http://www.goole.com',
	shortUrl: 'D'
});
google.save(function(err, result) {
	if (err) return console.log(err);
	console.log(result);
})