const chai = require('chai');
const expect = chai.expect;
var should = require('chai').should()
var assert = require('chai').assert
const path = require('path');
const fs = require('fs');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var sandbox = sinon.createSandbox();

var srcJS = rewire("../src.js");

function globalPathFinder(listOfFoldersToGoThrough, nameOfFile) {
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
}


//


describe('select.js', () => {
    beforeEach(() => {
        srcJS = rewire("../src.js");
    });

    afterEach(() => {
        srcJS = rewire("../src.js");
    });

    context('textReplacer()', () => {
        beforeEach(() => {
            srcJS = rewire("../src.js");
        });

        afterEach(() => {
            srcJS = rewire("../src.js");
        });

        it('sends \'()\', expects undefined', () => {
            expect(srcJS.textReplacer()).to.be.undefined;
        });

        it('sends \'(\"\", {}, \"randomGmail@gmail.com\", \"currentDynamicLink.com\", \"main.js\", \"js\")\', expects \"\"', () => {
            expect(srcJS.textReplacer("", {}, "randomGmail@gmail.com", "currentDynamicLink.com", "main.js", "js")).to.equal("");
        });

        it('sends \'(\"\", {}, \"randomGmail@gmail.com\", \"currentDynamicLink.com\", \"main.js\", \"js\")\', expects \"\"', () => {
            expect(srcJS.textReplacer("@lang@nameOfTheAlbumForTheGallery@infoForTheIDOfTheArrayOfTheGallery@ketoGmailINFORMATION@dynamicLink@dynamicLink", {"page": "in_gallery", "lang": "eng", "nameOfAlbum": "randomAlbum", "albumID": "randomAlbumId"}, "randomGmail@gmail.com", "currentDynamicLink.com", "main.js", "js")).to.equal("");
        });
    });
});

/*

    context('theFunc()', () => {
        beforeEach(() => {
            srcJS = rewire("../src.js");
        });

        afterEach(() => {
            srcJS = rewire("../src.js");
        });

        it('sends __, but __, expects __', () => {
            //
        });
    });

*/
