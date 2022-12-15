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
const exp = require('constants');
chai.use(chaiAsPromised);
/*
const mock = require('mock-fs');

mock({
  'path/to/fake/dir': {
    'some-file.txt': 'file content here',
    'empty-dir': { empty directory }
  },
  'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
  'some/other/path': {/** another empty directory }
});
*/

var sandbox = sinon.createSandbox();

var indexJS = rewire('../index.js');

function globalPathFinder(folderList, requestedFile) {
    mock.restore();
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


//


describe('index.js', () => {
    beforeEach(() => {
        indexJS = rewire('../index.js');
    });

    afterEach(() => {
        indexJS = rewire('../index.js');
    });

    context('replaceText()', () => {
        /*
            gStub stubs pageNamer()
            lStub stubs langChooser()
        */
        var gStub, lStub;

        beforeEach(() => {
            gStub = sinon.stub(indexJS, 'pageNamer').returns("in_gallery");
            lStub = sinon.stub(indexJS, 'langChooser').returns("randomLang");

            indexJS = rewire('../index');
        });

        afterEach(() => {
            gStub.restore();
            lStub.restore();

            indexJS = rewire('../index');
        });

        it('sends \'(null, null, null)\' expects null)', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText(null, null, null)).to.equal(null).and.to.not.equal("");
            expect(gStub.called).to.be.false;
            expect(lStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(lStub.callCount).to.equal(0);
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"\", [\"hi\"], null)\', expects \"\"', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("",
                [
                    "hi"
                ], null)).to.equal("");
            expect(gStub).to.not.have.been.called;
            expect(gStub.called).to.be.false;
            expect(lStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(lStub.callCount).to.equal(0);
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", {page: \'thePage\', lang: \'lingua\', galleryID: \'theGallery\'s ID\'}, null)\', expects \"randomLangtheGallery\'s IDERRORin_gallery\"', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage",
                {
                    page: 'thePage',
                    lang: 'lingua',
                    galleryID: 'theGallery\'s ID'
                }, null)).to.equal("randomLangtheGallery\'s IDERRORin_gallery");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.have.been.calledOnce;
            expect(gStub.callCount).to.equal(1);
            expect(lStub.callCount).to.equal(1);
            expect(gStub).to.have.returned("in_gallery");
            expect(lStub).to.have.returned("randomLang");
            expect(gStub.calledBefore(lStub)).to.be.true;
            expect(lStub.calledAfter(gStub)).to.be.true;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", {page: \'thePage\', lang: \'lingua\'}, null)\', expects \"randomLang@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery\"', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage",
                {
                    page: 'thePage',
                    lang: 'lingua'
                }, null)).to.equal("randomLang@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.have.been.calledOnce;
            expect(gStub.callCount).to.equal(1);
            expect(lStub.callCount).to.equal(1);
            expect(gStub).to.have.returned("in_gallery");
            expect(lStub).to.have.returned("randomLang");
            expect(gStub.calledBefore(lStub)).to.be.true;
            expect(lStub.calledAfter(gStub)).to.be.true;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", {page: \'thePage\'}, null)\', expects \"eng@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery\"', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage",
                {
                    page: 'thePage'
                }, null)).to.equal("eng@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(1);
            expect(lStub.callCount).to.equal(0);
            expect(gStub).to.have.returned("in_gallery");
            expect(lStub).to.not.have.returned("randomLang");
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", null, null)\', expects \"eng@infoForTheIDOfTheArrayOfTheGalleryERRORindex""', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage", null, null)).to.equal("eng@infoForTheIDOfTheArrayOfTheGalleryERRORindex");
            expect(gStub).to.not.have.been.called;
            expect(lStub).to.not.have.been.called;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", {page: \'thePage\'}, null)\', expects \"eng@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery\"', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("BLANK",
                {
                    page: 'thePage',
                    lang: 'eng',
                    galleryID: 'fake_galleyID'
                }, "currentDynLink")).to.equal("BLANK");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.not.have.been.called;
            expect(gStub).to.have.returned("in_gallery");
            expect(lStub).to.not.have.returned("randomLang");
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@dynamicLink\", ["randomText"], "currentDynLink")\'', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("@dynamicLink", ["randomText"], "currentDynLink")).to.equal("currentDynLink");
            expect(gStub).to.not.have.been.called;
            expect(lStub).to.not.have.been.called;
            expect(lStub()).to.equal("randomLang");
            expect(gStub()).to.equal("in_gallery");
        });

        it('sends \'()\', and expects undefined', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText()).to.be.undefined;
            expect(gStub).to.not.have.been.called;
            expect(lStub).to.not.have.been.called;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@infoForTheIDOfTheArrayOfTheGallery@dynamicLink\", {galleryID: \'fakeID\'}, \"randomText\")\'', () => {
            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@lang", { galleryID: 'fakeID' }, "randomText")).to.equal("fakeIDrandomTexteng");
            expect(gStub).to.not.have.been.called;
            expect(lStub).to.not.have.been.called;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@infoForTheNameOfThisPage\", { page: \'unusual page name\'}, null)\'', () => {
            gStub = sinon.stub(indexJS, 'pageNamer').returns("pageName");

            indexJS.__set__('pageNamer', gStub);
            indexJS.__set__('langChooser', lStub);

            expect(indexJS.replaceText("@infoForTheNameOfThisPage", { page: 'unusual page name' }, null)).to.equal("pageName");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.not.have.been.called;
            expect(gStub).to.have.returned("pageName");
            expect(lStub()).to.equal("randomLang");
            expect(gStub()).to.equal("pageName");
        });
    });

    context('pageNamer()', () => {
        /*
            pSpy spies on pageNamer()
        */
        var pSpy;

        beforeEach(() => {
            indexJS = rewire('../index.js');

            pSpy = sinon.spy(indexJS, 'pageNamer');
        });

        afterEach(() => {
            indexJS = rewire('../index.js');

            pSpy.restore();
        });

        it('sends \'(null)\', expects \"n\"', () => {
            expect(indexJS.pageNamer(null)).to.equal("n");
            expect(pSpy.callCount).to.equal(1);
            expect(pSpy()).to.be.a('string');
        });

        it('sends \'(undefined)\', expects \"n\"', () => {
            expect(indexJS.pageNamer(undefined)).to.equal("n");
            expect(pSpy.callCount).to.equal(1);
            expect(pSpy()).to.be.a('string');
        });

        it('sends \'(0)\', expects \"n\"', () => {
            expect(indexJS.pageNamer(0)).to.equal("n");
            expect(pSpy.callCount).to.equal(1);
            expect(pSpy()).to.be.a('string');
        });

        it('sends \'(\"\")\', expects \"n\"', () => {
            expect(indexJS.pageNamer("")).to.equal("n");
            expect(pSpy.callCount).to.equal(1);
            expect(pSpy()).to.be.a('string');
        });

        it('sends different page names and expects to return the names sent', () => {
            const pageNameArr = [
                "aboutme",
                "in_gallery",
                "album",
                "contact",
                "equipment",
                "index",
                "model",
                "prices"
            ];
            for (var i = 0; i < pageNameArr.length; i++) {
                expect(indexJS.pageNamer(pageNameArr[i])).to.equal(pageNameArr[i]);
                expect(pSpy.callCount).to.be.above(0);
                expect(pSpy()).to.be.a('string');
            }
        });
    });

    context('langChooser()', () => {
        /*
            lSpy spies on langChooser()
        */
        var lSpy;

        beforeEach(() => {
            indexJS = rewire('../index.js');

            lSpy = sinon.spy(indexJS, 'langChooser');
        });

        afterEach(() => {
            indexJS = rewire('../index.js');

            lSpy.restore();
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
                expect(indexJS.langChooser(sendArr[i])).to.not.equal("eng");
                expect(indexJS.langChooser(sendArr[i])).to.equal("rus");
                expect(lSpy.callCount).to.be.above(0);
                expect(lSpy()).to.be.a('string');
            }
        });

        it('sends \'(\"anglish\")\' and shouldn\'t return \"rus\" but instead should return \"eng\"', () => {
            expect(indexJS.langChooser("anglish")).to.not.equal("rus");
            expect(indexJS.langChooser("anglish")).to.equal("eng");
            expect(lSpy.callCount).to.equal(2);
            expect(lSpy()).to.be.a('string');
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
                expect(indexJS.langChooser(sendArr[i])).to.equal("eng");
                expect(lSpy.callCount).to.be.above(0);
                expect(lSpy()).to.be.a('string');
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
                expect(indexJS.langChooser(sendArr[i])).to.equal("geo");
                expect(lSpy.callCount).to.be.above(0);
                expect(lSpy()).to.be.a('string');
            }
        });
    });

    context('errorTextFunc()', () => {
        /*
            eSpy spies on errorTextFunc()
        */
        var eSpy;
        beforeEach(() => {
            indexJS = rewire('../index.js');

            eSpy = sinon.spy(indexJS, 'errorTextFunc');
        });

        afterEach(() => {
            indexJS = rewire('../index.js');

            eSpy.restore();
        });

        it('sends \'()\', expects \"ERROR: the website is currently down, try again later or contact us at: undefined\"', () => {
            expect(indexJS.errorTextFunc()).to.equal("ERROR: the website is currently experiencing some issues, try again later or contact us at: " + undefined);
            expect(eSpy.callCount).to.equal(1);
            expect(eSpy()).to.be.a('string');
            expect(eSpy()).to.include("ERROR");
        });

        it('sends \'(\"randomLang", "randomGmail\")\' and expects \"ERROR: the website is currently down, try again later or contact us at: randomGmail\"', () => {
            expect(indexJS.errorTextFunc("randomLang", "randomGmail")).to.equal("ERROR: the website is currently experiencing some issues, try again later or contact us at: randomGmail");
            expect(eSpy.callCount).to.equal(1);
            expect(eSpy()).to.be.a('string');
            expect(eSpy()).to.include("ERROR");
        });

        it('sends \'(\"randomLang", "randomGmail\")\' and expects \"ERROR: the website is currently down, try again later or contact us at: randomGmail\"', () => {
            expect(indexJS.errorTextFunc("randomLang", "randomGmail")).to.equal("ERROR: the website is currently experiencing some issues, try again later or contact us at: randomGmail");
            expect(eSpy.callCount).to.equal(1);
            expect(eSpy()).to.be.a('string');
            expect(eSpy()).to.include("ERROR");
        });

        it('sends \'(\"rus", "randomGmail\")\' and expects \"ОШИБКА: веб-сайт в настоящее время не работает, повторите попытку позже или свяжитесь с нами по адресу: randomGmail\"', () => {
            expect(indexJS.errorTextFunc("rus", "randomGmail")).to.equal("ОШИБКА: на веб-сайте в настоящее время возникают некоторые проблемы, повторите попытку позже или свяжитесь с нами по адресу: randomGmail");
            expect(eSpy.callCount).to.equal(1);
            expect(eSpy()).to.be.a('string');
            expect(eSpy()).to.include("ERROR");
        });

        it('sends \'(\"geo", "randomGmail\")\' and expects \"შეცდომა: ვებგვერდი ამჟამად გათიშულია, სცადეთ მოგვიანებით ან დაგვიკავშირდით მისამართზე: randomGmail\"', () => {
            expect(indexJS.errorTextFunc("geo", "randomGmail")).to.equal("შეცდომა: ვებსაიტს ამჟამად აქვს გარკვეული პრობლემები, სცადეთ მოგვიანებით ან დაგვიკავშირდით: randomGmail");
            expect(eSpy.callCount).to.equal(1);
            expect(eSpy()).to.be.a('string');
            expect(eSpy()).to.include("ERROR");
        });
    });

    /*
        Rewrite the whole thing
    */
    context('isNull()', () => {
        /*
            iSpy spies on isNull()
        */
        var iSpy;

        beforeEach(() => {
            indexJS = rewire('../index.js');
            iSpy = sinon.spy(indexJS, "isNull");
        });

        afterEach(() => {
            indexJS = rewire('../index.js');
            iSpy.restore();
        });

        it('sends \'()\', expects true', () => {
            expect(indexJS.isNull()).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'(null)\', expects true', () => {
            expect(indexJS.isNull(null)).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'(undefined)\', expects true', () => {
            expect(indexJS.isNull(undefined)).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'(0)\', expects true', () => {
            expect(indexJS.isNull(0)).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'(100)\', expects true', () => {
            expect(indexJS.isNull(100)).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'(\"\")\', expects true', () => {
            expect(indexJS.isNull("")).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'(\'\')\', expects true', () => {
            expect(indexJS.isNull('')).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'([])\', expects true', () => {
            expect(indexJS.isNull([])).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'({})\', expects true', () => {
            expect(indexJS.isNull({})).to.be.true;
            expect(iSpy).to.have.returned(true);
            expect(iSpy.callCount).to.equal(1);
        });

        it('sends \'(\"randomName\")\', expects false', () => {
            expect(indexJS.isNull("randomName")).to.be.false;
            expect(iSpy).to.have.returned(false);
            expect(iSpy.callCount).to.equal(1);
        });
    });

    context('emailAssigner()', () => {
        /*
            iStub stubs ifExists()
            
            gStub stubs globalPathFinder()

            eSpy spies on emailAssigner()
        */
        var iStub, gStub, eSpy;

        beforeEach(() => {
            iStub = sinon.stub(indexJS, 'ifExists').returns(true);
            gStub = sinon.stub(indexJS, 'globalPathFinder').returns("randomFolder/randomFile.html");

            indexJS = rewire('../index.js');

            eSpy = sinon.spy(indexJS, "emailAssigner");
            sinon.spy(console, 'log');
        });

        afterEach(() => {
            iStub.restore();
            gStub.restore();

            indexJS = rewire('../index.js');

            eSpy.restore();
            console.log.restore();
        });

        it('sends \'()\', expects \"\"', () => {
            indexJS.__set__('ifExists', iStub);
            indexJS.__set__('globalPathFinder', gStub);

            expect(indexJS.emailAssigner()).to.equal("");
            expect(console.log.callCount).to.equal(1);
            expect(console.log.calledWith("index.js emailAssigner() ERROR: TypeError: Cannot use \'in\' operator to search for \'arr\' in undefined")).to.be.true;
            expect(iStub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(0);
            expect(eSpy.callCount).to.equal(1);
            expect(eSpy()).to.be.a('string');
        });

        it('sends \'({\"name\": \"randomName\"})\', expects \"\"', () => {
            indexJS.__set__('ifExists', iStub);
            indexJS.__set__('globalPathFinder', gStub);

            expect(indexJS.emailAssigner({ "name": "randomName" })).to.equal("");
            expect(iStub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(0);
            expect(eSpy.callCount).to.equal(1);
        });

        it('sends \'({\"arr\": [\"randomLoc\", \"anotherRandomLoc\"]})\', expects \"\"', () => {
            indexJS.__set__('ifExists', iStub);
            indexJS.__set__('globalPathFinder', gStub);

            expect(indexJS.emailAssigner({ "arr": ["randomLoc", "anotherRandomLoc"] })).to.equal("");
            expect(iStub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(0);
            expect(eSpy.callCount).to.equal(1);
        });

        it('sends \'({\"arr\": []})\', expects \"\"', () => {
            indexJS.__set__('ifExists', iStub);
            indexJS.__set__('globalPathFinder', gStub);

            expect(indexJS.emailAssigner({ "arr": [] })).to.equal("");
            expect(iStub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(0);
            expect(eSpy.callCount).to.equal(1);
        });

        it('sends \'({\"arr\": [], \"name\": \"randomName\"})\', expects \"\"', () => {
            indexJS.__set__('ifExists', iStub);
            indexJS.__set__('globalPathFinder', gStub);

            expect(indexJS.emailAssigner({ "arr": [], "name": "randomName" })).to.equal("");
            expect(iStub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(0);
            expect(eSpy.callCount).to.equal(1);
        });

        it('sends \'({ "arr": ["randomFolder", "anotherRandomFolder"], "name": "randomFile" })\', expects \"\"', () => {
            indexJS.__set__('ifExists', iStub);
            indexJS.__set__('globalPathFinder', gStub);

            expect(indexJS.emailAssigner({ "arr": ["randomFolder", "anotherRandomFolder"], "name": "randomFile" })).to.equal("");
            expect(iStub.callCount).to.equal(1);
            expect(gStub.callCount).to.equal(2);
            expect(eSpy.callCount).to.equal(1);
            expect(iStub).to.have.returned(true);
            expect(gStub).to.have.returned("randomFolder/randomFile.html");
            expect(eSpy).to.have.returned("");
            expect(iStub).to.have.been.calledBefore(gStub);
            expect(gStub).to.have.been.calledAfter(iStub);
            expect(iStub()).to.be.true;
            expect(iStub()).to.be.a('boolean');
            expect(gStub()).to.equal("randomFolder/randomFile.html");
            expect(gStub()).to.be.a('string');
        });
    });
});

/*
    context('theFunc()', () => {
        beforeEach(() => {
            indexJS = rewire('../index.js');
        });

        afterEach(() => {
            indexJS = rewire('../index.js');
        });

        it('sends \'()\', expects \"\"', () => {
            //
        });
    });
*/

/*
    replaceText();
    pageNamer();
    langChooser();
    errorTextFunc();
    isNull();
    ifExists();
    globalPathFinder();
*/
