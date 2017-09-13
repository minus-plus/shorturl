var express = require('express');
var app = express();
var path = require('path');
var indexRouter = require('./routes/indexRouter');
var apiRouter = require('./routes/apiRouter');
var redirectRouter = require('./routes/redirectRouter');
var mongoose = require('mongoose');
var useragent = require('express-useragent');

// connect to mongoose
mongoose.connect("mongodb://minus_plus:000000@ds145669.mlab.com:45669/shorturl");

// access local path
app.use('/public', express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use(useragent.express());

app.use('/api/v1', apiRouter);
app.use('/', indexRouter);
app.use('/:shorturl', redirectRouter);

const port = process.env.PORT || 4000;
app.listen(port, function() {
	console.log('Listening on port', port);
});
