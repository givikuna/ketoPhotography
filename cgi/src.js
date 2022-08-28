const http = require('http');
const fs = require('fs');
const url = require('url');

if (!module.parent) {
	http.createServer(function (req, res) {
        //
	}).listen(8095);
	console.log('Server running at http://127.0.0.1:8095/');
}