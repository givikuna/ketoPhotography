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
        });

        it('sends \'()\', expects []', () => {
            gStub = sinon.stub(selectJS, "getArr").returns("blank");
            selectJS.__set__("getArr", gStub);

            expect(selectJS.selectReqRes()).to.deep.equal([]);
        });
    });

    context('ifAboutMePageChanger()', () => {
        var gStub, g2Stub;

        beforeEach(() => {
            gStub = sinon.stub(selectJS, "getArr").returns(true);
            g2Stub = sinon.stub(selectJS, "getLang").returns("en");

            selectJS = rewire("../select.js");
        });

        afterEach(() => {
            gStub.restore();
            g2Stub.restore();

            selectJS = rewire("../select.js");
        });

        it('sends \'(false)\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger(false)).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'(null)\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger(null)).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'([]])\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger([])).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({}})\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({})).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'(undefined)\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger(undefined)).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'("string")\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger("string")).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        
        it('sends \'()\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger()).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({\"page\": \"randomPage\"})\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({"page": "randomPage"})).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({\"page\": \"randomPage\", \"lang\": \"en\"})\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({"page": "randomPage", "lang": "en"})).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({\"page\": \"aboutme\", \"lang\": \"en\"})\', expects true', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({"page": "aboutme", "lang": "en"})).to.be.true;
            expect(gStub).to.have.been.calledOnce;
            expect(g2Stub).to.have.been.calledOnce;
            expect(gStub).to.have.returned(true);
            expect(g2Stub).to.have.returned("en");
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
        });

        it('sends \'({\"lang\": \"randomLang\"})\', expects false', () => {
            selectJS.__set__("getArr", gStub);
            selectJS.__set__("getLang", g2Stub);

            expect(selectJS.ifAboutMePageChanger({"lang": "randomLang"})).to.be.false;
            expect(gStub).to.not.have.been.called;
            expect(g2Stub).to.not.have.been.called;
            expect(gStub()).to.be.true;
            expect(g2Stub()).to.equal("en");
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