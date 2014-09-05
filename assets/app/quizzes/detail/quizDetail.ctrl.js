
angular.module('app')
.controller('quizDetailCtrl', function($scope, quiz, Session){
    var currentUser = Session.user;
    //quiz.author = author;
    $scope.quiz = quiz;

    $scope.isQuizStarted = function(){
        if(!currentUser || !currentUser.quizSessions){
            return false;
        }
        var session = _.find(currentUser.quizSessions, function(session){
            return (session.quiz === $scope.quiz.id);
        });
        return !!session;
    };

});
