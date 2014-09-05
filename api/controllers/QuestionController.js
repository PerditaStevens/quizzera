/**
 * QuestionController
 *
 * @description :: Server-side logic for managing Questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */



var Promise = require('bluebird');
module.exports = {

    // =================================================================
    // ===========================  TODO: ==============================
    // =================================================================
    // ========================   REFACTOR   ===========================
    // =================================================================

    REST: function(req, res){
        console.log('[question/REST]', req.params.all());
        var id = req.param('id');
        var attr = req.param('attr');

        var page = req.param('page') || undefined;
        var limit = req.param('limit') || undefined;
        var count = !_.isUndefined(req.param('count')); // boolean whether to return count
        var search = req.param('search');

        // which attributes of user should be populated
        var populate = req.param('populate') || '';
        populate = _.map(populate.split(','), function(str){return str.trim();});

        var queryMethod = count? 'count' : 'find';

        // NOTE: special case querying /questions/:id/quizzes
        // ( see below in switch case for details)
        // ==================================================

        if(!_.isUndefined(id) && _.contains(['quiz', 'quizzes'], attr)){
            Question.findOne(id).populate('quizzes').then(function(question){
                var quizIds = _.pluck(question.quizzes, 'id');
                query = Quiz[queryMethod]().where({id: quizIds});

                if(!count){
                    query = query
                    .populate('stats')
                    .populate('tags');
                    //.populate('flags');
                }
                if(!count && populate){
                    _.each(populate, function(attr){
                        if(attr) {
                            query = query.populate(attr);
                        }
                    });
                }

                if(search){
                    query = query.where({
                        or: [
                            {title: {contains: search}},
                            {description: {contains: search}}
                        ]
                    });
                }
                if(count){
                    query.then(function(count){
                        res.json({count: count});
                    });
                } else {
                    // currently, pagination is default!
                    // TODO: good idea?
                    if(page || limit){
                        query = query.paginate({
                            page: page,
                            limit: limit
                        });
                    }

                    query
                    .sort({createdAt: 'desc'})
                    .then(function(data){
                        res.json(data);
                    });
                }

            })
            .fail(function(err){
                sails.log.error(err);
            });

            return;
        }


        var query;
        if(_.isUndefined(id)){
            // /questions
            // get all questions
            query = Question[queryMethod]();
            if(!count){
                query = query.populate('stats').populate('tags').populate('flags');
            }
            if(!count && populate){
                _.each(populate, function(attr){
                    if(attr) {
                        query = query.populate(attr);
                    }
                });
            }
            if(search){
                query = query.where({
                    or: [
                        {title: {contains: search}},
                        {description: {contains: search}}
                    ]
                });
            }
        }

        else if(_.isUndefined(attr)) {
            // /questions/:id
            // get question by id
            query = Question.findOne(id);

            if(!count){
                query = query.populate('stats').populate('tags').populate('flags');
            }
            if(!count && populate){
                _.each(populate, function(attr){
                    if(attr) {
                        query = query.populate(attr);
                    }
                });
            }
        }

        else {
            // /questions/:id/:attr
            // get questions's attibutes
 
            attr = attr.toLowerCase();
            switch(attr){
                case 'quiz':
                case 'quizzes':

                // NOTE:
                // this special case is handled right at the beginning of the method.
                // Problem is:
                //   the query = query.then() chain is broken
                //   and the waterline promise is then the resolved parameter of the next
                //   .then(function(promise)){ ... }) and can't be accessed via query.
                // (see below)

                // TODO: issue whith returning k{{
//                query = Question.findOne(id).populate('quizzes').then(function(question){
//                    var quizIds = _.pluck(question.quizzes, 'id');
//                    return Quiz[queryMethod]().where({id: quizIds});
//                }).then(function(quizzes){
//                    // NOTE: inside here I can access the promise;
//                    return quizzes.populate('stats');
//                })

                    //if(!count){
                        //query = query.populate('stats');
                    //}
                    //if(search){
                        //query = query.where({
                            //or: [
                                //{title: {contains: search}},
                                //{description: {contains: search}}
                            //]
                        //});
                    //}
                    break;

                case 'stats':
                    query = QuestionStats.findOne({question: id});
                    break;

                case 'stream':
                    query = ActionRecord[queryMethod]({
                        or: [
                            {target: id}
                        ]
                    });
                    if(!count){
                        query = query
                        .populate('actor')
                        .populate('targetOwner');
                    }
                    break;
            }
        }

        if(count){
            query.then(function(count){
                res.json({count: count});
            });
        } else {
            // currently, pagination is default!
            // TODO: good idea?
            query.paginate({
                page: page,
                limit: limit
            })
            .sort({createdAt: 'desc'})
            .then(function(data){
                // populate author with userStats
                // TODO: wait for waterline feature `afterFind` to allow population implicitly
                if(_.contains(populate, 'author')){
                    data = _.isUndefined(id)? data : [data]; // for findOne case when id was supplied
                    return User.populateWithStats(_.pluck(data, 'author')).then(function(users){
                        // NOTE:
                        // users are passed in as reference, no need to "re-apply" them
                        return _.isUndefined(id)? data : data[0];
                    });
                } else {
                    return data;
                }
            })
            .then(function(data){
                res.json(data);
            });
        }
    },

};
