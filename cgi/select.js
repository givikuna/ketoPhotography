const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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
        console.log("select.js globalPathFinder() function ERROR: " + error);
        return "select.js globalPathFinder() function ERROR: " + error;
    }
}

function getArr(theArr, theName) {
    return JSON.parse(fs.readFileSync(globalPathFinder(theArr, theName)).toString());
}

function selectReqRes() {
    try {
        var locArr = getArr(["data", "array_information"], "arraysFromCGI.json");
        var mainArr = null;

        for (let i = 0; i < locArr.length; i++) {
            var tempArr = getArr(locArr[i].location, locArr[i].name);
            if (mainArr == null) {
                mainArr = tempArr;
            } else {
                mainArr = JSON.stringify(mainArr) + "," + JSON.stringify(tempArr);
            }

        }
        mainArr = "[" + mainArr + "]";

        return mainArr;
    } catch (error) {
        console.log("select.js selectReqRes() function ERROR: " + error);
        return "select.js selectReqRes() function ERROR: " + error;
    }
}

if (!module.parent) {
    http.createServer(function (req, res) {
        try {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });

            res.write(selectReqRes().toString());
            return res.end();
        } catch (error) {
            console.log("select.js ERROR: " + error);
        }
    }).listen(8093);
    console.log('Server running at http://127.0.0.1:8093/');
}