
var conditions = {
    ACTION_IS_UNIQUE: require('./actionConditions/ACTION_IS_UNIQUE'),
    ACTOR_NOT_OWNS_TARGET : require('./actionConditions/ACTOR_NOT_OWNS_TARGET'),
    ACTOR_HAS_ENOUGH_REPUTATION: require('./actionConditions/ACTOR_HAS_ENOUGH_REPUTATION'),
    ACTOR_HAS_ENOUGH_RECENT_REPUTATION: require('./actionConditions/ACTOR_HAS_ENOUGH_RECENT_REPUTATION')
};
var configs = require('./ActionsConfig');

// cache action instances
var cache = {};



function extractActionConstraintsForCondition(conditionName){
    var constraints = {},
        conditions;
    _.each(configs, function(actionConfig, actionType){
        conditions = actionConfig.conditions;
        if(conditions){
            constraints[actionType] = conditions[conditionName] || {};
        }
    });
    return constraints;
}


module.exports = {
    getActionCondition: function(type){
        var condition = cache[type];
        if(condition){
            return cache[type];
        } else {
            condition = conditions[type];
            if(!condition){
                throw new Error('No such actionCondition found: '+type);
            }

            cache[type] = new condition(extractActionConstraintsForCondition(type));
            return  cache[type];
        }
    }
};
