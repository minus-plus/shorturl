var express = require('express');
var app = express();
var path = require('path');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/apiRouter');
var mongoose = require('mongoose');

mongoose.connect("mongodb://minus_plus:000000@ds145669.mlab.com:45669/shorturl");


// connect to mongoose

// access local path
app.use('/public', express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use('/', indexRouter);
app.use('/api/v1', apiRouter);
app.listen(4000, function() {
	console.log('Listening on port 4000');
})
