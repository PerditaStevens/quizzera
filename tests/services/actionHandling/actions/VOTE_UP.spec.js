
require('../../../modelMocks');

var root = '../../../../';
var actionsPath = root + 'api/services/actionHandling/actions/';
var modelsPath = root + 'api/models/';
var VOTE_UP = require(actionsPath+'VOTE_UP');
var Question = require(modelsPath+'Question');
var Quiz = require(modelsPath+'Quiz');

var sinon = require('sinon');

var chai = require('chai');
//var assert = require('assert');
var assert = chai.assert;
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var Promise = require('bluebird');


describe('VOTE_UP', function () {
    var record = {
        actionType: 'VOTE_UP',
        actor: {
            id: 1,
            stats: {
                reputation: 0
            }
        },
        target: {
            type: 'Question',
            id: 1
        }
    };
    var action = new VOTE_UP();

     describe('#handle', function(){

         beforeEach(function(){
             //if(ActionRecord.gatherReputationForUser.restore){
                 //ActionRecord.gatherReputationForUser.restore();
             //}
         });

         it('throws if record does not have target with voteUp method', function(){
             assert.throws(function(){
                 action.handle({});
             });
             assert.throws(function(){
                 action.handle({
                     target: {voteUp: 'not a function'}
                 });
             });
         });

         it('throws if votes didn\'t increase after handling', function(){
             return expect(Promise.resolve(
                 action.handle({
                 target: {
                     stats: {
                         votes: 0
                     },
                     voteUp: function(){
                         this.stats.votes--;
                     }
                 }
             })
             )).to.eventually.be.rejected;
         });

         it('succeeds if votes did increase after handling', function(){
             return expect(Promise.resolve(
                 action.handle({
                 target: {
                     stats: {
                         votes: 0
                     },
                     voteUp: function(){
                         this.stats.votes++;
                     }
                 }
             })
             )).to.eventually.be.fulfilled;
         });
     });
});
