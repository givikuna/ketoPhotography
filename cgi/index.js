const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

const fileName = "index.js";
var currentFunc = "";

const pathToGmailInfo = {
    arr: ["data", "contactGmail"],
    name: "data.txt"
}; // "../data/contactGmail.txt";

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

function fileExistanceChecker(pathToFile) {
    currentFunc = "fileExistanceChecker";
    try {
        if (fs.existsSync(pathToFile)) { //checking if the file exists
            return true;
        }
        return false;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return false;
    }
}

function pageNullChecker(nameOfPage) {
    currentFunc = "pageNullChecker";
    try {
        if (!nameOfPage || nameOfPage == "" || nameOfPage == '' || typeof nameOfPage !== 'string') {
            return "n";
        }
        return "y";
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return "n";
    }
}

function errorTextFunc(sentLang, ketoGmail) {
    currentFunc = "errorTextFunc";
    try {
        if (sentLang == "rus") {
            return "ОШИБКА: на веб-сайте в настоящее время возникают некоторые проблемы, повторите попытку позже или свяжитесь с нами по адресу: " + ketoGmail;
        } else if (sentLang == "geo") {
            return "შეცდომა: ვებსაიტს ამჟამად აქვს გარკვეული პრობლემები, სცადეთ მოგვიანებით ან დაგვიკავშირდით: " + ketoGmail;
        }
        return "ERROR: the website is currently experiencing some issues, try again later or contact us at: " + ketoGmail;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return "ERROR: the website is currently experiencing some issues, try again later";
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

function giveInformationAboutPage(pageName) {
    currentFunc = "giveInformationAboutPage";
    try {
        if (typeof pageName == 'string') {
            pageName = pageName.toLowerCase();
            if (pageName == "aboutme" || pageName == "in_gallery" || pageName == "album" || pageName == "contact" || pageName == "equipment" || pageName == "index" || pageName == "model" || pageName == "prices") {
                return pageName;
            }
        }
        return "n";
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return "n";
    }
}

function replaceText(dataToString, infoFromURL, currentDynLink, ketoGmail) {
    currentFunc = "replaceText";
    try {
        var pageName = "index";

        if (typeof dataToString == 'string') {
            if (infoFromURL !== null && infoFromURL !== [] && infoFromURL !== {} && infoFromURL !== undefined && typeof infoFromURL !== 'undefined' && typeof infoFromURL == 'object') {
                if ("page" in infoFromURL) {
                    pageName = giveInformationAboutPage(infoFromURL.page);
                }

                if (dataToString.includes("@lang")) {
                    var daLang = "eng";
                    if ("lang" in infoFromURL) {
                        daLang = languageChooser(infoFromURL.lang);
                    }
                    dataToString = dataToString.replace(/@lang/g, daLang);
                }

                if (dataToString.includes("@infoForTheIDOfTheArrayOfTheGallery")) {
                    if ("galleryID" in infoFromURL) {
                        dataToString = dataToString.replace(/@infoForTheIDOfTheArrayOfTheGallery/g, infoFromURL.galleryID);
                    }
                }
            } else {
                if (dataToString.includes("@lang")) {
                    dataToString = dataToString.replace(/@lang/g, "eng");
                }
            }

            if (dataToString.includes("@dynamicLink")) {
                if ((currentDynLink && currentDynLink !== "" && currentDynLink !== null && currentDynLink !== undefined && typeof currentDynLink !== 'number') || (currentDynLink !== "" && typeof currentDynLink == 'string')) {
                    dataToString = dataToString.replace(/@dynamicLink/g, currentDynLink);
                } else {
                    dataToString = dataToString.replace(/@dynamicLink/g, "ERROR");
                }
            }

            if (dataToString.includes("@infoForTheNameOfThisPage")) {
                dataToString = dataToString.replace(/@infoForTheNameOfThisPage/g, pageName);
            }
        }

        return dataToString;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return errorTextFunc("eng", ketoGmail);
    }
}

function wrongPageErrorHTML(infoFromURL) {
    currentFunc = "wrongPageErrorHTML";
    try {
        var filePath = globalPathFinder(["www", "main", "error", languageChooser(infoFromURL.lang)], "error.htm");

        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf-8', function (err, data) {
                return data.toString();
            });
        } else {
            return false;
        }
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return errorTextFunc("eng", ketoGmail);
    }
}

//

/* // */

//

app.get('/', function (req, res) {
    try {
        var ketoGmail;
        var ketoAddr = globalPathFinder(pathToGmailInfo.arr, pathToGmailInfo.name);
        if (fileExistanceChecker(ketoAddr) == true) {
            ketoGmail = fs.readFileSync(ketoAddr).toString();
        }
        const currentDynLink = "http://127.0.0.1";
        var infoFromURL = url.parse(req.url, true).query;

        var filePath = null;

        if (pageNullChecker(infoFromURL.page) == "n") {
            filePath = globalPathFinder(["www", "main", "page"], "index.html");
        } else if (giveInformationAboutPage(infoFromURL.page) == "model") {
            filePath = globalPathFinder(["www", "main", "page", "model"], giveInformationAboutPage(infoFromURL.page) + ".html");
        } else {
            filePath = globalPathFinder(["www", "main", "page"], giveInformationAboutPage(infoFromURL.page) + ".html");
        }

        if (fileExistanceChecker(filePath) == true) { //checking if the file exists
            fs.readFile(filePath, 'utf-8', function (err, data) {
                var dataToString = data.toString();
                //changement of the code is finished
                res.write(replaceText(dataToString, infoFromURL, currentDynLink, ketoGmail));
                return res.end();
            });
        } else {
            var filePath = globalPathFinder(["www", "main", "error", languageChooser(infoFromURL.lang)], "error.html");

            fs.readFile(filePath, 'utf-8', function (err, data) {
                var dataString = data.toString();
                if (typeof dataString == 'string' && dataString !== '' && dataString !== "") {
                    if (dataString.includes("@dynamicLink")) {
                        if ((currentDynLink && currentDynLink !== "" && currentDynLink !== null && currentDynLink !== undefined && typeof currentDynLink !== 'number') || (currentDynLink !== "" && typeof currentDynLink == 'string')) {
                            dataString = dataString.replace(/@dynamicLink/g, currentDynLink);
                            console.log(dataString);
                        } else {
                            dataString = dataString.replace(/@dynamicLink/g, "ERROR");
                        }
                    }
                }
                res.write(dataString);
                return res.end();
            });
        }
    } catch (error) {
        console.log("index.js ERROR: " + error);
    }

});
if (!module.parent) {
    app.listen(8091);
    console.log('Server running at http://127.0.0.1:8091/');
}

// If we're running under Node, 
if (typeof exports !== 'undefined') {
    exports.replaceText = replaceText;
    exports.giveInformationAboutPage = giveInformationAboutPage;
    exports.languageChooser = languageChooser;
    exports.errorTextFunc = errorTextFunc;
    exports.pageNullChecker = pageNullChecker;
    exports.fileExistanceChecker = fileExistanceChecker;
    exports.globalPathFinder = globalPathFinder;
    exports.wrongPageErrorHTML = wrongPageErrorHTML;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////// - OTHER COMMENTS;

/*

    try {
        //
    } catch (error) {
        console.log("index.js ERROR: " + error);
        return "index.js ERROR: " + error;
    }

*/
