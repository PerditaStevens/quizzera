
_ = require('lodash');
Promise = require('bluebird');

function VOTE_DOWN(config){
    this.config = config || {};
}
VOTE_DOWN.prototype.handle = function(record){
    if(!record.target || !_.isFunction(record.target.voteDown)){
        throw new Error('Expecting instance of ActionTarget with voteDown method.');
    }
    return Promise.resolve(record.target.voteDown())
    .then(function(success){
        if(!success){
            Promise.reject(new Error('[VOTE_DOWN] failed'));
        } else {
            return true;
        }
    });

};

module.exports = VOTE_DOWN;
