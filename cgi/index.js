const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

const pathToGmailInfo = {
    "arr": ["data", "contactGmail"],
    "name": "data.txt"
};

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
        console.log("index.js ERROR: " + error);
        return "index.js ERROR: " + error;
    }
}

function giveInformationAboutPage(pageName) {
    try {
        if (typeof pageName == 'string') {
            pageName = pageName.toLowerCase();
            if (pageName == "aboutme" || pageName == "in_gallery" || pageName == "album" || pageName == "contact" || pageName == "equipment" || pageName == "index" || pageName == "model" || pageName == "prices") {
                return pageName;
            }
        }
        return "n";
    } catch (error) {
        console.log("index.js ERROR: " + error);
        return "index.js ERROR: " + error;
    }
}

function pageNullChecker(nameOfPage) {
    try {
        console.log("------------");
        if (!nameOfPage || nameOfPage == "" || nameOfPage == '' || typeof nameOfPage !== 'string') {
            return "n";
        }
        return "y";
    } catch (error) {
        console.log("index.js ERROR: " + error);
        return "n";
    }
}

function fileExistanceChecker(pathToFile) {
    try {
        if (fs.existsSync(pathToFile)) { //checking if the file exists
            return true;
        }
        return false;
    } catch (error) {
        console.log("index.js fileExistanceChecker() ERROR: " + error);
        return false;
    }
}

app.get('/', function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;
        var htmFilePath = null;

        if (pageNullChecker(infoFromURL.page) == "n") {
            htmFilePath = globalPathFinder(["www", "main"], "index.htm");
        } else {
            htmFilePath = globalPathFinder(["www", "main"], giveInformationAboutPage(infoFromURL.page) + ".htm");
        }

        if (fileExistanceChecker(htmFilePath) == true) { //checking if the file exists
            fs.readFile(htmFilePath, 'utf-8', function (err, data) {
                var dataToString = data.toString();
                res.write(dataToString);
                return res.end();
            });
        } else {
            // wrongPageErrorHTML();
        }
    } catch (error) {
        console.log("index.js ERROR: " + error);
    }
});
app.listen(8091);
console.log('Server running at http://127.0.0.1:8091/');

/*

    try {
        //
    } catch (error) {
        console.log("index.js ERROR: " + error);
        return "index.js ERROR: " + error;
    }

*/