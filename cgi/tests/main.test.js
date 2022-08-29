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

var mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
// eval(fs.readFileSync(globalPathFinder(["www", "js"], "main.js")) + '');
// console.log(mainJS);

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


describe('main.js', () => {
    beforeEach(() => {
        mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
    });

    afterEach(() => {
        mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
    });

    context('ketoTranslator()', () => {
        var smStub;
        var hStub;

        beforeEach(() => {
            smStub = sinon.stub(mainJS, 'ketoTranslator_SecurityManager').returns(true);
            hStub = sinon.stub(mainJS, 'ketoTranslatorHelper').returns(true);

            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        afterEach(() => {
            smStub.restore();
            hStub.restore();

            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        //actual it unit tests
        it('sends \'(null, null, null, null)\' information and expects it to return an \"error\"', () => {
            mainJS.__set__('ketoTranslator_SecurityManager', smStub);
            mainJS.__set__('ketoTranslatorHelper', hStub);

            expect(mainJS.ketoTranslator(null, null, null, null)).to.equal("error");
            expect(smStub).to.have.been.calledOnce;
            expect(hStub).to.not.have.been.called;
            expect(smStub).to.have.returned(true);
            expect(hStub()).to.be.true;
        });

        it('sends \'(null, \"translation_for_lang_names\", null, null)\', and expects it to return true', () => {
            mainJS.__set__('ketoTranslator_SecurityManager', smStub);
            mainJS.__set__('ketoTranslatorHelper', hStub);

            expect(mainJS.ketoTranslator(null, "translation_for_lang_names", null, null)).to.equal(true);
            expect(smStub.calledOnce).to.be.true;
            expect(hStub.calledOnce).to.be.true;
            expect(smStub).to.have.returned(true);
            expect(hStub).to.have.returned(true);
        });
    });

    context('ketoTranslator_SecurityManager()', () => {
        var lStub, jStub, oStub, aStub;

        beforeEach(() => {
            lStub = sinon.stub(mainJS, 'checkLang').returns(true);
            jStub = sinon.stub(mainJS, 'checkJob').returns(true);
            oStub = sinon.stub(mainJS, 'checkOtherInfo').returns(true);
            aStub = sinon.stub(mainJS, 'askForHelp').returns(true);

            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        afterEach(() => {
            lStub.restore();
            jStub.restore();
            oStub.restore();
            aStub.restore();

            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        it('sends \'(null, null, null, null)\' and expects to return false', () => {
            mainJS.__set__('checkLang', lStub);
            mainJS.__set__('checkJob', jStub);
            mainJS.__set__('checkOtherInfo', oStub);
            mainJS.__set__('askForHelp', aStub);

            expect(mainJS.ketoTranslator_SecurityManager(null, null, null, null)).to.be.false;
            expect(jStub.calledOnce).to.be.true;
            expect(oStub.calledOnce).to.be.true;
            expect(aStub.calledOnce).to.be.true;
            expect(lStub.called).to.be.false;
            expect(jStub).to.have.returned(true);
            expect(oStub).to.have.returned(true);
            expect(aStub).to.have.returned(true);
            expect(lStub()).to.be.true;
        });

        it('sends \'(null, null, null, 1)\', and expects to return false', () => {
            mainJS.__set__('checkLang', lStub);
            mainJS.__set__('checkJob', jStub);
            mainJS.__set__('askForHelp', aStub);
            mainJS.__set__('checkOtherInfo', oStub);

            expect(mainJS.ketoTranslator_SecurityManager(null, null, null, 1)).to.be.false;
            expect(jStub).to.have.been.calledOnce;
            expect(oStub).to.have.been.calledOnce;
            expect(aStub).to.have.been.calledOnce;
            expect(lStub).to.not.have.been.called;
            expect(jStub).to.have.returned(true);
            expect(oStub).to.have.returned(true);
            expect(aStub).to.have.returned(true);
            expect(lStub()).to.be.true;
        });

        it('sends \'(null, null, null, [\"angliski\"])\', but changed lStub to return false. The it test expects to return \"eng\"', () => {
            lStub = sinon.stub(mainJS, 'checkLang').returns(false);

            mainJS.__set__('checkLang', lStub);
            mainJS.__set__('askForHelp', aStub);
            mainJS.__set__('checkJob', jStub);
            mainJS.__set__('checkOtherInfo', oStub);

            expect(mainJS.ketoTranslator_SecurityManager(null, null, null, ["angliski"])).to.equal("eng");
            expect(lStub.calledOnce).to.be.true;
            expect(jStub.calledOnce).to.be.true;
            expect(oStub.calledOnce).to.be.true;
            expect(aStub.called).to.be.false;
            expect(lStub).to.have.returned(false);
            expect(jStub).to.have.returned(true);
            expect(aStub()).to.be.true;
            expect(oStub).to.have.returned(true);
        })
    });

    context('ketoTranslatorHelper()', () => {
        var smStub, atStub;

        beforeEach(() => {
            smStub = sinon.stub(mainJS, 'ketoTranslatorHelper_SecurityManager').returns(true);
            atStub = sinon.stub(mainJS, 'actualTranslator').returns(true);

            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        afterEach(() => {
            smStub.restore();
            atStub.restore();

            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        it('sends \'(\"rus\", [{textRus: \"mother russia\"}], 0)\' and expects \"mother russia\"', () => {
            atStub = sinon.stub(mainJS, 'actualTranslator').returns("mother russia");

            mainJS.__set__('ketoTranslatorHelper_SecurityManager', smStub);
            mainJS.__set__('actualTranslator', atStub);

            expect(mainJS.ketoTranslatorHelper("rus", [{ textRus: "blin" }], 0)).to.equal("mother russia");
            expect(atStub.calledOnce).to.be.true;
            expect(smStub.calledOnce).to.be.true;
            expect(smStub()).to.be.true;
            expect(atStub()).to.equal("mother russia");
        });

        it('sends \'(null, null, null)\', but changes smStub to false and expects \"error\"', () => {
            smStub = sinon.stub(mainJS, 'ketoTranslatorHelper_SecurityManager').returns(false);

            mainJS.__set__('ketoTranslatorHelper_SecurityManager', smStub);
            mainJS.__set__('actualTranslator', atStub);

            expect(mainJS.ketoTranslatorHelper(null, null, null)).to.equal("error");
            expect(atStub.called).to.be.false;
            expect(smStub.calledOnce).to.be.true;
            expect(smStub()).to.be.false;
            expect(atStub()).to.equal(true);
        });
    });

    context('actualTranslator()', () => {
        beforeEach(() => {
            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        afterEach(() => {
            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        it('sends \'(\"BLAH\", [{textEng: \"BLINN\"}], 0)\', expects \"BLINN\"', () => {
            expect(mainJS.actualTranslator("BLAH", [{ textEng: "BLINN" }], 0)).to.equal("BLINN");
        });

        it('sends \'(\"rus\", [{textEng: 10}], 0)\' and expects failure', () => {
            expect(mainJS.actualTranslator("rus", [{ textEng: 10 }], 0)).to.throw;
        });

        it('sends \'(\"rus\", [{textRus: 10}], 0)\' and expects 10', () => {
            expect(mainJS.actualTranslator("rus", [{ textRus: 10 }], 0)).to.equal(10);
        });

        it('sends \'(\"geo\", [{textGeo: 10}], 0)\' and expects 10', () => {
            expect(mainJS.actualTranslator("geo", [{ textGeo: 10 }], 0)).to.equal(10);
        });
    });

    context('languageChooser()', () => {
        beforeEach(() => {
            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        afterEach(() => {
            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
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
                expect(mainJS.languageChooser(sendArr[i])).to.not.equal("eng");
                expect(mainJS.languageChooser(sendArr[i])).to.equal("rus");
            }
        });

        it('sends \'(\"anglish\")\' and shouldn\'t return \"rus\" but instead should return \"eng\"', () => {
            expect(mainJS.languageChooser("anglish")).to.not.equal("rus");
            expect(mainJS.languageChooser("anglish")).to.equal("eng");
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
                expect(mainJS.languageChooser(sendArr[i])).to.equal("eng");
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
                expect(mainJS.languageChooser(sendArr[i])).to.equal("geo");
            }
        });
    });

    context('checkLang()', () => {
        var lStub;

        beforeEach(() => {
            lStub = sinon.stub(mainJS, 'languageChooser').returns("rus");

            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        afterEach(() => {
            lStub.restore();

            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        it('sends \'(\"eng\")\', \'(\"rus\")\', and \'(\"geo\")\', while expecting lStub() to return "rus" and expects to return true for all', () => {
            mainJS.__set__('languageChooser', lStub);

            expect(mainJS.checkLang("eng")).to.equal(true);
            expect(lStub).to.have.returned("rus");
            expect(mainJS.checkLang("rus")).to.equal(true);
            expect(lStub).to.have.returned("rus");
            expect(mainJS.checkLang("geo")).to.equal(true);
            expect(lStub).to.have.returned("rus");
            expect(lStub.called).to.be.true;
        });

        it('sends \'(\"eng\")\', \'(\"rus\")\', and \'(\"geo\")\', while expecting lStub() to return "eng" and expects to return true for all', () => {
            lStub = sinon.stub(mainJS, 'languageChooser').returns("eng");

            mainJS.__set__('languageChooser', lStub);

            expect(mainJS.checkLang("eng")).to.equal(true);
            expect(lStub).to.have.returned("eng");
            expect(mainJS.checkLang("rus")).to.equal(true);
            expect(lStub).to.have.returned("eng");
            expect(mainJS.checkLang("geo")).to.equal(true);
            expect(lStub).to.have.returned("eng");
            expect(lStub.called).to.be.true;
        });

        it('sends \'(\"eng\")\', \'(\"rus\")\', and \'(\"geo\")\', while expecting lStub() to return "geo", and expects to return true for all', () => {
            lStub = sinon.stub(mainJS, 'languageChooser').returns("geo");

            mainJS.__set__('languageChooser', lStub);

            expect(mainJS.checkLang("eng")).to.equal(true);
            expect(lStub).to.have.returned("geo");
            expect(mainJS.checkLang("rus")).to.equal(true);
            expect(lStub).to.have.returned("geo");
            expect(mainJS.checkLang("geo")).to.equal(true);
            expect(lStub).to.have.returned("geo");
            expect(lStub.called).to.be.true;
        });

        it('should make lStub() return something but \"rus\", \"eng\" or \"geo\" and expects checkLang to return false', () => {
            lStub = sinon.stub(mainJS, 'languageChooser').returns(false);

            mainJS.__set__('languageChooser', lStub);

            expect(mainJS.checkLang("eng")).to.equal(false);
            expect(lStub.called).to.be.true;
            expect(lStub).to.have.returned(false);
            expect(lStub.callCount).be.be.at.least(3);
        });
    });
});

/*

    context('theFunc()', () => {
        beforeEach(() => {
            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        afterEach(() => {
            mainJS = rewire(globalPathFinder(["www", "js"], "main.js"));
        });

        it('sends __, but __, expects __', () => {
            
        });
    });

*/