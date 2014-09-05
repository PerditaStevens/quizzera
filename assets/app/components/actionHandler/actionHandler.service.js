
angular.module('app')
.service('actionHandler', function($sailsPromised, Restangular){

    function ANSWER_QUESTION(question, answer, quizSession){
        return $sailsPromised.get('/ActionHandler/ANSWER_QUESTION', {
            question: question,
            answer: answer,
            quizSession: quizSession
        }).then(function(result){
            return result;
        });
    }

    function CREATE_QUESTION(question){
        return $sailsPromised.get('/ActionHandler/CREATE_QUESTION', {
            data: {
                question: question
            }
        }).then(function(result){
            return Restangular.one('questions', result.data.target);
        });
    }

    function CREATE_QUIZ(quiz){
        return $sailsPromised.get('/ActionHandler/CREATE_QUIZ', {
            data: {
                quiz: quiz 
            }
        }).then(function(result){
            return Restangular.one('quizzes', result.data.target);
        });
    }

    function ADD_TAG(targetType, targetId, tag){
        return $sailsPromised.get('/ActionHandler/ADD_TAG', {
            targetType: targetType,
            target: targetId,
            data: {
                tag: tag
            }
        });
    }


    function VOTE_UP(targetType, targetId){
        return $sailsPromised.get('/ActionHandler/VOTE_UP', {
            targetType: targetType,
            target: targetId
        });
    }

    function VOTE_DOWN(targetType, targetId){
        return $sailsPromised.get('/ActionHandler/VOTE_DOWN', {
            targetType: targetType,
            target: targetId
        });
    }

    function FLAG(targetType, targetId, data){
        return $sailsPromised.get('/ActionHandler/FLAG', {
            targetType: targetType,
            target: targetId,
            // TODO: implement view
            data: data
        });
    }


    function getActionHistory(userId, paginate){
        return $sailsPromised.get('/ActionRecord/find', {
            query: {
                actor: userId
            },
            paginate: paginate
        });
    }

    return {
        //handle: handleAction,
        CREATE_QUESTION: CREATE_QUESTION,
        CREATE_QUIZ: CREATE_QUIZ,
        ADD_TAG: ADD_TAG,
        VOTE_UP: VOTE_UP,
        VOTE_DOWN: VOTE_DOWN,
        FLAG: FLAG,
        ANSWER_QUESTION: ANSWER_QUESTION,

        getActionHistory: getActionHistory
    };
});
