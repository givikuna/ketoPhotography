const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const fileName = "image.js"; // clarifies the name of the file
var currentFunc = ""; // clarifies what function the server is working on at the time

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

/*
    Checks if a file exists

    if it exists returns true
    if it doesn't exist returns false

    * @param imgPath - represents the location for the file
*/
function ifExists(imgPath) {
    currentFunc = "ifExists";
    try {
        if (fs.existsSync(imgPath)) {
            return true;
        }
        return false;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return false;
    }
}

/*
    Gets the location of the image

    * @param infoFromURL - the information image.js recieved from the URL
*/
function getLoc(infoFromURL) {
    var imgLoc;
    currentFunc = "getLoc";
    try {
        /*
            the following if condition checks if infoFromURL is empty or not, and if it is the right type of information
        */
        if (infoFromURL !== null && infoFromURL !== undefined && infoFromURL !== {} & infoFromURL !== [] && typeof infoFromURL !== 'string' && typeof infoFromURL !== 'number') {
            /*
                the following if condition checks if there is a paramter for "type" in infoFromURL
            */
            if ("type" in infoFromURL) {
                /*
                    The following set of if statements check to see what type of an image the site is asking for.

                    type 1: icon:
                        If the site requests an icon:
                            getLoc() checks if there is an "img" parameter in infoFromURL
                            getLoc() is to go into www/img/icons/ to find the requested image
                    type 2: cover:
                        If the site requests a cover:
                            getLoc() is to go into www/img/ongPage to find the requested image
                    type 3: albumCover:
                        If the site requests an albumCover:
                            getLoc() is to check if "coverImg" is a parameter in infoFromURL or not
                            getLoc() is to go into www/img/onPage/albumCovers to find the requested image
                    type 4: ketoPics
                        If the site requests ketoPics:
                            getLoc() is to check if there is an "img" paramter in infoFromURL
                            getLoc() is to go into www/img/onPage to find the requested image
                */
                if (infoFromURL.type == "icon") {
                    if ("img" in infoFromURL) {
                        imgLoc = globalPathFinder(["www", "img", "icons"], infoFromURL.img);
                    }
                } else if (infoFromURL.type == "cover") {
                    imgLoc = globalPathFinder(["www", "img", "onPage", infoFromURL.type], "cover.jpg");
                } else if (infoFromURL.type == "albumCover") {
                    if ("coverImg" in infoFromURL) {
                        imgLoc = globalPathFinder(["www", "img", "onPage", "albumCovers"], infoFromURL.coverImg);
                    }
                } else if (infoFromURL.type == "img") {
                    if ("requestedImage" in infoFromURL && "albumName" in infoFromURL) {
                        imgLoc = globalPathFinder([infoFromURL.type, "albums", infoFromURL.albumName], infoFromURL.requestedImage);
                    }
                } else if (infoFromURL.type == "ketoPics") {
                    if ("img" in infoFromURL) {
                        imgLoc = globalPathFinder(["www", "img", "onPage", infoFromURL.type], infoFromURL.img);
                    }
                }
            }
        }
        return imgLoc;
    } catch (e) {
        console.log(fileName + " " + currentFunc + "() ERROR: " + e);
        return imgLoc;
    }
}

if (!module.parent) {
    http.createServer(function (req, res) {
        try {
            var infoFromURL = url.parse(req.url, true).query; // takes the information from the URL
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
            var imgLoc; // will have the information regarding the location of the image

            /*
                Is to send an image to the designated location/

                * @param imgLoc - represents the location of the image
                with ifExists(imgLoc), it checks whether an image exists at the said location
                then reads the file (the image), and prints it.

                If it does not exist, it just writes "", and ends it.
            */
            function sendImg(imgLoc) {
                if (ifExists(imgLoc)) {
                    fs.readFile(imgLoc, function (err, data) {
                        res.write(data);
                        return res.end();
                    });
                } else {
                    res.write("");
                    return res.end(imgLoc);
                }
            }

            imgLoc = getLoc(infoFromURL); // gets the location of the image
            sendImg(imgLoc); // sends the image
        } catch (error) {
            console.log("image.js ERROR: " + error);
        }
    }).listen(8092);
    console.log('Server running at http://127.0.0.1:8092/');
}

// If we're running under Node, 
if (typeof exports !== 'undefined') {
    exports.globalPathFinder = globalPathFinder;
    exports.ifExists = ifExists;
    exports.getLoc = getLoc;
}
