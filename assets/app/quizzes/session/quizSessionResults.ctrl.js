
angular.module('app')
.controller('quizSessionResultsCtrl', function($scope, quiz, quizSession, actionHandler, $state){
    //quiz.author = author;
    $scope.quiz = quiz;
    $scope.quizSession = quizSession;

    // store at index of the question whether it was correctly answered
    $scope.correctIndex = [];

    $scope.percentages = [
        {
            name: 'correct',
            value: 0,
            type: 'success'
        },
        {
            name: 'wrong',
            value: 100,
            type: 'danger'
        }
    ];

    $scope.counts = {
        total: totalQuestions(),
        correct: correctAnswers()
    };


    updatePercentages();

    function updatePercentages(){
        var total = totalQuestions();
        var correct = correctAnswers();

        var pCorrect = Math.round(correct/total * 100);

        $scope.percentages = [
            {
                name: 'correct',
                value: pCorrect,
                type: 'success'
            },
            {
                name: 'wrong',
                value: 100 - pCorrect,
                type: 'danger'
            }
        ];
    }

    function totalQuestions(){
        return $scope.quiz.questions.length;
    }

    function correctAnswers(){
        var correct = 0;
        for(var i = 0; i < $scope.quiz.questions.length; i++){
            var question = $scope.quiz.questions[i];
            var answer = $scope.quizSession.answers[question.id];
            if(answer.answerCorrect){
                correct++;
                $scope.correctIndex.push(true);
            } else {
                $scope.correctIndex.push(false);
            }
        }
        return correct;
    }

});
