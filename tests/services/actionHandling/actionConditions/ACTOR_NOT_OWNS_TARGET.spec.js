
//require('../../../before');
require('../../../modelMocks');


var root = '../../../../';
var conditionsPath = root + 'api/services/actionHandling/actionConditions/';
var ACTOR_NOT_OWNS_TARGET= require(conditionsPath+'ACTOR_NOT_OWNS_TARGET');

var assert = require('assert');
var sinon = require('sinon');

var Promise = require('bluebird');

describe('ACTOR_NOT_OWNS_TARGET', function () {
     describe('#handle', function(){
         var cond = new ACTOR_NOT_OWNS_TARGET({});

         it('fails if actor id is same as target owner id', function(){
             var success = cond.handle({
                 actor: {id: 1},
                 target: {author: {id: 1}}
             });
             assert.ok(!success);
         });

         it('succeeds if actor id different from target owner id', function(){
             var success = cond.handle({
                 actor: {id: 1},
                 target: {author: {id: 2}}
             });
             assert.ok(success);
         });

     });
});
