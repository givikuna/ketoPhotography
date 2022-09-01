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
        var gStub;

        beforeEach(() => {
            gStub = sinon.stub(selectJS, "getArr").returns(true);

            selectJS = rewire("../select.js");
        });

        afterEach(() => {
            gStub.restore();

            selectJS = rewire("../select.js");
        });

        it('sends \'(false)\', expects false', () => {
            selectJS.__set__("getArr", gStub);

            expect(selectJS.ifAboutMePageChanger(false)).to.equal(false);
        });

        it('sends \'(null)\', expects false', () => {
            selectJS.__set__("getArr", gStub);

            expect(selectJS.ifAboutMePageChanger(null)).to.equal(false);
        });

        it('sends \'(false)\', expects false', () => {
            selectJS.__set__("getArr", gStub);

            expect(selectJS.ifAboutMePageChanger(false)).to.equal(false);
        });

        it('sends \'(false)\', expects false', () => {
            selectJS.__set__("getArr", gStub);

            expect(selectJS.ifAboutMePageChanger(false)).to.equal(false);
        });

        it('sends \'(false)\', expects false', () => {
            selectJS.__set__("getArr", gStub);

            expect(selectJS.ifAboutMePageChanger(false)).to.equal(false);
        });

        it('sends \'(false)\', expects false', () => {
            selectJS.__set__("getArr", gStub);

            expect(selectJS.ifAboutMePageChanger(false)).to.equal(false);
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