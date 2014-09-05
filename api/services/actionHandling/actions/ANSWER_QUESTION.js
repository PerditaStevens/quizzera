
_ = require('lodash');
Promise = require('bluebird');

function ANSWER_QUESTION(config){
    this.config = config || {};
}
ANSWER_QUESTION.prototype.handle = function(record){
    //if(!record.target || !_.isFunction(record.target.voteDown)){
        //throw new Error('Expecting instance of ActionTarget with voteDown method.');
    //}

    var result;

    switch(record.target.questionType){
        case 'MULTIPLE_CHOICE':
            result = handleMultipleChoice(record.target, record.data.answer);
            break;
        case 'TRUE_OR_FALSE':
            result = handleTrueOrFalse(record.target, record.data.answer);
            break;
        default:
            throw new Error('No such question type:'+record.target.questionType);
    }

    // if question is answered in context of a quizSession
    if(record.data.quizSession){
        return QuizSession.findOne({
            user: record.actor.id,
            quiz: record.data.quizSession.quiz.id || record.data.quizSession.quiz
        }).then(function(qSession){
            // TODO: puplishUpdate
            qSession.answers[record.target.id] = {
                answer: record.data.answer, // userAnswer
                answerCorrect: result.correct,
                correctAnswer: record.target.answer
            };

            return QuizSession
            .isCompleted(qSession)
            .then(function(isCompleted){
                qSession.completed = isCompleted;
                return qSession.save().then(function(){
                    return result;
                });
            });

        });
    } else {
        return result;
    }

//    return Promise.resolve(record.target.voteDown())
//    .then(function(success){
//        if(!success){
//            Promise.reject(new Error('[VOTE_DOWN] failed'));
//        } else {
//            return true;
//        }
//    });

};

function handleTrueOrFalse(question, answer){
    var result = {
        correct: (question.answer.isTrue === answer.isTrue),
        chosenOption: answer.isTrue,
        correctOption: question.answer.isTrue
    };

    return result;
}

function handleMultipleChoice(question, answer){
    var result = {
        correct: (question.answer.correctOption === answer.correctOption),
        chosenOption: answer.correctOption,
        correctOption: question.answer.correctOption
    };

    return result;
}


module.exports = ANSWER_QUESTION;
