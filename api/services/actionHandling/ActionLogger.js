
var moment = require('moment');

function logActorStats(record){
    switch(record.actionType){
        case 'VOTE_UP':
            return UserStats.findOne({user: record.actor})
            .then(function(stats){
                stats.timesVotedUp++;
                return stats.save();
            });
    }
}

module.exports = {
    handle: function(record){

        return ActionRecord.create(record)
        .then(function(record){
            return UserStats.update({user: record.actor}, {lastActivity: moment().valueOf()});
        })
        .then(function(stats){
            return logActorStats(record);
        })
        .then(function(){
            return record;
        });
    }
};
