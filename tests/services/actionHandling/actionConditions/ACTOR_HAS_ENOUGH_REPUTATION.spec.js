
require('../../../modelMocks');

var root = '../../../../';
var conditionsPath = root + 'api/services/actionHandling/actionConditions/';
var ACTOR_HAS_ENOUGH_REPUTATION = require(conditionsPath+'ACTOR_HAS_ENOUGH_REPUTATION');

var assert = require('assert');
var sinon = require('sinon');

var Promise = require('bluebird');



describe('ACTOR_HAS_ENOUGH_REPUTATION', function () {
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
         it('throws if no configuration available for given action', function(){
             cond = new ACTOR_HAS_ENOUGH_REPUTATION({});
             assert.throws(function(){
                 cond.handle(record);
             });
         });

         it('throws if configuration for action has no reputation constraint', function(){
             cond = new ACTOR_HAS_ENOUGH_REPUTATION({VOTE_UP: {}});
             assert.throws(function(){
                 cond.handle(record);
             });
         });

         it('fails if actor does not have enough reputation', function(){
             cond = new ACTOR_HAS_ENOUGH_REPUTATION({VOTE_UP: {
                 reputation: 50
             }});
             record.actor.stats.reputation = 10;
             var success = cond.handle(record);
             assert.ok(!success);
         });

         it('succeeds if actor has enough reputation', function(){
             cond = new ACTOR_HAS_ENOUGH_REPUTATION({VOTE_UP: {
                 reputation: 50
             }});
             record.actor.stats.reputation = 100;
             var success = cond.handle(record);
             assert.ok(success);
         });

     });
});
