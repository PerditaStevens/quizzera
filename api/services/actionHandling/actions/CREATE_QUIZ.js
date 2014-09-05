
Promise = require('bluebird');

function CREATE_QUIZ(config){
    this.config = config || {};
}

CREATE_QUIZ.prototype.handle = function(record){
    var quiz;
    if(!record.data || !record.data.quiz){
        throw new Error('[CREATE_QUIZ] no quiz provided.');
    }

    quiz = _.clone(record.data.quiz);

    quiz.author = record.actor.id;

    var questionsPromises = _.map(quiz.questions, function(question){
        if(!_.isUndefined(question.id)){
            // existing question provided 
            question = question.id;
        }
        if(_.isFinite(question)){
            // question provided as id
            return Question.findOne(question);
        }

        var questionRecord = {
            actionType: 'CREATE_QUESTION',
            actor: _.clone(record.actor.id),
            targetType: 'Question',
            data: {
                question: question
            }
        };
        return ActionHandler.handle(questionRecord).then(function(result){
            return Question.findOne(result.data.target);
        });
    });

    var taggedQuizPromise = Tag.findOrCreateAll(quiz.tags)
    .then(function(tags){
        quiz.tags = _.pluck(tags, 'id');
        return quiz;
    });

    return Promise.join(taggedQuizPromise, Promise.all(questionsPromises)).spread(function(quiz, questions){
        quiz.questions = _.pluck(questions, 'id');
        return quiz;
    })
    .then(Quiz.create)
    .then(function(quiz){
        record.target = quiz.id;
        return record;
    })
    .catch(function(err){
        sails.log.error(err);
        return Promise.reject('Oops, something went wrong. quiz was not created.');
    });
};

module.exports = CREATE_QUIZ;
