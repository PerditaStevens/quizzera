
require('../../../modelMocks');

var root = '../../../../';
var actionsPath = root + 'api/services/actionHandling/actions/';
var modelsPath = root + 'api/models/';
var CREATE_QUESTION = require(actionsPath+'CREATE_QUESTION');
var Quiz = require(modelsPath+'Quiz');

var sinon = require('sinon');

var chai = require('chai');
//var assert = require('assert');
var assert = chai.assert;
var expect = chai.expect;
chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var Promise = require('bluebird');


describe('CREATE_QUESTION', function () {

    beforeEach(function(){
        if(Question.create.restore){
            Question.create.restore();
        }
    });

    it('throws if no question is provided', function(){
        var action = new CREATE_QUESTION();
        var promise = Promise.resolve()
        .then(function(){
            return action.handle({});
        });
        return promise.should.be.rejected;
    });

    it('succeeds when valid question is provided', function(){
        sinon.stub(Question, 'create', function(){
            return Promise.resolve(true);
        });
        var action = new CREATE_QUESTION();
        var promise = Promise.resolve()
        .then(function(){
            return action.handle({
                actor: {id: 1},
                data: {
                    question: {
                        questionType: 'TRUE_OR_FALSE',
                        title: 'My title',
                        description: 'my description',
                    }
                }
            });
        });
        return promise.should.be.fulfilled;
    });


    it('fails when error occurs while creation', function(){
        sinon.stub(Question, 'create', function(){
            return Promise.resolve().then(function(){
                throw new Error('(Mocked!) error occurred while creating quesiton.');
            });
        });
        var action = new CREATE_QUESTION();
        var promise = Promise.resolve()
        .then(function(){
            return action.handle({
                actor: {id: 1},
                data: {
                    question: {
                        questionType: 'TRUE_OR_FALSE',
                        title: 'My title',
                        description: 'my description',
                    }
                }
            });
        });
        return promise.should.be.rejected;
    });


});

