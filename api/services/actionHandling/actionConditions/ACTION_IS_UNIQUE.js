
function ACTION_IS_UNIQUE(actionConstraints){
    this.actionConstraints = actionConstraints;
    if(!this.actionConstraints){
        throw new Error('No action constraints supplied.');
    }
}

ACTION_IS_UNIQUE.prototype.handle = function(actionRecord){
    if(!actionRecord || !actionRecord.actor || !actionRecord.target){
        throw new Error('[ACTION_IS_UNIQUE] needs record with actor and target.');
    }

    return ActionRecord.findOne({
        actionType: actionRecord.actionType,
        actor: actionRecord.actor.id,
        targetType: actionRecord.target.type,
        target: actionRecord.target.id,
    })
    .then(function(record){
        return !record;
    });
};

module.exports = ACTION_IS_UNIQUE;
