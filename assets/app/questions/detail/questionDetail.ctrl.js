
angular.module('app')
.controller('questionDetailCtrl', function($scope, question, Restangular){
    $scope.question = question;
    // will be filled if quizzes in which question appears is explicitly requested by user
    $scope.quizzes;

    $scope.loadQuizzes = function(){
        Restangular
        .one('question', $scope.question.id)
        .getList('quizzes', {populate: 'author,questions'})
        .then(function(quizzes){
            $scope.quizzes = quizzes || [];
        });
    };


});
