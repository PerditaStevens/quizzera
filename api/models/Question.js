/**
* Question.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Promise = require('bluebird');
var moment = require('moment');

module.exports = {
  types: {
      hasEvalFunction: function(data){
          return (data.evalAnswer && typeof data.evalAnswer === 'function');
      }
  },

  attributes: {
      type: {
          type: 'string',
          required: true,
          defaultsTo: 'Question',
          enum: ['Question']
      },
      author: { model: 'User'},
      questionType: {
          type: 'string',
          required: true,
          enum: ['MULTIPLE_CHOICE', 'TRUE_OR_FALSE']
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
          via: 'questions',
          dominant: true
      },
      quizzes: {
          collection: 'Quiz',
          via: 'questions'
      },

      stats: {
          model: 'QuestionStats',
          via: 'question'
      },

      answer: {
          type: 'JSON',
          required: true
      },

      flags: {
          collection: 'Flag',
          //via: 'flags',
          dominant: true
      },


      voteUp: function(){
          var id = this.id;
          var self = this;

          var votesBefore;

          return QuestionStats.findOrCreate({question: id}).then(function(stats){
              stats.question = id;
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

          return QuestionStats.findOrCreate({question: id}).then(function(stats){
              stats.question = id;
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

  beforeCreate: function(question, next){
      question.createdAt = question.updatedAt = moment().valueOf();
      next();
  },
  beforeUpdate: function(question, next){
      question.updatedAt = moment().valueOf();
      next();
  },
  afterCreate: function(question, next) {
      Promise.resolve(  // wrap in bluebird promise for error handling
          QuestionStats.create({question: question.id})
      )
      .then(function(stats){
          // workaround strange behavior when trying to directly save() question object:
          // query it from DB
          return [Question.findOne({id: question.id}), stats];
      })
      .spread(function(question, stats){
          question.stats = stats.id;
          return question.save();
      })
      .then(function(){
          next();
      });

  },

  afterUpdate: function(question, next){
      question.updatedAt = moment(question.updatedAt).valueOf();
      next();
  },

};


