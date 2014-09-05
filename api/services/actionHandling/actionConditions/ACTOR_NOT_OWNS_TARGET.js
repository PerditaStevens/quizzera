
function ACTOR_NOT_OWNS_TARGET(actionConstraints){
    this.actionConstraints = actionConstraints;
    if(!this.actionConstraints){
        throw new Error('No action constraints supplied.');
    }
}

ACTOR_NOT_OWNS_TARGET.prototype.handle = function(record){
    if(!record.target){
        throw new Error('[ACTOR_NOT_OWNS_TARGET] action record needs target');
    }
    return (record.actor.id !== record.target.author.id);
};

module.exports = ACTOR_NOT_OWNS_TARGET;
