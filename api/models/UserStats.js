/**
* UserStats.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var moment = require('moment');

module.exports = {

  attributes: {

      user: {
          model: 'User',
          via: 'stats'
      },
      lastActivity: {
          type: 'integer',
          defaultsTo: moment().valueOf()
      },
      reputation: {
          type: 'integer',
          defaultsTo: 0
      },
      timesVotedUp: {
          type: 'integer',
          defaultsTo: 0
      },
      timesVotedDown: {
          type: 'integer',
          defaultsTo: 0
      },
  },

  beforeCreate: function(obj, next){
      obj.createdAt = obj.updatedAt = moment().valueOf();
      next();
  },
  beforeUpdate: function(obj, next){
      obj.updatedAt = moment().valueOf();
      next();
  }
};

