
var moment = require('moment');

function ACTOR_HAS_ENOUGH_RECENT_REPUTATION(actionConstraints){
    this.actionConstraints = actionConstraints;
    if(!this.actionConstraints){
        throw new Error('No action constraints supplied.');
    }
}

ACTOR_HAS_ENOUGH_RECENT_REPUTATION.prototype.handle = function(record){
    var constraints = this.actionConstraints[record.actionType];
    if(!constraints
        || !_.isFinite(constraints.reputation)
        || !constraints.duration
        || !_.isFinite(constraints.duration.value)
        || !constraints.duration.unit
      ){
        throw new Error('[ACTOR_HAS_ENOUGH_RECENT_REPUTATIO] No valid configuration for action '+record.actionType);
    }

    var minEpochTime = moment().subtract(moment.duration(
        constraints.duration.value,
        constraints.duration.unit
    )).valueOf();
    var reputationNeeded = constraints.reputation;


    // Find all actions where current actor was involved
    //  TODO: in separate method?
    var recordsPromise = ActionRecord.find({
        or: [
            {actor: record.actor.id},
            {targetOwner: record.actor.id}
        ]
    })
    .where({
        createdAt: {
            greaterThanOrEqual: minEpochTime
        }
    });

    var success = Promise.resolve(recordsPromise).then(function(records){
        var earned = 0;
        _.each(records, function(_record){
            var role = _record.getUserRole(record.actor);
            earned += _record.rewards[role] || 0;
        });
        return earned;
    })
    .then(function(earned){
        return (earned >= reputationNeeded);
    });

    return success;
};

module.exports = ACTOR_HAS_ENOUGH_RECENT_REPUTATION;
