
angular.module('app')
.controller('userProfileCtrl', function($scope, user, stream, quizSessions, Restangular) {

    $scope.user = user;
    $scope.stream = stream;
    $scope.quizSessions = quizSessions;
    $scope.sessionQuizzes = _.pluck(quizSessions, 'quiz');
    $scope.sessionQuizzes = _.map($scope.sessionQuizzes, function(qz){
        return Restangular.one('quizzes', qz.id).get().$object;
    });

    // TODO: not used/needed anymore (?)
    $scope.show = {
        questions: true,
        quizzes: true,
        stream: true,
        sessionQuizzes: false
    };

    // will be filled if quizzes in which question appears is explicitly requested by user
    $scope.questions;
    $scope.quizzes;

    $scope.loadQuizzes = function(){
        user.getList('quizzes').then(function(quizzes){
            $scope.quizzes = quizzes || [];
        });
//        Restangular
//        .one('user', user.id)
//        .getList('quizzes', {populate: 'author'})
//        .then(function(quizzes){
//            $scope.quizzes = quizzes || [];
//            $scope.quizzes = _.map(quizzes, function(quiz){
//                quiz.author = user;
//                return quiz;
//            });
//        });
    };

    $scope.loadQuestions= function(){
        user.getList('questions').then(function(questions){
            $scope.questions= questions || [];
            //$scope.questions = _.map(questions, function(question){
                //question.author = user;
                //return  question;
            //});
        });

//        Restangular
//        .one('user', user.id)
//        .getList('questions')
//        .then(function(questions){
//            $scope.questions= questions || [];
//            $scope.questions = _.map(questions, function(question){
//                question.author = user;
//                return  question;
//            });
//        })
    };



});
