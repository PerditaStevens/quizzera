
_ = require('lodash');
Promise = require('bluebird');

function FLAG(config){
    this.config = config || {};
}
FLAG.prototype.handle = function(record){
//    if(!record.target || !_.isFunction(record.target.voteUp)){
//        //throw new Error('Expecting instance of ActionTarget with voteUp method.');
//        return Promise.reject(new Error('Expecting instance of ActionTarget with voteUp method.'));
//    }

    return Promise.resolve(
        Flag.create({
            user: record.actor,
            type: record.data.type,
            reason: record.data.reason
        })
    )
    .then(function(flag){
        console.log('>> Created flag:', flag);

        //sails.models[record.targetType].update
        return sails.models[record.targetType]
        .findOne(record.target.id)
        .populate('flags')
        .then(function(targ){
            console.log('[[[[[TARGET]]]]]', targ);
            targ.flags.add(flag);
            return Promise.resolve(targ.save());
        })
        .then(function(targ){
            console.log('[[[[[UPDATED: TARGET]]]]]', targ);
            return true;
        });
        //record.target.flags.push
        //return true;
    });
    //.catch(function(err){
        //sails.error(err);
    //});

};

module.exports = FLAG;
