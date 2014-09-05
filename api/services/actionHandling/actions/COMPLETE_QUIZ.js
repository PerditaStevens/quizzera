

Promise = require('bluebird');

function COMPLETE_QUIZ(config){
    this.config = config || {};
}

COMPLETE_QUIZ.prototype.handle = function(record){
    // TODO:
    //  check if all questions were answered!
    return Promise.resolve().then(function(){
        return QuizSession.update({
            user: record.actor.id,
            quiz: record.target.id || record.target
        },{
            completed: true
        });
    });
};

module.exports = COMPLETE_QUIZ;

