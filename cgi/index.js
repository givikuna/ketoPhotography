const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

const pathToGmailInfo = {
    arr: ["data", "contactGmail"],
    name: "data.txt"
};
// "../data/contactGmail.txt";

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
        return "";
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

function pageNullChecker(nameOfPage) {
    try {
        if (!nameOfPage || nameOfPage == "" || nameOfPage == '' || typeof nameOfPage !== 'string') {
            return "n";
        }
        return "y";
    } catch (error) {
        console.log("index.js pageNullChecker() ERROR: " + error);
        return "n";
    }
}

function errorTextFunc(sentLang, ketoGmail) {
    try {
        if (sentLang == "rus") {
            return "ОШИБКА: на веб-сайте в настоящее время возникают некоторые проблемы, повторите попытку позже или свяжитесь с нами по адресу: " + ketoGmail;
        } else if (sentLang == "geo") {
            return "შეცდომა: ვებსაიტს ამჟამად აქვს გარკვეული პრობლემები, სცადეთ მოგვიანებით ან დაგვიკავშირდით: " + ketoGmail;
        }
        return "ERROR: the website is currently experiencing some issues, try again later or contact us at: " + ketoGmail;
    } catch (error) {
        console.log("index.js errorTextFunc() ERROR: " + error);
        return "ERROR: the website is currently experiencing some issues, try again later";
    }
}

function languageChooser(langInfo) {
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
    } catch (error) {
        console.log("index.js languageChooser() ERROR: " + error);
        return "eng";
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
        console.log("index.js giveInformationAboutPage() ERROR: " + error);
        return "n";
    }
}

function replaceText(dataToString, infoFromURL, currentDynLink, ketoGmail) {
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
    } catch (error) {
        console.log("index.js replaceText() ERROR: " + error);
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

        function wrongPageErrorHTML() {
            console.log("The user is trying to enter a non-existant page.");
            res.send(errorTextFunc(languageChooser(infoFromURL.lang), ketoGmail));
            return res.end(); // if just using "return;" it'll keep going, with "res.end()" it won't. Just a little note
        }

        var htmFilePath = null;

        if (pageNullChecker(infoFromURL.page) == "n") {
            htmFilePath = globalPathFinder(["www", "main", "page"], "index.html");
        } else if (giveInformationAboutPage(infoFromURL.page) == "model") {
            htmFilePath = globalPathFinder(["www", "main", "page", "model"], giveInformationAboutPage(infoFromURL.page) + ".html");
        } else {
            htmFilePath = globalPathFinder(["www", "main", "page"], giveInformationAboutPage(infoFromURL.page) + ".html");
        }

        if (fileExistanceChecker(htmFilePath) == true) { //checking if the file exists
            fs.readFile(htmFilePath, 'utf-8', function (err, data) {
                var dataToString = data.toString();
                //changement of the code is finished
                res.write(replaceText(dataToString, infoFromURL, currentDynLink, ketoGmail));
                return res.end();
            });
        } else {
            wrongPageErrorHTML();
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
