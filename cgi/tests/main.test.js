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