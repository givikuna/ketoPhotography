const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const fileName = "src.js";
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

function languageChooser(langInfo) {
    currentFunc = "languageChooser";
    try {
        if (langInfo == null || langInfo == undefined || langInfo == "" || !langInfo || typeof langInfo == "number") {
            return "eng";
        } else {
            langInfo = langInfo.toLowerCase();
            if (langInfo == "rus" || langInfo == "russian" || langInfo == "ruso" || langInfo == "rusia" || langInfo == "ruski" || langInfo == "rusian" || langInfo == "ru" || langInfo == "rusuli" || langInfo == "russ" || langInfo == "russian language") {
                return "rus";
            } else if (langInfo == "geo" || langInfo == "qartuli nana" || langInfo == "cartuli nana" || langInfo == "kartuli nana" || langInfo == "kartluli" || langInfo == "kartvelian language" || langInfo == "kartuli ena" || langInfo == "deda ena" || langInfo == "qartuli ena" || langInfo == "cartuli ena" || langInfo == "geouri" || langInfo == "gurjistani" || langInfo == "georgiani" || langInfo == "qartveli" || langInfo == "georgianuri" || langInfo == "gurjistan" || langInfo == "georgian" || langInfo == "kartveli" || langInfo == "kutaisuri" || langInfo == "kartuli" || langInfo == "ქართული" || langInfo == "ka" || langInfo == "kar" || langInfo == "cartuli" || langInfo == "cartveluri" || langInfo == "cartvelian" || langInfo == "qartveluri" || langInfo == "qartvelian" || langInfo == "kartvellian" || langInfo == "kartvelian" || langInfo == "qartuli" || langInfo == "gorgian" || langInfo == "ge") {
                return "geo";
            } else {
                return "eng";
            }
        }
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return "eng";
    }
}

function textReplacer(dataToString, infoFromURL, ketoContactGmail, currentDynLink, fileName, theFileExtension) {
    currentFunc = "textReplacer";
    try {
        if (theFileExtension == "js") {
            if (fileName == "main.js") {
                if (typeof dataToString == 'string') {
                    if (infoFromURL !== null && infoFromURL !== undefined && infoFromURL !== {} && infoFromURL !== [] && typeof infoFromURL !== 'string' && typeof infoFromURL !== 'number') {
                        if (dataToString.includes("@lang")) {
                            if ("lang" in infoFromURL) {
                                dataToString = dataToString.replace(/@lang/g, languageChooser(infoFromURL.lang));
                            }
                        }

                        if ("page" in infoFromURL) {
                            if (infoFromURL.page == "in_gallery") {
                                if ("nameOfAlbum" in infoFromURL) {
                                    if (dataToString.includes("@nameOfTheAlbumForTheGallery")) {
                                        dataToString = dataToString.replace(/@nameOfTheAlbumForTheGallery/g, infoFromURL.nameOfAlbum);
                                    }
                                }
                                if ("albumID" in infoFromURL) {
                                    if (dataToString.includes("@infoForTheIDOfTheArrayOfTheGallery")) {
                                        dataToString = dataToString.replace(/@infoForTheIDOfTheArrayOfTheGallery/g, infoFromURL.albumID);
                                    }
                                }
                            }
                        }
                    }

                    if (dataToString.includes("@ketoGmailINFORMATION")) {
                        if (ketoContactGmail !== null && ketoContactGmail !== undefined && typeof ketoContactGmail == 'string' && ketoContactGmail.includes(".") && ketoContactGmail.includes("@")) {
                            dataToString = dataToString.replace(/@ketoGmailINFORMATION/g, ketoContactGmail);
                        }
                    }

                    if (dataToString.includes("@dynamicLink")) {
                        if (currentDynLink !== undefined && currentDynLink !== null && typeof currentDynLink == 'string' && currentDynLink.includes(".")) {
                            dataToString = dataToString.replace(/@dynamicLink/g, currentDynLink);
                        }
                    }
                }
            }
        } else if (theFileExtension == "css") {
            if (fileName == "main.css" || fileName == "aboutme.css") {
                if (typeof dataToString == 'string') {
                    if (dataToString.includes("@dynamicLink")) {
                        if (currentDynLink !== undefined && currentDynLink !== null && typeof currentDynLink == 'string' && currentDynLink.includes(".")) {
                            dataToString = dataToString.replace(/@dynamicLink/g, currentDynLink);
                        }
                    }
                }
            }
        }

        return dataToString;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
    }
}

function infoFromURLChecker(infoFromURL, requestedFile) {
    currentFunc = "infoFromURLChecker";
    try {
        if (typeof infoFromURL !== 'string' && typeof infoFromURL !== 'number' && infoFromURL !== {} && infoFromURL !== [] && infoFromURL !== null && infoFromURL !== undefined) {
            if (!infoFromURL) { } else {
                if ("file" in infoFromURL) {
                    if (infoFromURL.file == requestedFile) {
                        return true;
                    }
                }
            }
        }
        return false;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
    }
}

if (!module.parent) {
    http.createServer(function (req, res) {
        try {
            var infoFromURL = url.parse(req.url, true).query;
            var ketoContactGmail, fileName, srcLocation, theFileExtension;
            const currentDynLink = "http://127.0.0.1";

            ketoContactGmail = fs.readFileSync(globalPathFinder(["data", "contactGmail"], "data.txt")).toString();
            if (typeof ketoContactGmail == 'string') {
                if (ketoContactGmail.includes('\n')) {
                    ketoContactGmail = ketoContactGmail.trim('\n');
                }
            }

            if (!infoFromURL) { } else {
                if (infoFromURL !== null && infoFromURL !== undefined && infoFromURL !== {} && infoFromURL !== []) {
                    if (typeof infoFromURL !== 'string' && typeof infoFromURL !== 'number') {
                        var ifFileNameWasGivenChecker = false;
                        var ifFileExtensionGivenChecker = false;
                        if ("file" in infoFromURL) {
                            fileName = infoFromURL.file;
                            ifFileNameWasGivenChecker = true;
                        }

                        if ("fileExtension" in infoFromURL && ifFileNameWasGivenChecker == true) {
                            theFileExtension = infoFromURL.fileExtension;
                            ifFileExtensionGivenChecker = true;
                        }

                        if (ifFileNameWasGivenChecker == true && ifFileExtensionGivenChecker == true) {
                            srcLocation = "../www/" + theFileExtension + "/" + fileName;
                        }
                    }
                }
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });

            if (fs.existsSync(srcLocation)) {
                if (infoFromURLChecker(infoFromURL, fileName) == true) {
                    fs.readFile(srcLocation, 'utf-8', function (err, data) {
                        const replacedText = textReplacer(data.toString(), infoFromURL, ketoContactGmail, currentDynLink, fileName, theFileExtension);
                        res.write(replacedText);
                        return res.end();
                    });
                }
            } else {
                console.log('src.js ERROR: an error was detected in src.js. The file \'' + srcLocation + '\' wasn\'t found');
                res.write("");
                return res.end();
            }
        } catch (error) {
            console.log("src.js ERROR " + error);
        }
    }).listen(8095);
    console.log('Server running at http://127.0.0.1:8095/');
}

if (typeof exports !== 'undefined') {
    exports.infoFromURLChecker = infoFromURLChecker;
    exports.textReplacer = textReplacer;
    exports.languageChooser = languageChooser;
}
