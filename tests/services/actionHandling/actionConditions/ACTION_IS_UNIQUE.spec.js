
//require('../../../before');

require('../../../modelMocks');

var root = '../../../../';
var conditionsPath = root + 'api/services/actionHandling/actionConditions/';
var ACTION_IS_UNIQUE = require(conditionsPath+'ACTION_IS_UNIQUE');

var assert = require('assert');
var sinon = require('sinon');

var Promise = require('bluebird');



describe('ACTION_IS_UNIQUE', function () {
    describe('on instantiation', function () {
        it('throws an Error if no actionConstraints are provided', function(){
            assert.throws(function(){
                new ACTION_IS_UNIQUE();
            });
        });

        it('has instance attibute `actionConstraints` if it was provided at instantiation', function(){

            var cond = new ACTION_IS_UNIQUE({});
            assert.ok(cond.actionConstraints);
        });
    });

    describe('#handle (Exceptions)', function(){
        var cond = new ACTION_IS_UNIQUE({});
        it('throws an Error if no ActionRecord is provided', function(){
            assert.throws(cond.handle);
        });
        it('throws an Error if ActionRecord is missing actor', function(){
            assert.throws(function(){
                cond.handle({target: {}});
            });
        });
        it('throws an Error if ActionRecord is missing target', function(){
            assert.throws(function(){
                cond.handle({actor: {}});
            });
        });
    });

     describe('#handle', function(){
         var cond = new ACTION_IS_UNIQUE({});
         var record = {
             actionType: 'VOTE_UP',
             actor: { id: 1 },
             target: {
                 type: 'Question',
                 id: 1
             }
         };

         afterEach(function(){
             // restore if it was wrapped
             if(ActionRecord.findOne.restore){
                 ActionRecord.findOne.restore();
             }
         });

         it('succeeds if no such ActionRecord exists already', function(){
             sinon.stub(ActionRecord, 'findOne', function(){
                 return Promise.resolve();
             });

             cond.handle(record).then(function(success){
                 assert.ok(success);
             });
         });

         it('fails if same ActionRecord exists already', function(){
             sinon.stub(ActionRecord, 'findOne', function(){
                 return Promise.resolve({omg: 'yeah'});
             });

             cond.handle(record).then(function(success){
                 assert.ok(!success);
             });
         });

     });
});
