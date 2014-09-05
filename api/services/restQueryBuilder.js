
Promise = require('bluebird');

module.exports = {

    // CONFIG
    // =======================================================
    defaultPopulates: {
        stats: ['user', 'question', 'quiz'],  // depending on which stats
        user: ['stats', 'quizSessions'],
        question: ['stats', 'author', 'tags', 'quizzes'],
        quiz: ['stats', 'author', 'questions', 'tags'],
        quizsession: ['user', 'quiz'],
        stream: ['actor', 'targetOwner'],
    },


    // Helpers
    // =======================================================
    csvToArray: function(csv){
        var arr = _.chain( (csv || '').split(',') )
            .map( function(str){return str.trim();}).filter().value();

        return _.isEmpty(arr)? undefined : arr;

    },

    parseParams: function(req){
        sails.log.note(req.params.all(), __filefn);
        var self = this;

        var params = {
            id         : req.param('id'),
            attr       : req.param('attr')? self.normalizeAttribute(req.param('attr')) : '',
            page       : req.param('page'),
            limit      : req.param('limit'),
            // boolean whether to return count
            count      : _.contains(['true', 'True'], req.param('count')),
            search     : req.param('search'),

            searchTags : self.csvToArray(req.param('tags')),

            // which attributes of user should be populated
            populate   : self.csvToArray(req.param('populate'))

            //populate: _.chain((req.param('populate') || '').split(','))
            //.map( function(str){return str.trim();}).filter().value(),
        };

        //params.queryMethod = params.count? 'count' : 'find';
        //params.populate = _.union(params.populate, this.defaultPopulates[])

        return params;
    },

    normalizeAttribute: function(attr){
        // NOTE:
        // currently only for user attributes (are there even more?)
        attr = attr.toLowerCase();
        if(_.contains(['user', 'users'], attr)){
            return 'user';
        } else if(_.contains(['quiz', 'quizzes'], attr)){
            return 'quiz';
        } else if(_.contains(['quizsession', 'quizsessions'], attr)){
            return 'quizsession';
        } else if(_.contains(['question', 'questions'], attr)){
            return 'question';
        } else if(_.contains(['stats'], attr)){
            return 'stats';
        } else if(_.contains(['stream', 'actionrecord', 'actionrecords'], attr)){
            return 'stream';
        } else if(_.contains(['tags', 'tag'], attr)){
            return 'tag';
        } else {
            throw new Errors.QueryError(__filefn+'Unsupported attribute: '+attr);
        }
    },
    excludeDefaults: function(attrs, model){
        var defaults = this.defaultPopulates[model] || [];
        return _.difference(attrs, defaults);
    },

    // CONVENIENCE
    // =======================================================
    /**
     *
     * NOTE:
     *  it purposefully ignores default populates, as the should have been applied before.
     *  @param {string} modelToExcludeDefaultsFrom if provided, defaut populates are excluded
     *
     */
    populateAttributes: function (query, attrs, modelToExcludeDefaultsFrom){
        sails.log.note(attrs, __filefn);
        if(!attrs){
            sails.log.note('.... nothing to populate', __filefn);
            return query;
        }
        if(modelToExcludeDefaultsFrom){
            attrs = this.excludeDefaults(attrs, modelToExcludeDefaultsFrom);
        }

        _.each(attrs, function(attr){
            try {
                query = query.populate(attr);
            } catch (e){
                sails.log.warn('Skipping populatng attribute "'+attr+'". Reason:');
                sails.log.warn(e);
            }
        });
        return query;
    },

    /**
     *
     * Populate the list of models with user stats.
     *
     * NOTE:
     *  the users are handled via reference therefore the returned data
     *  doesn't need to be explicitly applied.
     *
     * NOTE:
     *  An attribute might have multiple users associated with it (e.g. ActionRecord).
     *  In this case multiple fileds are populated
     *
     * @param {Array<Model>} data returned query data
     * @return {Array<Model>} data returned query data
     */
    populateWithAuthorStats: function(data, attr, ignoreAttr){
        var userPKs = []; // primary keys
        attr = this.normalizeAttribute(attr);
        if(ignoreAttr && attr === this.normalizeAttribute(ignoreAttr)){
            return data;
        }

        switch(attr){
            case 'question':
                userPKs = ['author'];
                break;
            case 'quiz':
                userPKs = ['author'];
                break;
            case 'quizsession':
                userPKs = ['user'];
                break;
            case 'stats':
                // TODO: issues when using with /quiz/:id/stats
                // needs explicit handling
                userPKs = ['user'];
                break;
            case 'stream':
                userPKs = ['actor', 'targetOwner'];
                break;
            default:
                throw new Errors.QueryError(__filefn+'Unsupported attribute: '+attr);
        }

        var promises  = _.map(userPKs, function(pk){
            return User.populateWithUserStats(data, pk);
        });

        return Promise.all(promises);
    },

    /**
     *
     * Allow to do custom queries / populates given a specific user attribute.
     *
     * For instance this is interesting in the case of ActionRecords where
     * the target is not referenced via an association but by
     *      target: id
     *      targetType Question|Quiz
     *
     * NOTE:
     *  the users are handled via reference therefore the returned data
     *  doesn't need to be explicitly applied.
     *
     * @param {Array<Model>} data returned query data
     * @param {string} attr a valid user attribute
     * @return {Array<Model>} data returned query data
     *
     */
    customPopulate: function(data, attr){
        sails.log.note(attr, __filefn);

        attr = this.normalizeAttribute(attr);

        switch(attr){
            case 'stream':
                return populateActionTargets(data);
            default:
                sails.log.warn(__filefn+'No custom populate for '+attr);
                //throw new Errors.QueryError(__filefn+'Unsupported attribute: '+attr);
        }

        function populateActionTargets(actionRecords){
            var targets = _.map(actionRecords, function(record, index){
                return {
                    id: record.target,
                    type: record.targetType.toLowerCase(), // normalize
                    recordIndex: index      // to populate it with appropriate target
                };
            });
            var byTargetType = _.groupBy(targets, 'type');

            var promises = _.map(byTargetType, function(targetsOfType, type){
                // targetsOfType: list of {id, type, recordIndex} of same type
                var targetIds = _.pluck(targetsOfType, 'id');

                return sails.models[type].find({id: targetIds}).then(function(targetInstances){
                    // got all target instances of a specific type
                    var byTargetId = _.indexBy(targetInstances, 'id');

                    _.each(byTargetType[type], function(target){
                        actionRecords[target.recordIndex].target = byTargetId[target.id];
                    });

                    return targetInstances;
                });
            });

            return Promise.all(promises).then(function(targetTypes){
                // return as single flat array
                return _.flatten(targetTypes);
            });


        }
    },

    questionsOfQuiz_dataHook: function(data, params){
        var attr = this.normalizeAttribute(params.attr);
        var id = +params.id;
        if(attr !== 'question'){
            return data;
        }

        var quizQuestions = _.filter(data, function(question){
            var ids = _.pluck(question.quizzes, 'id');
            return _.contains(ids, id);
        });
        sails.log.warn(__filefn+'currently doesn\'t take pagination and count into account');
        return quizQuestions;
        // populating happened before already!

    },


    // HOOKS
    // =======================================================
    // All hooks implement same interface
    // (EXCEPT for tagSearchHook, which takes query results!)
    //
    /**
     * @param query {Promise} query object resulting form waterline query (e.g. Model.find())
     * @param attrType {user|quiz|question|stream|actionrecord|...}
     * @param params {object} REST parameters of request
     *
     * @return query {Promise}
     */

    sortHook: function(query, params, sortCriteria){
        sails.log.note(sortCriteria, __filefn);
        sails.log.warn('[sortHook] currently not taking into account sort query parameter.');
        sortCriteria = sortCriteria? sortCriteria : {createdAt: 'desc'};

        return query.sort(sortCriteria);
    },
//    countHook: function(query, params){
//        if(!params.count){
//            return query;
//        }
//    },

    populateDefaultAttributesHook: function (query, params, attr){
        attr = this.normalizeAttribute(attr || params.attr);
        sails.log.note( attr, __filefn);
        return this.populateAttributes(query, this.defaultPopulates[attr] || []);
    },


    paginationHook: function(query, params){
        if(params.page || params.limit){
            query = query.paginate({
                page: params.page,
                limit: params.limit
            });
        }
        return query;
    },

    attrOfUserSearchHook: function(query, params, attr){
        attr = this.normalizeAttribute(attr || params.attr);
        var method = params.count? 'count' : 'find';
        var id = params.id;

        switch(attr){
            case 'question':
                query = Question[method]().where({
                    author: id
                });
                break;
            case 'quiz':
                query = Quiz[method]().where({
                    author: id
                });
                break;
            case 'stats':
                method = params.count? 'count' : 'findOne';
                query = UserStats[method]().where({
                    user: id
                });
                break;
            case 'stream':
                query = ActionRecord[method]().where({
                    or: [
                        { actor       : id },
                        { targetOwner : id }
                    ]
                });
                break;
            default:
                throw new Errors.QueryError(__filefn+'Unsupported attribute: '+attrType);
        }

        if(!params.count){
            query = this.populateDefaultAttributesHook(query, params, attr);
        }
        return query;
    },

    attrOfQuizSearchHook: function(query, params, attr){
        attr = this.normalizeAttribute(attr || params.attr);
        var method = params.count? 'count' : 'find';
        var id = params.id;

        switch(attr){
            case 'question':
                // (1) get questions where quiz
                sails.log.warn('/quizzes/:id/questions: all questions will be queried and need an result-data-hook to filter quiz-questions!');
                query = Question[method]();
                break;
            case 'stats':
                method = params.count? 'count' : 'findOne';
                query = QuizStats[method]().where({
                    quiz: id
                });
                break;
            case 'stream':
                query = ActionRecord[method]().where({
                        target     : id,
                        targetType : 'quiz'
                });
                break;
            default:
                throw new Errors.QueryError(__filefn+'Unsupported attribute: '+attrType);
        }

        if(!params.count){
            query = this.populateDefaultAttributesHook(query, params, attr);
        }
        return query;
    },

    // TODO: this might not work for text queries for all models (?)
    textSearchHook: function (query, params, attr){
        var txt = params.search;
        attr = attr || params.attr;
        attr = restQueryBuilder.normalizeAttribute(attr);
        if(!txt){
            return query;
        }

        switch(attr){
            case 'user':
                return query.where({
                    username: {contains: txt}
                });

            case 'question':
                return query.where({
                    or: [
                        { title: {contains: txt} },
                        { description: {contains: txt} }
                    ]
                });

            case 'quiz':
                return query.where({
                    or: [
                        { title: {contains: txt} },
                        { description: {contains: txt} }
                    ]
                });

            case 'quiz':
                return query.where({
                    or: [
                        { title: {contains: txt} },
                        { description: {contains: txt} }
                    ]
                });


            case 'tag':
                return query.where({
                    text: {contains: txt}
                });

            case 'stream':
                return query.where({
                    actionType: { contains: txt }
                    //NOTE:
                    // this query results in a bug where two where()
                    // queries with {or: [...]} cause only the last to succeed
                    // (the other gets canceled)
                    //=================================
                    //or: [
                    //{ actionType: {contains: txt} },
                    //{ targetType: {contains: txt} }
                    //]
                });
            default:
                throw new Errors.QueryError(__filefn+'Unsupported attribute: '+attr);
        }
    },


    // DATA-HOOKS
    // =========================================================


    // NOTE:
    //  the first parameter are query RESULTS!!!
    //
    //  TODO:
    //   incorporate possible count/pagination queries!
    //   |-> approach 1:
    //       ==========
    //       use retrieved ids of data to start new query over ids
    //       and use e.g. pagination hook in here
    //
    //   |-> approach 2:
    //       ===========
    //       return data and have THEM handle it
    tagSearchHook: function(data, params, attr){
        var tags = params.searchTags;
        attr = restQueryBuilder.normalizeAttribute(attr || params.attr);
        if(!tags){
            return data;
        }

        switch(attr){
            case 'question':
                return filterDataWithTags(data, tags);
            default:
                throw new Errors.QueryError(__filefn+'Unsupported attribute: '+attr);
        }
    }
};


function filterDataWithTags(data, searchTags){
    if(!searchTags){
        return data;
    }

    data = _.filter(data, function(item){
        if(!item.tags){
            throw new Errors.QueryError(__filefn+'Tag search requires data to be populated with tags.');
        }
        if(!_.every(item.tags, 'text')){
            throw new Errors.QueryError(__filefn+'Tags must have a "text" attribute.');
        }
        return !_.chain(item.tags)
        .pluck('text')
        .intersection(searchTags)
        .isEmpty()  // note above negation of chain (we are looking for common tags)
        .value();
    });

    return data;
}
