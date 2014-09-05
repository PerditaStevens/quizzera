/**
* Tag.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var q = require('q');
var Promise = require('bluebird');
var moment = require('moment');

module.exports = {

  attributes: {
      text: {
          type: 'string',
          required: true,
          unique: true
      },

      questions: {
          collection: 'Question',
          via: 'tags'
      },
      quizzes: {
          collection: 'Quiz',
          via: 'tags'
      }
  },

  beforeCreate: function(obj, next){
      obj.createdAt = obj.updatedAt = moment().valueOf();
      next();
  },
  beforeUpdate: function(obj, next){
      obj.updatedAt = moment().valueOf();
      next();
  },

  /**
   * Returns a promise that resolves to the number of times
   * the given tag was used.
   * 
   * @param {Tag|string} tag
   * @return {Promise<int>} count
   *
   */
  queryTimesUsed: function(tag){
      var query;
      return Promise.resolve().then(function(){
          // Handle tag as string or id
          tag = _.isString(tag)? tag : tag.text;
          tag = _.isString(tag)? tag : tag.id;

          query = Tag.findOne()
          .populate('questions')
          .populate('quizzes');

          if(_.isString(tag)){
              query.where({text: tag});
          } else {
              query.where({id: tag});
          }
          return query;
      })
      .then(function(tag){
          return (tag.questions.length + tag.quizzes.length);
      });
  },

  /**
   * @method findOrCreateTags
   * @static
   * 
   * @param tags {Tag} handles single tags objects
   * @param tags {String} handles single strings
   * @param tags {Array} mixed array of strings and {text: String} objects
   *
   * @return {Promise<Tag[]>} array of Tag instances
   */
  findOrCreateAll: function(tags){
      tags = _.isArray(tags)? tags : [tags];
      tags = _.map(tags, function(tag){
          if(_.isFinite(tag)){
              throw new Error('need to provide tags as Tag objects {text: String} or plain text.');
          }
          tag = _.isString(tag)? {text: tag} : _.pick(tag, 'text');
          return tag;
      });

      // Note: run in sequence to prevent db conflicts when same tags occur multiple times
      return Promise.reduce(tags, function(_tags, tag){
          return Tag.findOrCreate(tag, tag).then(function(tag){
              _tags.push(tag);
              return _tags;
          });
      }, []);
  },

};
