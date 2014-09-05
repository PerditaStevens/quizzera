
angular.module('app')
.controller('quizzesCtrl', function($scope, Search, Pagination, Session){
    $scope.quizzes = [];
    $scope.quizzesSearch = {
        text: '',
        tags: [],
        handle: function(){
            updateQuizzes();
        }
    };

    // pagination
    // ===============
    var pg = Pagination.getOrCreate('quizzes');
    pg.limit = 5;
    pg.onChange(updateQuizzes);

    function updateQuizzes(){
        var params = {
            page: pg.page,
            limit: pg.limit,
            search: $scope.quizzesSearch.text,
            populate: 'author,questions'
        };
        pg.updateTotalCount(Search.totalCount.quizzes(params));
        Search.quizzes(params).then(function(quizzes){
            // mark quizzes as started
            _.each(quizzes, function(quiz){
                quiz.isStarted = $scope.isQuizStarted(quiz);
                quiz.isCompleted = $scope.isQuizCompleted(quiz);
            });
            $scope.quizzes = quizzes;
        });
    }

    $scope.isQuizStarted = function(quiz){
        if(!Session.user || !Session.user.quizSessions){
            return false;
        }
        var qSession = _.find(Session.user.quizSessions, function(qSession){
            return (qSession.quiz === quiz.id);
        });
        return !!qSession;
    };

    $scope.isQuizCompleted = function(quiz){
        if(!Session.user || !Session.user.quizSessions){
            return false;
        }
        var qSession = _.find(Session.user.quizSessions, function(qSession){
            return (qSession.quiz === quiz.id && qSession.completed);
        });
        return !!qSession;
    };

    updateQuizzes();
});
