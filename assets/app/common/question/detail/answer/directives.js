

angular.module('app')

.directive('questionAnswer', function(actionHandler){
    return {
        restrict: 'AE',
        replace: true,
        link: function($scope){
            $scope.question.userAnswer = {};

            $scope.submit = function(){
                if($scope.onQuestionSubmit){
                    $scope.onQuestionSubmit($scope.question, $scope.question.userAnswer);

                } else {

                    var answer = $scope.question.userAnswer;
                    //delete $scope.question.answer;
                    actionHandler.ANSWER_QUESTION($scope.question, answer).then(function(result){
                        $scope.result = result;
                    });
                }
            };

            $scope.clearResults = function(){
                $scope.result = {};
            };
        },
        templateUrl: '/app/common/question/detail/answer/questionAnswer.tpl.html'
    };
})

.directive('multipleChoiceAnswer', function(){

    return {
        restrict: 'AE',
        replace: true,
        link: function($scope){
            $scope.question.userAnswer = {
                correctOption: undefined
            };
            if($scope.question.sessionAnswer){
                $scope.question.userAnswer.correctOption = $scope.question.sessionAnswer.answer.correctOption;
            }

        },
        templateUrl: '/app/common/question/detail/answer/multiple-choice.tpl.html'
    };
})

.directive('trueOrFalseAnswer', function(){

    return {
        restrict: 'AE',
        replace: true,
        link: function($scope){
            $scope.question.userAnswer = {
                isTrue: undefined
            };
            if($scope.question.sessionAnswer){
                $scope.question.userAnswer.isTrue = $scope.question.sessionAnswer.answer.isTrue;
            }

        },
        templateUrl: '/app/common/question/detail/answer/true-or-false.tpl.html'
    };
});
