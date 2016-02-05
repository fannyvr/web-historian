var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var archive = require('../helpers/archive-helpers');

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize();

var port = 8080;
var ip = "127.0.0.1";

var server = http.createServer(handler.handleRequest);

	// var parts = urlParse.parse(request.url);

	// if ()
	// response.writeHead(200, {'Content-Type': 'text/html'})
	// response.end()
	// console.log('hi')
	// console.log(request);
	// console.log(response);

	

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log("Listening on http://" + ip + ":" + port);
}



/*

router - 
	- will take in url, 
		-if url is in list
			if url has been archived
				-retrieve archived page
				-send user to archived page
			else if url has not been archived
				-send user to loading page until requested page is loaded
		-if url is not in list
			-add url to list of pages to be archived
			-send user to loading page until requested page is archived

*/