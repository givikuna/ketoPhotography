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

var indexJS = rewire('../index');

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


describe('index.js', () => {
    beforeEach(() => {
        indexJS = rewire('../index.js');
    });

    afterEach(() => {
        indexJS = rewire('../index.js');
    });

    context('replaceText()', () => {
        var gStub, lStub;

        beforeEach(() => {
            gStub = sinon.stub(indexJS, 'giveInformationAboutPage').returns("in_gallery");
            lStub = sinon.stub(indexJS, 'languageChooser').returns("randomLang");

            indexJS = rewire('../index');
        });

        afterEach(() => {
            gStub.restore();
            lStub.restore();

            indexJS = rewire('../index');
        });

        it('sends \'(null, null, null)\' expects null)', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText(null, null, null)).to.equal(null).and.to.not.equal("");
            expect(gStub.called).to.be.false;
            expect(lStub.called).to.be.false;
            expect(gStub()).to.equal("in_gallery");
            // expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"\", [\"hi\"], null)\', expects \"\"', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText("",
                [
                    "hi"
                ], null)).to.equal("");
            expect(gStub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(lStub.callCount).to.equal(0);
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", {page: \'thePage\', lang: \'lingua\', galleryID: \'theGallery\'s ID\'}, null)\', expects \"randomLangtheGallery\'s IDERRORin_gallery\"', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText("@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage",
                {
                    page: 'thePage',
                    lang: 'lingua',
                    galleryID: 'theGallery\'s ID'
                }, null)).to.equal("randomLangtheGallery\'s IDERRORin_gallery");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.have.been.calledOnce;
            expect(gStub).to.have.returned("in_gallery");
            expect(lStub).to.have.returned("randomLang");
            expect(gStub.calledBefore(lStub)).to.be.true;
            expect(lStub.calledAfter(gStub)).to.be.true;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", {page: \'thePage\', lang: \'lingua\'}, null)\', expects \"randomLang@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery\"', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText("@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage",
                {
                    page: 'thePage',
                    lang: 'lingua'
                }, null)).to.equal("randomLang@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.have.been.calledOnce;
            expect(gStub).to.have.returned("in_gallery");
            expect(lStub).to.have.returned("randomLang");
            expect(gStub.calledBefore(lStub)).to.be.true;
            expect(lStub.calledAfter(gStub)).to.be.true;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", {page: \'thePage\'}, null)\', expects \"eng@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery\"', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText("@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage",
                {
                    page: 'thePage'
                }, null)).to.equal("eng@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.not.have.been.called;
            expect(gStub).to.have.returned("in_gallery");
            expect(lStub).to.not.have.returned("randomLang");
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", null, null)\', expects \"eng@infoForTheIDOfTheArrayOfTheGalleryERRORindex""', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText("@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage", null, null)).to.equal("eng@infoForTheIDOfTheArrayOfTheGalleryERRORindex");
            expect(gStub).to.not.have.been.called;
            expect(lStub).to.not.have.been.called;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@lang@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@infoForTheNameOfThisPage\", {page: \'thePage\'}, null)\', expects \"eng@infoForTheIDOfTheArrayOfTheGalleryERRORin_gallery\"', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

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
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText("@dynamicLink", ["randomText"], "currentDynLink")).to.equal("currentDynLink");
            expect(gStub).to.not.have.been.called;
            expect(lStub).to.not.have.been.called;
            expect(lStub()).to.equal("randomLang");
            expect(gStub()).to.equal("in_gallery");
        });

        it('sends \'()\', and expects undefined', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText()).to.be.undefined;
            expect(gStub).to.not.have.been.called;
            expect(lStub).to.not.have.been.called;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@infoForTheIDOfTheArrayOfTheGallery@dynamicLink\", {galleryID: \'fakeID\'}, \"randomText\")\'', () => {
            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText("@infoForTheIDOfTheArrayOfTheGallery@dynamicLink@lang", { galleryID: 'fakeID' }, "randomText")).to.equal("fakeIDrandomTexteng");
            expect(gStub).to.not.have.been.called;
            expect(lStub).to.not.have.been.called;
            expect(gStub()).to.equal("in_gallery");
            expect(lStub()).to.equal("randomLang");
        });

        it('sends \'(\"@infoForTheNameOfThisPage\", { page: \'unusual page name\'}, null)\'', () => {
            gStub = sinon.stub(indexJS, 'giveInformationAboutPage').returns("pageName");

            indexJS.__set__('giveInformationAboutPage', gStub);
            indexJS.__set__('languageChooser', lStub);

            expect(indexJS.replaceText("@infoForTheNameOfThisPage", { page: 'unusual page name' }, null)).to.equal("pageName");
            expect(gStub).to.have.been.calledOnce;
            expect(lStub).to.not.have.been.called;
            expect(gStub).to.have.returned("pageName");
            expect(lStub()).to.equal("randomLang");
            expect(gStub()).to.equal("pageName");
        });
    });

    context('giveInformationAboutPage()', () => {
        beforeEach(() => {
            indexJS = rewire('../index.js');
        });

        afterEach(() => {
            indexJS = rewire('../index.js');
        });

        it('sends \'(null)\', expects \"n\"', () => {
            expect(indexJS.giveInformationAboutPage(null)).to.equal("n");
        });

        it('sends \'(undefined)\', expects \"n\"', () => {
            expect(indexJS.giveInformationAboutPage(undefined)).to.equal("n");
        });

        it('sends \'(0)\', expects \"n\"', () => {
            expect(indexJS.giveInformationAboutPage(0)).to.equal("n");
        });

        it('sends \'(\"\")\', expects \"n\"', () => {
            expect(indexJS.giveInformationAboutPage("")).to.equal("n");
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
                expect(indexJS.giveInformationAboutPage(pageNameArr[i])).to.equal(pageNameArr[i]);
            }
        });
    });

    context('languageChooser()', () => {
        beforeEach(() => {
            indexJS = rewire('../index.js');
        });

        afterEach(() => {
            indexJS = rewire('../index.js');
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
                expect(indexJS.languageChooser(sendArr[i])).to.not.equal("eng");
                expect(indexJS.languageChooser(sendArr[i])).to.equal("rus");
            }
        });

        it('sends \'(\"anglish\")\' and shouldn\'t return \"rus\" but instead should return \"eng\"', () => {
            expect(indexJS.languageChooser("anglish")).to.not.equal("rus");
            expect(indexJS.languageChooser("anglish")).to.equal("eng");
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
                expect(indexJS.languageChooser(sendArr[i])).to.equal("eng");
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
                expect(indexJS.languageChooser(sendArr[i])).to.equal("geo");
            }
        });
    });

    context('errorTextFunc()', () => {
        beforeEach(() => {
            indexJS = rewire('../index.js');
        });

        afterEach(() => {
            indexJS = rewire('../index.js');
        });

        it('sends \'()\', expects \"ERROR: the website is currently down, try again later or contact us at: undefined\"', () => {
            expect(indexJS.errorTextFunc()).to.equal("ERROR: the website is currently down, try again later or contact us at: " + undefined);
        });

        it('sends \'(\"randomLang", "randomGmail\")\' and expects \"ERROR: the website is currently down, try again later or contact us at: randomGmail\"', () => {
            expect(indexJS.errorTextFunc("randomLang", "randomGmail")).to.equal("ERROR: the website is currently down, try again later or contact us at: randomGmail");
        });

        it('sends \'(\"randomLang", "randomGmail\")\' and expects \"ERROR: the website is currently down, try again later or contact us at: randomGmail\"', () => {
            expect(indexJS.errorTextFunc("randomLang", "randomGmail")).to.equal("ERROR: the website is currently down, try again later or contact us at: randomGmail");
        });

        it('sends \'(\"rus", "randomGmail\")\' and expects \"ОШИБКА: веб-сайт в настоящее время не работает, повторите попытку позже или свяжитесь с нами по адресу: randomGmail\"', () => {
            expect(indexJS.errorTextFunc("rus", "randomGmail")).to.equal("ОШИБКА: веб-сайт в настоящее время не работает, повторите попытку позже или свяжитесь с нами по адресу: randomGmail");
        });

        it('sends \'(\"geo", "randomGmail\")\' and expects \"შეცდომა: ვებგვერდი ამჟამად გათიშულია, სცადეთ მოგვიანებით ან დაგვიკავშირდით მისამართზე: randomGmail\"', () => {
            expect(indexJS.errorTextFunc("geo", "randomGmail")).to.equal("შეცდომა: ვებგვერდი ამჟამად გათიშულია, სცადეთ მოგვიანებით ან დაგვიკავშირდით მისამართზე: randomGmail");
        });
    });

    context('pageNullChecker()', () => {
        beforeEach(() => {
            indexJS = rewire('../index.js');
        });

        afterEach(() => {
            indexJS = rewire('../index.js');
        });

        it('sends \'()\', expects \"\"', () => {
            expect(indexJS.pageNullChecker()).to.equal("n");
        });

        it('sends \'(null)\', expects \"\"', () => {
            expect(indexJS.pageNullChecker(null)).to.equal("n");
        });

        it('sends \'(undefined)\', expects \"\"', () => {
            expect(indexJS.pageNullChecker(undefined)).to.equal("n");
        });

        it('sends \'(0)\', expects \"\"', () => {
            expect(indexJS.pageNullChecker(0)).to.equal("n");
        });

        it('sends \'(\"\")\', expects \"\"', () => {
            expect(indexJS.pageNullChecker("")).to.equal("n");
        });

        it('sends \'(\'\')\', expects \"\"', () => {
            expect(indexJS.pageNullChecker('')).to.equal("n");
        });

        it('sends \'([])\', expects \"\"', () => {
            expect(indexJS.pageNullChecker([])).to.equal("n");
        });

        it('sends \'({})\', expects \"\"', () => {
            expect(indexJS.pageNullChecker({})).to.equal("n");
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
    giveInformationAboutPage();
    languageChooser();
    errorTextFunc();
    pageNullChecker();
    fileExistanceChecker();
    globalPathFinder();
*/
