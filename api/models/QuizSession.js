/**
* QuizSession.js
*
* @description :: Represents a Quiz that is undertaken by a user. Completion, answers and stats are tracked.
* 
*/

var moment = require('moment');

module.exports = {

  attributes: {
      user: {
          model: 'User',
          required: true
      },
      quiz: {
          model: 'Quiz',
          required: true
      },
      completed: {
          type: 'boolean',
          defaultsTo: false
      },

      /*
       * Represents the answers to the questions of a quiz.
       * Questions are referenced by id as key of the object.
       * Only questions that were answered by the user within the quiz
       * are included.
       *
       * @example
       *    {
       *        3: {
       *            answer: { isTrue: false },
       *            answerCorrect: false
       *        },
       *        11: {
       *            answer: { correctOption: 1},
       *            answerCorrect: true
       *        },
       *    }
       */
      answers: {
          type: 'json',
          defaultsTo: {}
      },

      // questionOrder
      // questions
  },

  beforeCreate: function(obj, next){
      obj.createdAt = obj.updatedAt = moment().valueOf();
      next();
  },
  afterUpdate: function(obj, next){
      obj.updatedAt = moment().valueOf();
      next();
  },
  afterCreate: function(obj, next){
      User.findOne(obj.user).then(function(user){
          user.quizSessions.add(obj.id);
          user.save().then(function(){
              next();
          });
      });
  },

  /**
   * Whether all questions of QuizSession are asnwered yet.
   *
   * @param {QuizSession} qsession
   * @return {Promise<boolean>} isCompleted whether QuizSession is completed
   * 
   */
  isCompleted: function(qSession){
      var quizId = _.isObject(qSession.quiz)? qSession.quiz.id : qSession.quiz;

      return Quiz.findOne()
      .where({id: quizId})
      .populate('questions')
      .then(function(quiz){
          var numAnswers = _.keys(qSession.answers).length;
          var numQuestions = quiz.questions.length;
          return (numAnswers >= numQuestions);
      });

  }

};

