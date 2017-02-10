var redis = require('redis');
var client = redis.createClient();

client.flushdb( function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});