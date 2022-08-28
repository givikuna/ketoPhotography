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
        if (fs.existsSync(pathToFile)) {
            return true;
        }
        return false;
    } catch (error) {
        console.log("index.js fileExistanceChecker() ERROR: " + error);
        return false;
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

function errorTextFunc(sentLang, ketoGmail) {
    try {
        if (sentLang == "rus") {
            return "ОШИБКА: веб-сайт в настоящее время не работает, повторите попытку позже или свяжитесь с нами по адресу: " + ketoGmail;
        } else if (sentLang == "geo") {
            return "შეცდომა: ვებგვერდი ამჟამად გათიშულია, სცადეთ მოგვიანებით ან დაგვიკავშირდით მისამართზე: " + ketoGmail;
        }
        return "ERROR: the website is currently down, try again later or contact us at: " + ketoGmail;
    } catch (error) {
        console.log("index.js errorTextFunc() ERROR: " + error);
        return "ERROR: the website is currently down, try again later";
    }
}

app.get('/', function (req, res) {
    try {
        var infoFromURL = url.parse(req.url, true).query;
        var htmFilePath = null;

        function wrongPageErrorHTML() {
            console.log("The user is trying to enter a non-existant page.");
            res.send(errorTextFunc(languageChooser(infoFromURL.lang), fs.readFileSync(pathToGmailInfo).toString()));
            return res.end(); // if just using "return;" it'll keep going, with "res.end()" it won't. Just a little note
        }

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
            wrongPageErrorHTML();
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