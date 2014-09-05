/**
 * ActionHandlerController
 *
 * @description :: Server-side logic for managing Actions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    START_QUIZ: function(req, res){
        var id = req.param('id');

        var record ={
            actionType: 'START_QUIZ',
            actor: req.user.id,
            targetType: 'Quiz',
            target: id
        };

        ActionHandler.handle(record).then(function(data){
            res.json(data);
        })
        .catch(function(err){
            sails.log.error(err);
            res.json(err);
        });

    },

    COMPLETE_QUIZ: function(req, res){
        var id = req.param('id');

        var record ={
            actionType: 'COMPLETE_QUIZ',
            actor: req.user.id,
            targetType: 'Quiz',
            target: id
        };

        ActionHandler.handle(record).then(function(data){
            res.json(data);
        })
        .catch(function(err){
            sails.log.error(err);
            res.json(err);
        });

    },

    // ==============================================================================
    // ==============================================================================
    // ==============================================================================


    index: function(req, res){
        res.json({
            message: 'Nothing to see here, move along!'
        });
    },

    ANSWER_QUESTION: function(req, res){
        var record ={
            actionType: 'ANSWER_QUESTION',
            actor: req.user.id,
            targetType: 'Question',
            //target: req.param('question'),
            target: req.param('question').id,
            data: {
                answer: req.param('answer'),
                quizSession: req.param('quizSession')
            }
        };

        ActionHandler.handle(record).then(function(_record){
            // action handling did basically
            // just check if user may answer the question
            // (enough reputation; not answered before)
            // 
            // -> if NOT UNIQUE (i.e. user answered before)
            //    he might be allowed to answer anyways?
            // -> or would he still need anough reputation just to use the service?
            //      -> I would argue that makes sense...


            // ANYWAYS.. we now need to do the checking of the user's submitted answer manually
            //
            // TODO: do this more elegantly.

            var actionHandler = require('../services/actionHandling/ActionFactory')
                                .getAction('ANSWER_QUESTION')

            record.target = req.param('question');
            var result = actionHandler.handle(record);

            res.json(result);
        });
    },

    ADD_TAG: function(req, res){
        var record ={
            actionType: 'ADD_TAG',
            actor: req.user.id,
            targetType: req.param('targetType'),
            target: req.param('target'),
            data: req.param('data')
        };
        ActionHandler.handle(record)
        .then(function(record){
            res.json(record);
        })
        .catch(function(err){
            sails.log.error(err);
        });
    },


    VOTE_UP: function(req, res){
        var record ={
            actionType: 'VOTE_UP',
            actor: req.user.id,
            targetType: req.param('targetType'),
            target: req.param('target')
        };
        ActionHandler.handle(record).then(function(record){

            // TODO: only experimenting...

            req.socket.emit('omg', {msg: 'req.socket.emit'});
            //User.subscribe(req.socket);
            User.subscribe(req.socket, [6]);
            User.publishUpdate(6, {
                id: 6,
                omg: 'yeah'
            });

            res.json(record);
        });
    },

    VOTE_DOWN: function(req, res){
        var record ={
            actionType: 'VOTE_DOWN',
            actor: req.user.id,
            targetType: req.param('targetType'),
            target: req.param('target')
        };
        ActionHandler.handle(record).then(function(record){
            res.json(record);
        });
    },


    FLAG: function(req, res){
        var record ={
            actionType: 'FLAG',
            actor: req.user.id,
            targetType: req.param('targetType'),
            target: req.param('target'),
            data: req.param('data')
        };
        ActionHandler.handle(record).then(function(record){
            res.json(record);
        });
    },



    CREATE_QUESTION: function(req, res){
        var actionRecord = {
            actionType: 'CREATE_QUESTION',
            actor: req.user.id,
            targetType: 'Question',
            data: req.param('data')
        };

        ActionHandler.handle(actionRecord).then(function(record){
            res.json(record);
        }); 
    },

    CREATE_QUIZ: function(req, res){
        var actionRecord = {
            actionType: 'CREATE_QUIZ',
            actor: req.user.id,
            targetType: 'Quiz',
            data: req.param('data')
        };

        ActionHandler.handle(actionRecord).then(function(record){
            res.json(record);
        });

    },
	
};

