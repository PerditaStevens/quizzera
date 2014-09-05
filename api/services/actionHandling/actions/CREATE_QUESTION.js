
Promise = require('bluebird');

function CREATE_QUESTION(config){
    this.config = config || {};
}

CREATE_QUESTION.prototype.handle = function(record){
    var question;
    if(!record.data || !record.data.question){
        throw new Error('[CREATE_QUESTION] no question provided.');
    }

    question = _.clone(record.data.question);

    question.author = record.actor.id;

    // TODO:
    // handle constraints for different questionTypes,
    // e.g. MULTIPLE_CHOICE:
    //  > has min. 2 choices
    //  > has attribute correctOption, which "points" to one of the choices


    return Tag.findOrCreateAll(question.tags)
    .then(function(tags){
        question.tags = _.pluck(tags, 'id');
        return question;
    })
    .then(Question.create)
    .then(function(question){
        record.target = question.id;
        return record;
    })
    .catch(function(err){
        sails.log.error(err);
        return Promise.reject('Oops, something went wrong. Question was not created.');
    });
};

module.exports = CREATE_QUESTION;
