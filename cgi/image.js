const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

function imgExistanceChecker(imgPath) { //TESTED VIA tests/image.test.js
    try {
        if (fs.existsSync(imgPath)) {
            return true;
        }
        return false;
    } catch (error) {
        console.log("image.js imgExistanceChecker() ERROR: " + error);
        return false;
    }
}

function globalPathFinder(listOfFoldersToGoThrough, nameOfFile) {
    try {
        var trueCount = 0;
        var currentPath = "";
        if (listOfFoldersToGoThrough !== [] || listOfFoldersToGoThrough !== {} || typeof listOfFoldersToGoThrough == 'object') {
            for (var i = 0; i < listOfFoldersToGoThrough.length; i++) {
                if (typeof listOfFoldersToGoThrough[i] == 'string') {
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
                trueCount = trueCount + 1;
                if (trueCount == 100) {
                    const e = "the function of globalPathFinder() in the file has been running on repeat over 100 times, this is not supposed to do this. Hence the loop is ot be turned off";
                    return new Error('image.js globalPathFinder() ERROR: ' + e);
                }
            }
        }
        if (typeof nameOfFile == 'string') {
            return path.join(currentPath, nameOfFile);
        }
    } catch (error) {
        console.log("image.js globalPathFinder() ERROR: " + error);
        return "";
    }
}

function checkTheType(infoFromURL, imageLocation) {
    try {
        if (infoFromURL !== null && infoFromURL !== undefined && infoFromURL !== {} & infoFromURL !== [] && typeof infoFromURL !== 'string' && typeof infoFromURL !== 'number') {
            if ("type" in infoFromURL) {
                if (infoFromURL.type == "icon") {
                    if ("img" in infoFromURL) {
                        imageLocation = globalPathFinder(["www", "img", "icons"], infoFromURL.img);
                    }
                } else if (infoFromURL.type == "cover") {
                    imageLocation = globalPathFinder(["www", "img", "onPage", infoFromURL.type], "cover.jpg");
                } else if (infoFromURL.type == "albumCover") {
                    if ("coverImg" in infoFromURL) {
                        imageLocation = globalPathFinder(["www", "img", "onPage", "albumCovers"], infoFromURL.coverImg);
                    }
                } else if (infoFromURL.type == "img") {
                    if ("requestedImage" in infoFromURL) {
                        if ("albumName" in infoFromURL) {
                            imageLocation = globalPathFinder([infoFromURL.type, "albums", infoFromURL.albumName], infoFromURL.requestedImage);
                        }
                    }
                } else if (infoFromURL.type == "ketoPics") {
                    if ("img" in infoFromURL) {
                        imageLocation = globalPathFinder(["www", "img", "onPage", infoFromURL.type], infoFromURL.img);
                    }
                }
            }
        }
        return imageLocation;
    } catch (error) {
        console.log("image.js checkTheType() ERROR: " + error);
        return imageLocation;
    }
}

if (!module.parent) {
    http.createServer(function (req, res) {
        try {
            var infoFromURL = url.parse(req.url, true).query;
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
            var imageLocation;

            function sendImage(imageLocation) {
                if (imgExistanceChecker(imageLocation) == true) {
                    fs.readFile(imageLocation, function (err, data) {
                        res.write(data);
                        return res.end();
                    });
                } else {
                    res.write("");
                    return res.end(imageLocation);
                }
            }

            imageLocation = checkTheType(infoFromURL, imageLocation);
            sendImage(imageLocation);
        } catch (error) {
            console.log("image.js ERROR: " + error);
        }
    }).listen(8092);
    console.log('Server running at http://127.0.0.1:8092/');
}

// If we're running under Node, 
if (typeof exports !== 'undefined') {
    exports.globalPathFinder = globalPathFinder;
    exports.imgExistanceChecker = imgExistanceChecker;
    exports.checkTheType = checkTheType;
}
