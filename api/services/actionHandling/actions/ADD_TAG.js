
_ = require('lodash');
Promise = require('bluebird');

function ADD_TAG(config){
    this.config = config || {};
}
ADD_TAG.prototype.handle = function(record){
//    if(!record.target || !_.isFunction(record.target.voteUp)){
//        //throw new Error('Expecting instance of ActionTarget with voteUp method.');
//        return Promise.reject(new Error('Expecting instance of ActionTarget with voteUp method.'));
//    }

    var tag = {
        text: record.data.tag
    };
    return Promise.resolve(
        Tag.findOrCreate(tag, tag)
    )
    .then(function(tag){

        //sails.models[record.targetType].update
        return sails.models[record.targetType]
        .findOne(record.target.id)
        .populate('tags')
        .then(function(targ){
            targ.tags.add(tag);
            return Promise.resolve(targ.save());
        })
        .then(function(targ){
            return true;
        });
    });
    //.catch(function(err){
        //sails.error(err);
    //});

};

module.exports = ADD_TAG;
