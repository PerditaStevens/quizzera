
require('../../../modelMocks');

var root = '../../../../';
var conditionsPath = root + 'api/services/actionHandling/actionConditions/';
var ACTOR_HAS_ENOUGH_RECENT_REPUTATION = require(conditionsPath+'ACTOR_HAS_ENOUGH_RECENT_REPUTATION');

var assert = require('assert');
var sinon = require('sinon');

var Promise = require('bluebird');


describe('ACTOR_HAS_ENOUGH_RECENT_REPUTATION', function () {
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
    var cond;

     describe('#handle', function(){

         beforeEach(function(){
             if(ActionRecord.gatherReputationForUser.restore){
                 ActionRecord.gatherReputationForUser.restore();
             }
         });

         it('throws if no configuration available for given action', function(){
             cond = new ACTOR_HAS_ENOUGH_RECENT_REPUTATION({});
             assert.throws(function(){
                 cond.handle(record);
             });
         });

         it('throws if configuration for action has no reputation constraint', function(){
             cond = new ACTOR_HAS_ENOUGH_RECENT_REPUTATION({
                 VOTE_UP: {}
             });
             assert.throws(function(){
                 cond.handle(record);
             });
         });

         it('throws if configuration for action has no duration constraint', function(){
             cond = new ACTOR_HAS_ENOUGH_RECENT_REPUTATION({
                 VOTE_UP: {
                     reputation: 50
                 }
             });
             assert.throws(function(){
                 cond.handle(record);
             });
         });

         it('throws if duration constraint for action has no valid value', function(){
             cond = new ACTOR_HAS_ENOUGH_RECENT_REPUTATION({
                 VOTE_UP: {
                     reputation: 50,
                     duration: { }
                 }
             });
             assert.throws(function(){
                 cond.handle(record);
             });
             cond = new ACTOR_HAS_ENOUGH_RECENT_REPUTATION({
                 VOTE_UP: {
                     reputation: 50,
                     duration: {
                         value: 'one'
                     }
                 }
             });
             assert.throws(function(){
                 cond.handle(record);
             });

         });

         it('throws if duration constraint for action has no unit', function(){
             cond = new ACTOR_HAS_ENOUGH_RECENT_REPUTATION({
                 VOTE_UP: {
                     reputation: 50,
                     duration: {
                         value: 1,
                     }
                 }
             });
             assert.throws(function(){
                 cond.handle(record);
             });
         });

         it('fails if actor does not have enough recent reputation', function(){
             cond = new ACTOR_HAS_ENOUGH_RECENT_REPUTATION({
                 VOTE_UP: {
                     reputation: 50,
                     duration: {
                         value: 1,
                         unit: 'week'
                     }
                 }
             });
             sinon.stub(ActionRecord, 'gatherReputationForUser', function(){
                 return Promise.resolve(10);
             });
             Promise.resolve(cond.handle(record)).then(function(success){
                 assert.ok(!success);
             });
         });


         it('succeeds if actor has enough reputation', function(){
             cond = new ACTOR_HAS_ENOUGH_RECENT_REPUTATION({
                 VOTE_UP: {
                     reputation: 50,
                     duration: {
                         value: 1,
                         unit: 'week'
                     }
                 }
             });
             sinon.stub(ActionRecord, 'gatherReputationForUser', function(){
                 return Promise.resolve(100);
             });
             Promise.resolve(cond.handle(record)).then(function(success){
                 assert.ok(success);
                 ActionRecord.gatherReputationForUser.restore();
             });
         });


     });
});
