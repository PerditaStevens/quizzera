/**
* Quiz.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var moment = require('moment');
module.exports = {

  attributes: {
      author: { model: 'User' },
      type: {
          type: 'string',
          required: true,
          defaultsTo: 'Quiz',
          enum: ['Quiz']
      },
      title: {
          type: 'string',
          required: true
      },
      description: {
          type: 'string',
          required: true
      },

      tags: {
          collection: 'Tag',
          via: 'quizzes',
          dominant: true
      },
      questions: {
          collection: 'Question',
          via: 'quizzes',
          dominant: true
      }, 

      stats: {
          model: 'QuizStats',
          via: 'quiz'
      },
      voteUp: function(){
          var id = this.id;
          var self = this;

          var votesBefore;

          return QuizStats.findOrCreate({quiz: id}).then(function(stats){
              stats.quiz = id;
              votesBefore = stats.votes;
              stats.votes++;
              self.stats = stats.id;
              self.save();
              return stats.save();
          })
          .then(function(stats){
              if(votesBefore < stats.votes){
                  return true;
              } else {
                  return false;
              }
          });
      },

      voteDown: function(){
          var id = this.id;
          var self = this;

          var votesBefore;

          return QuizStats.findOrCreate({quiz: id}).then(function(stats){
              stats.quiz = id;
              votesBefore = stats.votes;
              stats.votes--;
              self.stats = stats.id;
              self.save();
              return stats.save();
          })
          .then(function(stats){
              if(votesBefore > stats.votes){
                  return true;
              } else {
                  return false;
              }
          });
      },

  },



  createOrUpdate: function(quiz){
      return Quiz.findOne({id: quiz.id})
      .then(function(_quiz){
          if(_quiz){
              //promise = Quiz.update(quiz);
              return Quiz.update(quiz);
          } else {
              //promise = Quiz.create(quiz);
              return Quiz.create(quiz);
          }
      })
      .fail(function(err){
          sails.log.error(err);
          res.json(err);
      }) 
  },


  beforeCreate: function(quiz, next){
      quiz.createdAt = quiz.updatedAt = moment().valueOf();
      next();
  },
  beforeUpdate: function(quiz, next){
      quiz.updatedAt = moment().valueOf();
      next();
  },

  afterCreate: function(quiz, next) {
      Promise.resolve(  // wrap in bluebird promise for error handling
          QuizStats.create({quiz: quiz.id})
      )
      .then(function(stats){
          // workaround strange behavior when trying to directly save() quiz object:
          // query it from DB
          return [Quiz.findOne({id: quiz.id}), stats];
      })
      .spread(function(quiz, stats){
          quiz.stats = stats.id;
          return quiz.save();
      })
      .then(function(){
          next();
      });

  },


};

