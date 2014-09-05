/**
 * QuizController
 *
 * @description :: Server-side logic for managing Quizzes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Promise = require('bluebird');
Promise.longStackTraces();

module.exports = {

    quizSessions: function(req, res){
        var params = {
            completed: req.param('completed'),
            quiz: req.param('quiz'),
            user: req.param('user'),
            count: req.param('count')
        };
        var query;

        sails.log.note('Route not fully implmented!');

        Promise.resolve().then(function(){
            // validate params
            // ===============
            if(params.completed && !_.contains(['true', 'false'], params.completed)){
                throw new Errors.Query.invalidParameter('completed parameter must be "true" or "false" but was "'+params.completed+'"');
            }
            if(params.count && !_.contains(['true', 'false'], params.count)){
                throw new Errors.Query.invalidParameter('count parameter must be "true" or "false" but was "'+params.count+'"');
            }


        })

        .then(function(){
            if(params.count){
                query = QuizSession.count();
            } else {
                query = QuizSession.find();
            }

            // NOTE: no text search! But search for quizzes or users
            if(params.quiz){
                query = query.where({quiz: params.quiz});
            }
            if(params.user){
                query = query.where({user: params.user});
            }

            if(params.completed){
                if(params.completed === 'true'){
                    query = query.where({completed: true});
                } else if(params.completed === 'false') {
                    query = query.where({completed: false});
                } 
            }

            if(!params.count){
                query = restQueryBuilder.populateDefaultAttributesHook(query, params, 'quizsession');
                query = restQueryBuilder.paginationHook(query, params);
                query = restQueryBuilder.sortHook(query, params, {createdAt: 'desc'});
            }
            return query;
        })

        .tap(function(data){
            if(!params.count){
                return Promise.join(
                    restQueryBuilder.populateWithAuthorStats(data, 'quizsession')
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
            sails.log.error(__filefn+err);
            res.json(err);
        });

    },

    /**
     * @method quizzes
     * @route /quizzes
     *
     * Query all quizzes with the following optional query parameters
     *
     * @param {boolean}  count    counts the results if ?count=true (ignores pagination!)
     * @param {string}   search   text search in quizzes' title & description
     * @param {csv}      populate comma separated list of quiz attributes to populate
     * @param {int}      page     return paginated results
     * @param {int}      limit    return paginated results
     *
     * @return {Array<Quiz>}  quizzes that match query
     * @return {count: int}       if count=true was supplied
     */

    quizzes: function(req, res){
        var params = restQueryBuilder.parseParams(req);
        var query;

        // NOTE: wrap whole query with bluebird for better promises & error handing
        Promise.resolve()
        .then(function(){
            if(params.count){
                query = Quiz.count();
            } else {
                query = Quiz.find();
            }

            query = restQueryBuilder.textSearchHook(query, params, 'quiz');
            if(!params.count){
                query = restQueryBuilder.populateDefaultAttributesHook(query, params, 'quiz');
                query = restQueryBuilder.populateAttributes(query, params.populate, 'quiz');
                query = restQueryBuilder.paginationHook(query, params);
                query = restQueryBuilder.sortHook(query, params, {createdAt: 'desc'});
            }
            return query;
        })

        .tap(function(data){

            if(!params.count){
                // NOTE:
                //  users are handled by reference, so no explicit assigning of stats is necessary!
                // BUT:
                //  need to return the promise so the next .then() waits for completion
                //return User.populateWithAuthorStats(data);
                return Promise.join(
                    restQueryBuilder.populateWithAuthorStats(data, 'quiz')
                    //restQueryBuilder.customPopulate(data, params.attr)
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
            sails.log.error(__filefn+err);
            res.json(err);
        });
    },


    /**
     * @method quiz
     * @route /quizzes/:id
     * @route /quiz/:id
     *
     * Query a quiz by id with optional query parameters
     *
     * @param {csv} populate comma separated list of quiz attributes to populate
     *
     * @return {Quiz} quiz that match query
     */
    quiz: function(req, res){
        var params = restQueryBuilder.parseParams(req);
        var query;

        // NOTE: wrap whole query with bluebird for better promises & error handing
        Promise.resolve()
        .then(function(){
            query = Quiz.findOne(params.id);
            query = restQueryBuilder.populateDefaultAttributesHook(query, params, 'quiz');
            query = restQueryBuilder.populateAttributes(query, params.populate, 'quiz');
            return query;
        })

        .tap(function(data){
            if(!params.count){
                return Promise.join(
                    restQueryBuilder.populateWithAuthorStats(data, 'quiz')
                );
            }
        })


        .then(function(data){
            res.json(data);
        })
        .catch(function(err){
            sails.log.note(__filefn+':');
            sails.log.error(err);
            res.json(err);
        });
    },


    /**
     * @method quizAttributes
     * @route /quizzes/:id/:attr
     * @route /quiz/:id/:attr
     * 
     * Where :attr can can be (questions|stats)
     *
     * Query attributes of a quiz with the following optional query parameters
     *
     * @param {boolean}  count    counts the results if ?count=true (ignores pagination!)
     * @param {string}   search   text search in corresponding relevant attribute data
     * @param {csv}      populate comma separated list of attribute's attributes to populate
     * @param {int}      page     return paginated results
     * @param {int}      limit    return paginated results
     *
     * @return {Array<QuizAttribute>} quizs that match query
     */
    quizAttributes: function(req, res){
        var params = restQueryBuilder.parseParams(req);
        var query;

        // NOTE:
        //  wrap whole query with bluebird for better promises & error handing
        Promise.resolve()
        .then(function(){
            // query requested attribute of quiz 
            query = restQueryBuilder.attrOfQuizSearchHook(query, params);
            // search in attributes
            query = restQueryBuilder.textSearchHook(query, params);

            if(!params.count){
                // populate attributes if ?populate query parameter was provided
                // (besided default populates) 
                query = restQueryBuilder.populateAttributes(query, params.populate, 'quiz');
                // apply pagination to search results (if provided by query parameters)
                query = restQueryBuilder.paginationHook(query, params);
            }

            return query;
        })

        .tap(function(data){
        //@debug
        //.then(function(data){
            if(!params.count){
                //if(params.attr !== 'stats'){
                //}
            
                // NOTE:
                //  users are handled by reference, so no explicit assigning of stats is necessary!
                // BUT:
                //  need to return the promise so the next .then() waits for completion
                //return User.populateWithAuthorStats(data);
                return Promise.join(
                    restQueryBuilder.populateWithAuthorStats(data, params.attr, 'stats')
                );
            }
        })

        .then(function(data){
            // NOTE: will only have effect if questions of quiz were queried
            return restQueryBuilder.questionsOfQuiz_dataHook(data, params);
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


