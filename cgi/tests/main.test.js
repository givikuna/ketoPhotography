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

describe('main.js', () => {
    //
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