var winston = require('winston');
var console_level = 'debug';
var file_level = 'info';
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: console_level, json: false, timestamp: true }),
    new winston.transports.File({ level: file_level, filename: __dirname + '/logs/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ level: console_level, json: false, timestamp: true }),
    new winston.transports.File({level: file_level, filename: __dirname + '/logs/exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports = logger;