
_ = require('lodash');

function ACTOR_HAS_ENOUGH_REPUTATION(actionConstraints){
    this.actionConstraints = actionConstraints || {};
}

ACTOR_HAS_ENOUGH_REPUTATION.prototype.handle = function(actionRecord){
    var constraints = this.actionConstraints[actionRecord.actionType];
    if(!constraints || !_.isFinite(constraints.reputation)){
        throw new Error('[ACTOR_HAS_ENOUGH_REPUTATIO] No valid configuration for action '+actionRecord.actionType);
    }
    var actorReputation = actionRecord.actor.stats.reputation;

    var reputationNeeded = constraints.reputation;
    return (actorReputation >= reputationNeeded);
};

module.exports = ACTOR_HAS_ENOUGH_REPUTATION;
