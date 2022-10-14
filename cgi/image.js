const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const fileName = "image.js";
var currentFunc = "";

function globalPathFinder(folderList, requestedFile) {
    currentFunc = "globalPathFinder";
    try {
        var count = 0;
        var folderPath = "";
        if (folderList !== [] || folderList !== {} || typeof folderList == 'object') {
            for (var i = 0; i < folderList.length; i++) {
                if (typeof folderList[i] == 'string') {
                    var currentFolder = folderList[i];
                    var pathKeeper = null;
                    if (folderPath == "") {
                        pathKeeper = "./" + currentFolder;
                    } else {
                        pathKeeper = folderPath + currentFolder;
                    }
                    if (fs.existsSync(pathKeeper)) {
                        folderPath = folderPath + currentFolder + "/";
                    } else {
                        i = i - 1;
                        folderPath = folderPath + "../";
                    }
                }
                count = count + 1;
                if (count == 100) {
                    return "";
                }
            }
        }
        if (typeof requestedFile == 'string') {
            return path.join(folderPath, requestedFile);
        }
        return "";
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return "";
    }
}

function imgExistanceChecker(imgPath) {
    currentFunc = "imgExistanceChecker";
    try {
        if (fs.existsSync(imgPath)) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return false;
    }
}

function checkTheType(infoFromURL, imageLocation) {
    currentFunc = "checkTheType";
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
                    if ("requestedImage" in infoFromURL && "albumName" in infoFromURL) {
                        imageLocation = globalPathFinder([infoFromURL.type, "albums", infoFromURL.albumName], infoFromURL.requestedImage);
                    }
                } else if (infoFromURL.type == "ketoPics") {
                    if ("img" in infoFromURL) {
                        imageLocation = globalPathFinder(["www", "img", "onPage", infoFromURL.type], infoFromURL.img);
                    }
                }
            }
        }
        return imageLocation;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
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
