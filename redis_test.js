var redis = require('redis');
var client = redis.createClient();
client.set('thing','value',function(err) {
  client.quit();
});
client.get('thing', function(err, result) {
	console.log(result);
})