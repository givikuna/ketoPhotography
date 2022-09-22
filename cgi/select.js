const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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
                    return new Error('select.js globalPathFinder() ERROR: ' + e);
                }
            }
        }
        if (typeof nameOfFile == 'string') {
            return path.join(currentPath, nameOfFile);
        }
    } catch (error) {
        console.log("select.js globalPathFinder() function ERROR: " + error);
        return [];
    }
}

function readArrayFile(givenLoc) {
    try {
        var theArr = fs.readFileSync(givenLoc, 'utf8');
        return theArr;
    } catch (error) {
        console.log("select.js readArrayFile() function ERROR: " + error);
        return [];
    }
}

function getArr(theArr, theName) {
    try {
        const chosenPath = globalPathFinder(theArr, theName);
        const parsedFile = JSON.parse(readArrayFile(chosenPath));
        return parsedFile;
    } catch (error) {
        console.log("select.js getArr() function ERROR: " + error);
        return [];
    }
}

function getLang(langInfo) {
    try {
        if (langInfo == null || langInfo == undefined || langInfo == "" || !langInfo || typeof langInfo == "number") {
            return "en";
        } else {
            langInfo = langInfo.toLowerCase();
            if (langInfo == "rus" || langInfo == "russian" || langInfo == "ruso" || langInfo == "rusia" || langInfo == "ruski" || langInfo == "rusian" || langInfo == "ru" || langInfo == "rusuli" || langInfo == "russ" || langInfo == "russian language") {
                return "ru";
            } else if (langInfo == "geo" || langInfo == "qartuli nana" || langInfo == "cartuli nana" || langInfo == "kartuli nana" || langInfo == "kartluli" || langInfo == "kartvelian language" || langInfo == "kartuli ena" || langInfo == "deda ena" || langInfo == "qartuli ena" || langInfo == "cartuli ena" || langInfo == "geouri" || langInfo == "gurjistani" || langInfo == "georgiani" || langInfo == "qartveli" || langInfo == "georgianuri" || langInfo == "gurjistan" || langInfo == "georgian" || langInfo == "kartveli" || langInfo == "kutaisuri" || langInfo == "kartuli" || langInfo == "ქართული" || langInfo == "ka" || langInfo == "kar" || langInfo == "cartuli" || langInfo == "cartveluri" || langInfo == "cartvelian" || langInfo == "qartveluri" || langInfo == "qartvelian" || langInfo == "kartvellian" || langInfo == "kartvelian" || langInfo == "qartuli" || langInfo == "gorgian" || langInfo == "ge") {
                return "ge";
            } else {
                return "en";
            }
        }
    } catch (error) {
        console.log("select.js getLang() function ERROR: " + error);
        return "en";
    }
}

function selectReqRes() {
    try {
        var locArr = getArr(["data", "array_information"], "data.json");
        var fullArr = [];
        var mainArr = null;

        if (locArr !== undefined && locArr !== null && typeof locArr !== 'string' && typeof locArr !== 'number') {
            if ("location" in locArr[0] && "name" in locArr[0]) {
                for (let i = 0; i < locArr.length; i++) {
                    var tempArr = getArr(locArr[i].location, locArr[i].name);
                    fullArr.push(tempArr);
                }
                fullArr = JSON.stringify(fullArr);
            }
        }
        return fullArr;
    } catch (error) {
        console.log("select.js selectReqRes() function ERROR: " + error);
        return [];
    }
}

function getData(givenArr, givenString) {
    try {
        return fs.readFileSync(globalPathFinder(givenArr, givenString));
    } catch (error) {
        console.log("select.js getData() function ERROR: " + error);
        return "";
    }
}

function ifAboutMePageChanger(infoFromURL) {
    try {
        if (infoFromURL !== null && infoFromURL !== [] && infoFromURL !== {} && infoFromURL !== undefined && typeof infoFromURL !== 'undefined' && typeof infoFromURL == 'object') {
            if ("page" in infoFromURL) {
                if (infoFromURL.page == "aboutme") {
                    if ("lang" in infoFromURL) {
                        const gottenLang = getLang(infoFromURL.lang);
                        return getData(["data", "about_keto", gottenLang], "data.txt");
                    }
                }
            }
        }
        return false;
    } catch {
        console.log("select.js ifAboutMePageChanger() function ERROR: " + error);
        return [];
    }
}

if (!module.parent) {
    http.createServer(function (req, res) {
        try {
            var infoFromURL = url.parse(req.url, true).query;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });

            const ifAboutMePageChangerVar = ifAboutMePageChanger(infoFromURL);

            var selectReqResVar

            if (ifAboutMePageChangerVar !== false) {
                selectReqResVar = ifAboutMePageChangerVar;
            } else {
                selectReqResVar = selectReqRes().toString();
            }

            res.write(selectReqResVar);
            return res.end();
        } catch (error) {
            console.log("select.js ERROR: " + error);
        }
    }).listen(8093);
    console.log('Server running at http://127.0.0.1:8093/');
}

// If we're running under Node, 
if (typeof exports !== 'undefined') {
    exports.selectReqRes = selectReqRes;
    exports.readArrayFile = readArrayFile;
    exports.globalPathFinder = globalPathFinder;
    exports.getArr = getArr;
    exports.ifAboutMePageChanger = ifAboutMePageChanger;
    exports.getLang = getLang;
    exports.getData = getData;
}
