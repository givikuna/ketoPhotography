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

var selectJS = rewire("../select.js");

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


//


describe('select.js', () => {
    beforeEach(() => {
        selectJS = rewire("../select.js");
    });

    afterEach(() => {
        selectJS = rewire("../select.js");
    });

    context('selectReqRes()', () => {
        var gStub;

        beforeEach(() => {
            gStub = sinon.stub(selectJS, "getArr").returns([{ "location": "randomLocation", "name": "randomName" }]);

            selectJS = rewire("../select.js");
        });

        afterEach(() => {
            gStub.restore();

            selectJS = rewire("../select.js");
        });

        it('sends \'()\', expects \"[[{\"location\":\"randomLocation\",\"name\":\"randomName\"}]]\"', () => {
            selectJS.__set__("getArr", gStub);

            expect(selectJS.selectReqRes()).to.equal("[[{\"location\":\"randomLocation\",\"name\":\"randomName\"}]]");
            expect()
        });

        it('sends \'()\', expects []', () => {
            gStub = sinon.stub(selectJS, "getArr").returns("blank");
            selectJS.__set__("getArr", gStub);

            expect(selectJS.selectReqRes()).to.deep.equal([]);
            expect(gStub).to.have.been.called;
            expect(gStub.calledOnce).to.be.true;
            expect(gStub.callCount).to.equal(1);
            expect(gStub.called).to.be.true;
            expect(gStub()).to.equal("blank");
        });
    });

    context('ifAboutMePageChanger()', () => {
        var gStub, g2Stub;

        beforeEach(() => {
            gStub = sinon.stub(selectJS, "getData").returns(true);
            g2Stub = sinon.stub(selectJS, "getLang").returns("en");

            selectJS = rewire("../select.js");
        });

        afterEach(() => {
            gStub.restore();
            g2Stub.restore();

            selectJS = rewire("../select.js");
        });

        it('sends \'(false)\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger(false)).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'(null)\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger(null)).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'([]])\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger([])).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({}})\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({})).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'(undefined)\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger(undefined)).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'("string")\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger("string")).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });


        it('sends \'()\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger()).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({\"page\": \"randomPage\"})\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({ "page": "randomPage" })).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({\"page\": \"randomPage\", \"lang\": \"en\"})\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({ "page": "randomPage", "lang": "en" })).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({\"page\": \"aboutme\", \"lang\": \"en\"})\', expects true', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({ "page": "aboutme", "lang": "en" })).to.be.true;
            expect(gStub).to.have.been.calledOnce;
            expect(g2Stub).to.have.been.calledOnce;
            expect(gStub.callCount).to.equal(1);
            expect(g2Stub.callCount).to.equal(1);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub).to.have.returned(true);
            expect(g2Stub).to.have.returned("en");
            expect(g2Stub).to.have.been.calledBefore(gStub);
            expect(gStub).to.have.been.calledAfter(g2Stub);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({\"lang\": \"randomLang\"})\', expects false', () => {
            selectJS.__set__("getData", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({ "lang": "randomLang" })).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub.callCount).to.equal(0);
            expect(g2Stub.callCount).to.equal(0);
            expect(gStub.callCount).to.equal(g2Stub.callCount);
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });
    });

    context('getLang()', () => {
        beforeEach(() => {
            selectJS = rewire('../select.js');
        });

        afterEach(() => {
            selectJS = rewire('../select.js');
        });

        it('sends \"ru\" and other types of Russian names shouldn\'t return \"en\", instead should return \"ru\"', () => {
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
                expect(selectJS.getLang(sendArr[i])).to.not.equal("en");
                expect(selectJS.getLang(sendArr[i])).to.equal("ru");
            }
        });

        it('sends \'(\"anglish\")\' and shouldn\'t return \"ru\" but instead should return \"en\"', () => {
            expect(selectJS.getLang("anglish")).to.not.equal("ru");
            expect(selectJS.getLang("anglish")).to.equal("en");
        });

        it('sends different nulls and errors and should return \"en\"', () => {
            const sendArr = [
                null,
                undefined,
                0,
                "ara qartuli",
                12408702,
                "@n6113h",
                "3ng1i3h",
                "en"
            ];

            for (var i = 0; i < sendArr.length; i++) {
                expect(selectJS.getLang(sendArr[i])).to.equal("en");
            }
        });

        it('sends \"?????????????????????\" and other Georgian names and expects to return \"ge\"', () => {
            const sendArr = [
                "?????????????????????",
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
                expect(selectJS.getLang(sendArr[i])).to.equal("ge");
            }
        });
    });

    context('getArr()', () => {
        var rStub, gStub;

        beforeEach(() => {
            rStub = sinon.stub(selectJS, "readArrayFile").returns({ "foo": "bar" });
            gStub = sinon.stub(selectJS, "globalPathFinder").returns("randomPath");

            selectJS = rewire("../select.js");
        });

        afterEach(() => {
            rStub.restore();
            gStub.restore();

            selectJS = rewire("../select.js");
        });

        it('sends \'()\', expects {\"foo\": \"bar\"}', () => {
            let consoleLogSpy = sinon.spy(console, 'log');

            selectJS.__set__("readArrayFile", rStub);
            selectJS.__set__("globalPathFinder", gStub);

            expect(selectJS.getArr()).to.deep.equal([]);
            expect(rStub).to.have.been.calledOnce;
            expect(gStub).to.have.been.calledOnce;
            expect(rStub.callCount).to.equal(1);
            expect(gStub.callCount).to.equal(1);
            expect(rStub.callCount).to.equal(gStub.callCount);
            expect(rStub).to.have.been.calledAfter(gStub);
            expect(gStub).to.have.been.calledBefore(rStub);
            expect(rStub).to.have.returned({ "foo": "bar" });
            expect(gStub).to.have.returned("randomPath");
            expect(consoleLogSpy).to.have.been.calledOnce;
            expect(consoleLogSpy.calledOnce).to.be.true;
            expect(consoleLogSpy.calledOnceWith('select.js getArr() ERROR: SyntaxError: Unexpected token o in JSON at position 1')).to.be.true;
            expect(rStub()).to.deep.equal({ "foo": "bar" });
            expect(gStub()).to.equal("randomPath");

            consoleLogSpy.restore();
        });

        it('sends \'()\', expects {\"foo\": \"bar\"}', () => {
            rStub = sinon.stub(selectJS, "readArrayFile").returns('{"foo": "bar"}');

            selectJS.__set__("readArrayFile", rStub);
            selectJS.__set__("globalPathFinder", gStub);

            expect(selectJS.getArr()).to.deep.equal({ "foo": "bar" });
            expect(rStub).to.have.been.calledOnce;
            expect(gStub).to.have.been.calledOnce;
            expect(rStub.callCount).to.equal(1);
            expect(gStub.callCount).to.equal(1);
            expect(rStub.callCount).to.equal(gStub.callCount);
            expect(rStub).to.have.been.calledAfter(gStub);
            expect(gStub).to.have.been.calledBefore(rStub);
            expect(rStub).to.have.returned('{"foo": "bar"}');
            expect(gStub).to.have.returned("randomPath");
            expect(rStub()).to.equal('{"foo": "bar"}');
            expect(gStub()).to.equal("randomPath");
        });
    });
});

/*

    context('theFunc()', () => {
        beforeEach(() => {
            selectJS = rewire("../select.js");
        });

        afterEach(() => {
            selectJS = rewire("../select.js");
        });

        it('sends __, but __, expects __', () => {
            
        });
    });

*/
