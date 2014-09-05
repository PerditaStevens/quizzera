
var Promise = require('bluebird');
var configs = require('./ActionsConfig');

module.exports = {
    handle: function handle(record){
        var rewards = configs[record.actionType].rewards || {};

        // TODO:
        // just populate target and actor with stats beforehand?
        // ===============================================

        record.rewards = {};

        var promises = [];
        if(rewards.actor){
            var userStats = UserStats.findOne({user: record.actor.id})
            .then(function(stats){
                stats.reputation += rewards.actor;
                record.rewards.actor = rewards.actor;
                return Promise.resolve(stats.save());
            });
            promises.push(userStats);
        }

        if(rewards.target){
            var targetType = record.targetType.toLowerCase();
            var query = {};
            query[targetType] = record.target.id;
            var targetStats = sails.models[targetType+'stats']
            .findOne(query)
            .then(function(stats){
                stats.reputation += rewards.target;
                record.rewards.target = rewards.target;
                return Promise.resolve(stats.save());
            });
            promises.push(targetStats);
        }

        if(rewards.targetOwner){
            var targetOwnerStats = User.findOne(record.target.author.id)
            .then(function(user){
                return UserStats.findOne({user: user.id});
            })
            .then(function(stats){
                stats.reputation += rewards.targetOwner;
                record.rewards.targetOwner = rewards.targetOwner;
                return Promise.resolve(stats.save());
            });
            promises.push(targetOwnerStats);
        }

        return Promise.all(promises).return({});  // return nothing
    }
};
