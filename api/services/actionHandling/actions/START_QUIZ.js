

Promise = require('bluebird');

function START_QUIZ(config){
    this.config = config || {};
}

START_QUIZ.prototype.handle = function(record){
    return Promise.resolve().then(function(){
        return QuizSession.create({
            user: record.actor.id,
            quiz: record.target.id || record.target,
            answers: {}
        });
    });
};

module.exports = START_QUIZ;

