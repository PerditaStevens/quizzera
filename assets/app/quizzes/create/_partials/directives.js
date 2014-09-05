

angular.module('app')
.directive('createQuizForm', function(tpl){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: '/app/quizzes/create/_partials/quizForm/createQuizForm.tpl.html',
    };
});
