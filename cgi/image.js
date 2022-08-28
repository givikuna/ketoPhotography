const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

function globalPathFinder(listOfFoldersToGoThrough, nameOfFile) {
    try {
        var currentPath = "";
        for (var i = 0; i < listOfFoldersToGoThrough.length; i++) {
            var folderCurrentlyBeingSearchedFor = listOfFoldersToGoThrough[i];
            var pathToSearchTheExistanceOf = null;
            if (currentPath == "") {
                pathToSearchTheExistanceOf = "./" + folderCurrentlyBeingSearchedFor;
            } else {
                pathToSearchTheExistanceOf = currentPath + folderCurrentlyBeingSearchedFor;
            }
            if (fs.existsSync(pathToSearchTheExistanceOf)) {
                currentPath = currentPath + folderCurrentlyBeingSearchedFor + "/";
            } else {
                i = i - 1;
                currentPath = currentPath + "../";
            }
        }
        return path.join(currentPath, nameOfFile);
    } catch (error) {
        console.log("image.js globalPathFinder() ERROR: " + error);
        return "image.js globalPathFinder() ERROR: " + error;
    }
}

http.createServer(function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;
    } catch (error) {
        console.log("image.js ERROR: " + error);
    }
}).listen(8092);
console.log('Server running at http://127.0.0.1:8092/');