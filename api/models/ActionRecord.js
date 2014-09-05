
var moment = require('moment');
var _ = require('lodash');

module.exports = {

  attributes: {
      actionType: {
          type: 'string',
          required: true,
          enum: _.keys(require('../services/actionHandling/ActionsConfig'))
      },
      actor: {
          model: 'User',
          required: true
      },
      targetType: {
          type: 'string',
          enum: ['Question', 'Quiz']
      },
      // ids of target saved (without waterline associations!)
      // as it could be a Question *OR* Quiz
      target: {
          // note:
          // no integer type enforced due to issues with implicit casting before `beforeValidate`
          // is called when trying to extract id from target object
          type: 'JSON'
      },
      targetOwner: {
          model: 'User'
      },
      rewards: {
          type: 'JSON',
          defaultsTo: {
              actor: 0,
              target: 0,
              targetOwner: 0
          }
      },

      getUserRole: function(user){
          user = _.isUndefined(user.id)? user : user.id;

          if(user === this.actor){
              return 'actor';
          }
          if(user === this.target){
              return 'target';
          }
          if(user === this.targetOwner){
              return 'targetowner';
          }
      },

  },

  beforeValidate: function(action, next){
      // handle targets as both: Instances and IDs
      // (actor is handled implicitly due to association)
      if(action.target && !_.isUndefined(action.target.id)){
          action.targetType = action.target.type;
          action.target = action.target.id;
      }

      // add targetOwner
      // Note: some actions don't have a target
      if(!_.isUndefined(action.target)){
          sails.models[action.targetType.toLowerCase()]
          .findOne(action.target)
          .then(function(_target){
              action.targetOwner = _target.author;
              next();
          });
      } else {
          next();
      }
  },

  beforeCreate: function(action, next){
      // convert createdAt and updatedAt to epoch time for easier querying
      action.createdAt = action.updatedAt = moment().valueOf();
      next();
  },
  beforeUpdate: function(action, next){
      // convert updatedAt to epoch time for easier querying
      action.updatedAt = moment().valueOf();
      next();
  },


};
