/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

Promise = require('bluebird');
module.exports = {



    /**
     * @method users
     * @route /users
     *
     * Query all users with the following optional query parameters
     *
     * @param {boolean}  count    counts the results if ?count=true (ignores pagination!)
     * @param {string}   search   searches users by usernames
     * @param {csv}      populate comma separated list of user attributes to populate
     * @param {int}      page     return paginated results
     * @param {int}      limit    return paginated results
     *
     * @return {Array<User>}      users that match query
     * @return {count: int}       if count=true was supplied
     */
    users: function(req, res){
        var params = restQueryBuilder.parseParams(req);
        var query;

        // NOTE: wrap whole query with bluebird for better promises & error handing
        Promise.resolve()
        .then(function(){
            if(params.count){
                query = User.count(params.id);
            } else {
                query = User.find(params.id);
            }

            //query = restQueryBuilder.countHook(query, params);

            query = restQueryBuilder.textSearchHook(query, params, 'user');
            if(!params.count){
                query = restQueryBuilder.populateDefaultAttributesHook(query, params, 'user');
                query = restQueryBuilder.populateAttributes(query, params.populate);
                query = restQueryBuilder.paginationHook(query, params);
                query = restQueryBuilder.sortHook(query, params, {createdAt: 'desc'});
            }
            return query;
        })

        .then(function(data){
            if(_.isFinite(data)){
                data = {count: data};
            }
            res.json(data);
        })

        .catch(function(err){
            sails.log.error(__filefn+err);
            res.json(err);
        });

    },

    /**
     * @method user
     * @route /users/:id
     * @route /user/:id
     *
     * Query a user by id with optional query parameters
     *
     * @param {csv} populate comma separated list of user attributes to populate
     *
     * @return {User} users that match query
     */
    user: function(req, res){
        var params = restQueryBuilder.parseParams(req);
        var query;

        // NOTE:
        //  wrap whole query with bluebird for better promises & error handing
        Promise.resolve()
        .then(function(){
            query = User.findOne(params.id);
            query = restQueryBuilder.populateDefaultAttributesHook(query, params, 'user');
            query = restQueryBuilder.populateAttributes(query, params.populate);
            return query;
        })

        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            sails.log.error(__filefn+err);
            res.json(err);
        });

    },

    /**
     * @method userAttributes
     * @route /users/:id/:attr
     * @route /user/:id/:attr
     * 
     * Where :attr can can be (questions|quizzes|stats|stream)
     *
     * Query attributes of a user with the following optional query parameters
     *
     * @param {boolean}  count    counts the results if ?count=true (ignores pagination!)
     * @param {string}   search   text search in corresponding relevant attribute data
     * @param {csv}      populate comma separated list of attribute's attributes to populate
     * @param {int}      page     return paginated results
     * @param {int}      limit    return paginated results
     *
     * @return {Array<UserAttribute>} users that match query
     */
    userAttributes: function(req, res){
        var params = restQueryBuilder.parseParams(req);
        var query;

        // NOTE:
        //  wrap whole query with bluebird for better promises & error handing
        Promise.resolve()
        .then(function(){
            // query requested attribute of user
            query = restQueryBuilder.attrOfUserSearchHook(query, params);
            // search in attributes
            query = restQueryBuilder.textSearchHook(query, params);

            if(!params.count){
                // populate attributes if ?populate query parameter was provided
                // (besided default populates) 
                query = restQueryBuilder.populateAttributes(query, params.populate);
                // apply pagination to search results (if provided by query parameters)
                query = restQueryBuilder.paginationHook(query, params);
            }

            return query;
        })

        .tap(function(data){
        //@debug
        //.then(function(data){
            if(!params.count){
                // NOTE:
                //  users are handled by reference, so no explicit assigning of stats is necessary!
                // BUT:
                //  need to return the promise so the next .then() waits for completion
                //return User.populateWithAuthorStats(data);
                return Promise.join(
                    restQueryBuilder.populateWithAuthorStats(data, params.attr),
                    restQueryBuilder.customPopulate(data, params.attr)
                );
            }
        })

        .then(function(data){
            if(_.isFinite(data)){
                data = {count: data};
            }
            res.json(data);
        })
        .catch(function(err){
            sails.log.error(err);
            res.json(err);
        });
    },

};

