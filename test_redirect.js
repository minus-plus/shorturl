var request = require('request');

// Set the headers
var headers = {
    "content-type": "application/json"
}

// Configure the request
var options1 = {
    url: 'http://127.0.0.1:4000/C',
    method: 'POST',
    headers: headers,
    json: {"longUrl": "http://www.google.com"}
}

// Start the request
request(options1, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body);
    } else {
    	console.log(error);
    }
});



// how write json to request body
/**
set headers.content-type as application/json
add json: rquest_data to request options
*/