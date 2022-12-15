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
        var arr = fs.readFileSync(givenLoc, 'utf8');
        return arr;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return [];
    }
}

function getArr(arr, name) {
    currentFunc = "getArr";
    try {
        const chosenPath = globalPathFinder(arr, name);
        const parsedFile = JSON.parse(readArrayFile(chosenPath));
        return parsedFile;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return [];
    }
}

function getLang(lang) {
    currentFunc = "getLang";
    try {
        if (lang == null || lang == undefined || lang == "" || !lang || typeof lang == "number") {
            return "en";
        } else {
            lang = lang.toLowerCase();
            if (lang == "rus" || lang == "russian" || lang == "ruso" || lang == "rusia" || lang == "ruski" || lang == "rusian" || lang == "ru" || lang == "rusuli" || lang == "russ" || lang == "russian language") {
                return "ru";
            } else if (lang == "geo" || lang == "qartuli nana" || lang == "cartuli nana" || lang == "kartuli nana" || lang == "kartluli" || lang == "kartvelian language" || lang == "kartuli ena" || lang == "deda ena" || lang == "qartuli ena" || lang == "cartuli ena" || lang == "geouri" || lang == "gurjistani" || lang == "georgiani" || lang == "qartveli" || lang == "georgianuri" || lang == "gurjistan" || lang == "georgian" || lang == "kartveli" || lang == "kutaisuri" || lang == "kartuli" || lang == "ქართული" || lang == "ka" || lang == "kar" || lang == "cartuli" || lang == "cartveluri" || lang == "cartvelian" || lang == "qartveluri" || lang == "qartvelian" || lang == "kartvellian" || lang == "kartvelian" || lang == "qartuli" || lang == "gorgian" || lang == "ge") {
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

function getData(arr, mString) {
    currentFunc = "getData";
    try {
        return fs.readFileSync(globalPathFinder(arr, mString));
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

            const about_keto_data = ifAboutMePageChanger(infoFromURL);

            var selectReqResVar;

            if (about_keto_data != false) {
                selectReqResVar = about_keto_data;
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
