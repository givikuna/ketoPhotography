const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

http.createServer(function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;
    } catch (error) {
        console.log("image.js ERROR: " + error);
    }
}).listen(8092);
console.log('Server running at http://127.0.0.1:8092/');