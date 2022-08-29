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
        console.log("index.js globalPathFinder() ERROR: " + error);
        return "index.js globalPathFinder() ERROR: " + error;
    }
}

if (!module.parent) {
    http.createServer(function (req, res) {
        try {
            var infoFromURL = url.parse(req.url, true).query;
            const pathToGmailInfo = globalPathFinder(["data", "contactGmail"], "data.txt");
            var ketoContactGmail1 = fs.readFileSync(pathToGmailInfo).toString();
            var ketoContactGmail = ketoContactGmail1.trim('\n');
            var fileName = infoFromURL.file;
            var srcLocation = "../www/" + infoFromURL.fileExtension + "/" + fileName;
            const currentDynLink = "http://127.0.0.1";

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });

            if (fs.existsSync(srcLocation)) {
                if (infoFromURL.file == "main.js") {
                    fs.readFile(srcLocation, 'utf-8', function (err, data) {
                        var dataToString = data.toString();
                        var replaced1 = dataToString.replace('@lang', infoFromURL.lang);
                        var replaced2 = replaced1.replace('@ketoGmailINFORMATION', ketoContactGmail);
                        var replaced = replaced2.replace(/@dynamicLink/g, currentDynLink);
                        if (infoFromURL.page == "in_gallery") {
                            replaced = replaced.replace(/@nameOfTheAlbumForTheGallery/g, infoFromURL.nameOfAlbum);
                            replaced = replaced.replace(/@infoForTheIDOfTheArrayOfTheGallery/g, infoFromURL.albumID);
                        }
                        res.write(replaced);
                        return res.end();
                    });
                } else {
                    fs.readFile(srcLocation, function (err, data) {
                        var dataToString = data.toString();
                        var replaced = dataToString.replace(/@dynamicLink/g, currentDynLink);
                        res.write(replaced);
                        return res.end();
                    });
                }
            } else {
                console.log('src.js ERROR: an error was detected in src.js. The file wasn\'t found');
                res.write("");
                return res.end();
            }
        } catch (error) {
            console.log("src.js ERROR" + error);
        }
    }).listen(8095);
    console.log('Server running at http://127.0.0.1:8095/');
}