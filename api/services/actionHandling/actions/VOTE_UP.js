
_ = require('lodash');
Promise = require('bluebird');

function VOTE_UP(config){
    this.config = config || {};
}
VOTE_UP.prototype.handle = function(record){
    if(!record.target || !_.isFunction(record.target.voteUp)){
        //throw new Error('Expecting instance of ActionTarget with voteUp method.');
        return Promise.reject(new Error('Expecting instance of ActionTarget with voteUp method.'));
    }
    return Promise.resolve(record.target.voteUp())
    .then(function(success){
        if(!success){
            Promise.reject(new Error('[VOTE_UP] failed'));
        } else {
            return true;
        }
    });

};

module.exports = VOTE_UP;
