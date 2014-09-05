/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var moment = require('moment');

module.exports = {


  // Enforce model schema in the case of schemaless databases
  //schema: true,

  attributes: {
      username: {
          type: 'string',
          required: true,
          unique: true
      },
      email: {
          type: 'email',
          required: true,
          unique: true
      },
      passports : { collection: 'Passport', via: 'user' },
      thumbnailUrl: {
          type: 'string',
          defaultsTo: '/images/user/placeholder.png'
      },

      community: {  // e.g. University of Edinburgh
          type: 'string'
      },

      stats: {
          //type: 'json',
          //defaultsTo: {}
          model: 'UserStats',
          via: 'user'
      },

      questions: {
          collection: 'Question',
          via: 'author'
      },
      quizzes: {
          collection: 'Quiz',
          via: 'author'
      },

      quizSessions: {
          collection: 'QuizSession',
          defaultsTo: []
      },

      // Override toJSON instance method to remove password value
      // if user is sent to client, he won't receive password
      toJSON: function() {
          var obj = this.toObject();
          delete obj.passports;
          delete obj.email;
          return obj;
      }
  },

  beforeCreate: function(user, next){
      if(!user.thumbnailUrl){
          user.thumbnailUrl = '/images/user/placeholder.png';
      }
      user.createdAt = user.updatedAt = moment().valueOf();
      next();
  },

  beforeUpdate: function(user, next){
      user.updatedAt = moment().valueOf();
      next();
  },

  afterCreate: function(user, next){
      UserStats.create({user: user}).then(function(stats){
          user.stats = stats.id;
          User.update(user.id, user).then(function(){
              next();
          })
          .fail(function(err){
              sails.log.error(err);
              next();
          });
      })
      .fail(function(err){
          sails.log.error(err);
          next();
      });
  },


  /**
   * @method populateWithUserStats
   *
   * 
   * NOTE: this only works with objects that hold **AUTHOR IDS**!
   * NOTE: works on reference of the users, so no reassigning necessary
   *
   */
  populateWithUserStats: function(data, primaryKey){
      primaryKey = primaryKey || 'author';

      var errMsg = 'Need list of objects with "'+primaryKey+'" attribute that is a User instance';
      if(!data){
          throw new Errors.ParameterError(__filefn+errMsg);
      }


      data = _.isArray(data)? data : data? [data] : [];
      var users = _.pluck(data, primaryKey);


      var validUsers = _.every(users, function(user){
          if(!user){
              return false;
          }
          return _.has(user, 'id');
      });
      if(!validUsers){
          throw new Errors.ParameterError(__filefn+errMsg);
      }
      return this.populateWithStats(users).then(function(users){
          return data;
      });
  },

  // NOTE: this only works with User *objects* that hold a **STATS ID**!
  // NOTE: works on reference of the users, so no reassigning necessary
  populateWithStats: function(users){
      var errMsg = '[populateWithStats] Need list of User instances';
      users = _.isArray(users)? users : [users];

      var validUsers = _.every(users, function(user){
          if(!user){
              return false;
          }
          return _.has(user, 'id');
      });
      if(!validUsers){
          throw new Errors.ParameterError(__filefn+errMsg);
      }

      var authorIds = _.chain(users).pluck('id').uniq().value();

      return UserStats.find({user: authorIds}).then(function(stats){
          var statsById = _.indexBy(stats, 'id');
          _.each(users, function(user){
              user.stats = statsById[user.stats];
          });
          return users;
      });
  }
};

