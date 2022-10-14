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

var imageJS = rewire('../image');

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


describe('index.js', () => {
    beforeEach(() => {
        imageJS = rewire('../image.js');
    });

    afterEach(() => {
        imageJS = rewire('../image.js');
    });

    context('checkTheType()', () => {
        var gStub;

        beforeEach(() => {
            gStub = sinon.stub(imageJS, "globalPathFinder").returns(true);

            imageJS = rewire('../image.js');
        });

        afterEach(() => {
            gStub.restore();

            imageJS = rewire('../image.js');
        });

        it('sends \'()\', expects undefined', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType()).to.equal(undefined);
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'(null, \"\")\', expects \"\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType(null, "")).to.equal("");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'(undefined, \"\")\', expects \"\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType(undefined, "")).to.equal("");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'(\"\", \"\")\', expects \"\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType("", "")).to.equal("");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({}, \"\")\', expects \"\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({}, "")).to.equal("");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'(\'\', \"\")\', expects \'\'', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType('', "")).to.equal('');
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'([], \"\")\', expects \"\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType([], "")).to.equal("");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'(5, \"\")\', expects \"\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType(5, "")).to.equal("");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'(\"randomString\", \"\")\', expects \"\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType("randomString", "")).to.equal("");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"noType\": \"randomType\" })\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "noType": "randomType" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"noType\": \"randomType\" })\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "noType": "randomType" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"noType\": \"randomType\" })\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "noType": "randomType" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"randomType\" })\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "randomType" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"icon\", \"img\": \"randomName\" })\', expects true', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "icon", "img": "randomName" }, "randomLoc")).to.be.true;
            expect(gStub.calledOnce).to.be.true;
            expect(gStub.callCount).to.equal(1);
            expect(gStub).to.have.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"cover\" })\', expects true', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "cover" }, "randomLoc")).to.be.true;
            expect(gStub.calledOnce).to.be.true;
            expect(gStub).to.have.returned(true);
            expect(gStub.callCount).to.equal(1);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"albumCover\" })\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "albumCover" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"albumCover\", \"coverImg\": \"randomName\" })\', expects true', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "albumCover", "coverImg": "randomName" }, "randomLoc")).to.be.true;
            expect(gStub.calledOnce).to.be.true;
            expect(gStub).to.have.returned(true);
            expect(gStub.callCount).to.equal(1);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"img\" }, \"randomLoc\")\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "img" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"img\", \"requestedImage\": \"randomRequestedImage\" }, \"randomLoc\")\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "img", "requestedImage": "randomRequestedImage" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"img\", \"albumName\": \"randomName\" }, \"randomLoc\")\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "img", "albumName": "randomName" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"img\", \"requestedImage\": \"randomRequestedImage\", \"albumName\": \"randomName\" }, \"randomLoc\")\', expects true', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "img", "requestedImage": "randomRequestedImage", "albumName": "randomName" }, "randomLoc")).to.be.true;
            expect(gStub.calledOnce).to.be.true;
            expect(gStub.callCount).to.equal(1);
            expect(gStub).to.have.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"ketoPics\" }, \"randomLoc\")\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "ketoPics" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"img\": \"randomImage\" }, \"randomLoc\")\', expects \"randomLoc\"', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "img": "randomImage" }, "randomLoc")).to.equal("randomLoc");
            expect(gStub.called).to.be.false;
            expect(gStub.callCount).to.equal(0);
            expect(gStub).to.have.not.returned(true);
            expect(gStub()).to.equal(true);
        });

        it('sends \'({ \"type\": \"ketoPics\", \"img\": \"randomImage\" }, \"randomLoc\")\', expects true', () => {
            imageJS.__set__('globalPathFinder', gStub);

            expect(imageJS.checkTheType({ "type": "ketoPics", "img": "randomImage" }, "randomLoc")).to.be.true;
            expect(gStub.calledOnce).to.be.true;
            expect(gStub.callCount).to.equal(1);
            expect(gStub).to.have.returned(true);
            expect(gStub()).to.equal(true);
        });
    });
});

/*
    context('theFunc()', () => {
        beforeEach(() => {
            imageJS = rewire('../image');
        });

        afterEach(() => {
            imageJS = rewire('../image');
        });

        it('sends \'()\', expects \"\"', () => {
            //
        });
    });
*/
