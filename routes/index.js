// routing handler for request of index.html
var express = require('express');
var router = express.Router();
var path = require('path');
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

router.get('/', function (req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../public/views/')})
});

module.exports = router;