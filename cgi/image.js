const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const fileName = "image.js";
var currentFunc = "";

function errorHelper(functionName, error, otherInfo) {
    currentFunc = "errorHelper";
    try {
        var errorMessage = "";
        var typeofFunctionName = typeof functionName;
        if (typeof functionName == 'string' && functionName !== "" && functionName !== '') {
            console.log(fileName + " " + functionName + "() ERROR: " + error);
            if (functionName == "imgExistanceChecker") {
                errorMessage = "the path to the image has not been found. A non-existent path was requested or \n" + 
                + "the file exists and the imgExistanceChecker() function failed in finding it due to an unkown reason \n" +
                + "likely due to the \"fs\" library having some sort of an error with existsSync() \n" +
                + "another likely scenario is that globalPathFinder has made a mistake, requiring a fix.";
            } else if (functionName == "globalPathFinder") {
                errorMessage = "the solutions and explanations for the error: \n" + 
                + "1. the requested file doesn't exist, hence globalPathFinder() was unable to find it." +
                + "2. the information regarding the request was made in a wrong manner" +
                + "3. if the error as described in the first portion of this error text told you that it is about the name not being a string, then that's it";

                var errorHelper_listOfFoldersToGoThrough = "";
                for (var i = 0; i <= otherInfo[0].length; i++) {
                    if (typeof otherInfo[0][i] == 'string') {
                        errorHelper_listOfFoldersToGoThrough = errorHelper_listOfFoldersToGoThrough + otherInfo[0][i];
                    } else {
                        errorHelper();
                        return new Error();
                    }
                }
            } else if (functionName == "checkTheType") {
                //
            } else {
                //
            }
        } else {
            errorMessage = "the variable called \'functionName\' is not a string, but it must be a string to run. It was requested as a " + typeofFunctionName + " type variable; containing: " + functionName;
            return new Error(errorMessage);
        }
        if (errorMessage == "") {
            errorMessage = "errorMessage is equal to \"\", meaning that the function that had an error either doesn\'t exist or is not covered in errorHelper(). The requested function was: " + typeofFunctionName + " type variable and contained: " + functionName;
            return new Error(errorMessage);
        }
        console.log("possible ERROR explanation: " + errorMessage);
    }
    catch (e2) {
        console.log(fileName + " errorHelper() ERROR: " + e2);
    }
}

function imgExistanceChecker(imgPath) {
    currentFunc = "imgExistanceChecker";
    try {
        if (fs.existsSync(imgPath)) {
            return true;
        }
        return false;
    } catch (error) {
        errorHelper(currentFunc, error, null);
        return false;
    }
}

function globalPathFinder(listOfFoldersToGoThrough, nameOfFile) {
    currentFunc = "globalPathFinder";
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
        } else {
            typeofnameOfFile = typeof nameOfFile;
            return new Error('the name of the requested file isn\'t a string, rather ' + typeofnameOfFile + ' / მოთხოვნილი ფაილის სახელი არ არის სტრინგის ფორმატში, არამედ: ' + typeofnameOfFile);
        }
    } catch (error) {
        var otherInfo = [listOfFoldersToGoThrough, nameOfFile];
        errorHelper(currentFunc, error, otherInfo);
        return "";
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
    } catch (error) {
        console.log("image.js checkTheType() ERROR: " + error);
        console.log("the requested file is unkown by the program, likely doesn't require any fixing.");
        errorHelper(currentFunc, error, null);
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
