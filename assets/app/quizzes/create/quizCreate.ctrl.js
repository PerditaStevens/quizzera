
angular.module('app')
.controller('quizCreateCtrl', function($scope, $localStorage, Search, actionHandler, Session, $state){
    //var defaults = {
    $scope.quiz = {
        questions: []
    };
    //$scope.newQuestion = {};
    //};

    //$scope.$storage = $localStorage.$default(defaults);
    //$scope.$storage.$reset({ quiz: { questions: [] } });

    // debug
    window.clearLocalStorage = function(){
        $scope.$apply(function(){
            $scope.$storage.$reset({ quiz: { questions: [] } });
        });
    };


    $scope.removeQuestion = function(question){
        var i = $scope.quiz.questions.indexOf(question);
        $scope.quiz.questions.splice(i, 1);
        //var i = $scope.$storage.quiz.questions.indexOf(question);
        //$scope.$storage.quiz.questions.splice(i, 1);
    };

    $scope.addQuestion = function(newQuestion){
            newQuestion.deletable = true; // add delete-button
            newQuestion.author = Session.user;
            newQuestion.stats = {
                votes: 0
            };
            $scope.quiz.questions.unshift(newQuestion);
    };

    $scope.validate = function(){
        var valid = false;
        //valid = valid || !$scope.$storage.quiz.title;
        //valid = valid || !$scope.$storage.quiz.description;
        valid = valid || !$scope.quiz.title;
        valid = valid || !$scope.quiz.description;

        return valid;
    };

    $scope.create = function(){
        //_.each($scope.$storage.quiz.questions, function(question){
        _.each($scope.quiz.questions, function(question){
            delete question.deletable;
        });
        //actionHandler.CREATE_QUIZ($scope.$storage.quiz).then(function(quiz){
        actionHandler.CREATE_QUIZ($scope.quiz).then(function(quiz){
            $state.go('quiz', {id: quiz.id});
        });
    };

    $scope.loadTags = function(query){
        return Search.tags({search: query});
    };

});
