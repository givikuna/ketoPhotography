const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const fileName = "select.js";
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

function readArrayFile(givenLoc) {
    currentFunc = "readArrayFile";
    try {
        var theArr = fs.readFileSync(givenLoc, 'utf8');
        return theArr;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return [];
    }
}

function getArr(theArr, theName) {
    currentFunc = "getArr";
    try {
        const chosenPath = globalPathFinder(theArr, theName);
        const parsedFile = JSON.parse(readArrayFile(chosenPath));
        return parsedFile;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return [];
    }
}

function getLang(langInfo) {
    currentFunc = "getLang";
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
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return "en";
    }
}

function selectReqRes() {
    currentFunc = "selectReqRes";
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
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return [];
    }
}

function getData(givenArr, givenString) {
    currentFunc = "getData";
    try {
        return fs.readFileSync(globalPathFinder(givenArr, givenString));
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return "";
    }
}

function ifAboutMePageChanger(infoFromURL) {
    currentFunc = "ifAboutMePageChanger";
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
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
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
