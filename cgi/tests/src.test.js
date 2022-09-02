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
        var lStub;

        beforeEach(() => {
            lStub = sinon.stub(srcJS, "languageChooser").returns("eng");

            srcJS = rewire("../src.js");
        });

        afterEach(() => {
            lStub.restore();

            srcJS = rewire("../src.js");
        });

        it('sends \'()\', expects undefined', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer()).to.be.undefined;
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"\", {}, \"randomGmail@gmail.com\", \"currentDynamicLink.com\", \"main.js\", \"js\")\', expects \"\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("", {}, "randomGmail@gmail.com", "currentDynamicLink.com", "main.js", "js")).to.equal("");
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"@lang@nameOfTheAlbumForTheGallery@infoForTheIDOfTheArrayOfTheGallery@ketoGmailINFORMATION@dynamicLink@dynamicLink\", {\"page\": \"in_gallery\", \"lang\": \"eng\", \"nameOfAlbum\": \"randomAlbum\",  \"albumID\": \"randomAlbumId\"}, \"randomGmail@gmail.com\", \"currentDynamicLink.com\", \"main.js\", \"js\"}, \"randomGmail@gmail.com\", \"currentDynamicLink.com\", \"main.js\", \"js\")\', expects \"engrandomAlbumrandomAlbumIdrandomGmail@gmail.comcurrentDynamicLink.comcurrentDynamicLink.com\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("@lang@nameOfTheAlbumForTheGallery@infoForTheIDOfTheArrayOfTheGallery@ketoGmailINFORMATION@dynamicLink@dynamicLink",
                {
                    "page": "in_gallery",
                    "lang": "eng",
                    "nameOfAlbum": "randomAlbum",
                    "albumID": "randomAlbumId"
                }, "randomGmail@gmail.com", "currentDynamicLink.com", "main.js", "js")).to.equal("engrandomAlbumrandomAlbumIdrandomGmail@gmail.comcurrentDynamicLink.comcurrentDynamicLink.com");
            expect(lStub).to.have.been.calledOnce;
            expect(lStub).to.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"randomText\", {}, \"randomGmail\", \"randomLink\", \"random.css\", \"css\")\', expects \"randomText\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("randomText", {}, "randomGmail", "randomLink", "random.css", "css")).to.equal("randomText");
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"randomText\", {}, \"randomGmail\", \"randomLink\", \"aboutme.css\", \"css\")\', expects \"randomText\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("randomText", {}, "randomGmail", "randomLink", "aboutme.css", "css")).to.equal("randomText");
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"randomText@dynamicLink\", {}, \"randomGmail\", \"randomLink\", \"aboutme.css\", \"css\")\', expects \"randomText@dynamicLink\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("randomText@dynamicLink", {}, "randomGmail", "randomLink", "aboutme.css", "css")).to.equal("randomText@dynamicLink");
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"randomText@dynamicLink\", {}, \"randomGmail\", \"randomLink\", \"L.css\", \"css\")\', expects \"randomText@dynamicLink\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("randomText@dynamicLink", {}, "randomGmail", "randomLink", "L.css", "css")).to.equal("randomText@dynamicLink");
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"randomText@dynamicLink\", {}, \"randomGmail\", \"randomLink.randomDomain\", \"aboutme.css\", \"css\")\', expects \"randomTextrandomLink.randomDomain\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("randomText@dynamicLink", {}, "randomGmail", "randomLink.randomDomain", "aboutme.css", "css")).to.equal("randomTextrandomLink.randomDomain");
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"randomText@dynamicLink\", {}, \"randomGmail\", \"randomLink.randomDomain\", \"main.css\", \"css\")\', expects \"randomTextrandomLink.randomDomain\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("randomText@dynamicLink", {}, "randomGmail", "randomLink.randomDomain", "main.css", "css")).to.equal("randomTextrandomLink.randomDomain");
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });

        it('sends \'(\"randomText@dynamicLink\", {}, \"randomGmail\", \"randomLink.randomDomain\", \"randomWrongAndNonExistantName.css\", \"css\")\', expects \"randomText@dynamicLink\"', () => {
            srcJS.__set__("languageChooser", lStub);

            expect(srcJS.textReplacer("randomText@dynamicLink", {}, "randomGmail", "randomLink.randomDomain", "randomWrongAndNonExistantName.css", "css")).to.equal("randomText@dynamicLink");
            expect(lStub).to.not.have.been.called;
            expect(lStub).to.not.have.returned("eng");
            expect(lStub()).to.equal("eng");
        });
    });

    context('languageChooser()', () => {
        beforeEach(() => {
            srcJS = rewire("../src.js");
        });

        afterEach(() => {
            srcJS = rewire("../src.js");
        });

        it('sends \"rus\" and other types of Russian names shouldn\'t return \"eng\", instead should return \"rus\"', () => {
            const sendArr = [
                "rus",
                "russian",
                "ruso",
                "rusia",
                "ruski",
                "rusian",
                "ru",
                "rusuli",
                "russ",
                "russian language"
            ];

            for (var i = 0; i < sendArr.length; i++) {
                expect(srcJS.languageChooser(sendArr[i])).to.not.equal("eng");
                expect(srcJS.languageChooser(sendArr[i])).to.equal("rus");
            }
        });

        it('sends \'(\"anglish\")\' and shouldn\'t return \"rus\" but instead should return \"eng\"', () => {
            expect(srcJS.languageChooser("anglish")).to.not.equal("rus");
            expect(srcJS.languageChooser("anglish")).to.equal("eng");
        });

        it('sends different nulls and errors and should return \"eng\"', () => {
            const sendArr = [
                null,
                undefined,
                0,
                "ara qartuli",
                12408702,
                "@n6113h",
                "3ng1i3h"
            ];

            for (var i = 0; i < sendArr.length; i++) {
                expect(srcJS.languageChooser(sendArr[i])).to.equal("eng");
            }
        });

        it('sends \"ქართული\" and other Georgian names and expects to return \"geo\"', () => {
            const sendArr = [
                "ქართული",
                "geo",
                "qartuli nana",
                "cartuli nana",
                "kartuli nana",
                "kartluli",
                "kartvelian language",
                "kartuli ena",
                "deda ena",
                "qartuli ena",
                "cartuli ena",
                "geouri",
                "gurjistani",
                "georgiani",
                "qartveli",
                "georgianuri",
                "gurjistan",
                "georgian",
                "kartveli",
                "kutaisuri",
                "kartuli",
                "ka",
                "kar",
                "cartuli",
                "cartveluri",
                "cartvelian",
                "qartveluri",
                "qartvelian",
                "kartvellian",
                "kartvelian",
                "qartuli",
                "gorgian",
                "ge"
            ];

            for (var i = 0; i < sendArr.length; i++) {
                expect(srcJS.languageChooser(sendArr[i])).to.equal("geo");
            }
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
