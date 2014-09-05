
angular.module('app')
.directive('quizSummary', function(actionHandler, notifier){


    return {
        restrict: 'EA',
        replace: true,
        link: function($scope){
            $scope.voteUp = function(quiz){
                actionHandler.VOTE_UP('quiz', quiz.id).then(function(res){
                    if(res.success){
                        quiz.stats.votes++;
                    } else {
                        _.each(res.messages, function(msg){
                            notifier.info(msg);
                        });
                    }
                });
            };
            $scope.voteDown = function(quiz){
                actionHandler.VOTE_DOWN('quiz', quiz.id).then(function(res){
                    if(res.success){
                        quiz.stats.votes--;
                    } else {
                        _.each(res.messages, function(msg){
                            notifier.info(msg);
                        });
                    }
                });
            };
        },
        templateUrl: '/app/common/quiz/summary/quizSummary.tpl.html'
    };
});
