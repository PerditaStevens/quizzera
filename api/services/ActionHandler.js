var Promise = require('bluebird');
Promise.longStackTraces();

var ActionFactory = require('./actionHandling/ActionFactory');
var ActionConditionFactory = require('./actionHandling/ActionConditionFactory');
var ReputationSystem = require('./actionHandling/ReputationSystem');
var ActionLogger = require('./actionHandling/ActionLogger');


function validateAction(record){
    var conditionNames = _.keys(ActionFactory.getAction(record.actionType).config.conditions);
    var conditions = _.map(conditionNames, function(condition){
        return ActionConditionFactory
        .getActionCondition(condition)
        .handle(record);
    });

    return Promise.all(conditions)
    .then(function(results){
        var failed = [];
        _.each(results, function(success, i){
            if(!success) { failed.push(conditionNames[i]); }
        });
        var result = {
            success: _.chain(results).every().value(),
            fails: failed
        };
        if(!result.success){
            return Promise.reject(new Errors.ActionValidationError('Validation(s) failed', {
                fails: failed
            }));
        } else {
            return true;
        }
    });
}

function executeAction(record){
    return ActionFactory.getAction(record.actionType).handle(record);
}

function rewardAction(record){
    return ReputationSystem.handle(record);

}

function logAction(record){
    //return ActionRecord.create(_.clone(record));
    return ActionLogger.handle(record);
}

// ================================================================================ 
// 
function populateUserAndTarget(record){
    var user = User.findOne(record.actor)
        .populate('stats')
        .populate('questions')
        .populate('quizzes');

    // allow for ActionRecords that don't have a target
    var target;
    if(record.target){
        target = sails.models[record.targetType.toLowerCase()]
        .findOne(record.target)
        .populate('stats')
        .populate('author')
        .populate('tags');
    }

    return Promise.join(user, target).spread(function(user, target){
        record.actor = user;
        record.target = target;
        return record;
    })
    .catch(function(err){
        sails.log.error(err);
    });
}

module.exports = {
    /**
     * @class ActionHandler())
     * @method handle
     * @static
     *
     * Takes in an ActionRecord and passes it through the action handling pipeline.
     *
     * @param record {ActionRecord}
     * @param record.actionType {ActionType}
     * @param record.actor {int} userId
     * @param record.targetType {TargetType}
     * @param record.target {int} targetId
     * @param record.data {Object} arbitrary action relevant data
     * 
     * @return {ActionReport} TODO: or maybe just boolean or throw Error?
     */
    handle: function(record){
        return populateUserAndTarget(record).then(function(record){
            // start pipeline in sequential (!) order
            // > passing `result` from previous stage to next stage
            return Promise.reduce([
                validateAction,
                executeAction,
                rewardAction,
                logAction
            ], function(results, handler) {
                return Promise.resolve(handler(record)).then(function(result){
                    // Note: it might be that the target only gets set after execution
                    // TODO: handle more elegantly?
                    if(result && _.isFinite(result.target)){
                        record.target = result.target;
                    }
                    results.push(result);
                    return results;
                });
            }, [])
            .spread(function(validation, execution, rewarding, logging){
                return {
                    success: true,
                    data: logging
                };
            })
            .catch(Errors.ActionValidationError, function(err){
                var result = {
                    success: false,
                    fails: err.fails,
                    messages: []
                };
                _.each(result.fails, function(cond){
                    result.messages.push(sails.__(record.actionType+'.FAIL.'+cond, record.targetType));
                });

                return result;
            });

        });

    }
};
