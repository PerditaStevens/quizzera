
angular.module('app')
.controller('quizSessionCtrl', function($scope, quiz, quizSession, actionHandler, $state){
    //quiz.author = author;
    $scope.quiz = quiz;
    $scope.quizSession = quizSession;

    $scope.percentCompleted = 0;

    $scope.updateCompletionPercent = function(){
        var total = $scope.quiz.questions.length;
        var completed = _.size($scope.quizSession.answers);
        $scope.percentCompleted = Math.round(completed/total *100);
        return $scope.percentCompleted;
    };


    $scope.isCompleted = function(){
        for(var i = 0; i < $scope.quiz.questions.length; i++){
            var question = $scope.quiz.questions[i];
            if(!$scope.quizSession.answers[question.id]){
                return false;
            }
        }
        return true;
    };

    $scope.setQuestionByIndex = function(index){
        $scope.question = $scope.quiz.questions[index];
        $scope.question.sessionAnswer = $scope.quizSession.answers[$scope.question.id];
        if($scope.clearResults){
            $scope.clearResults(); // call function of questoinAnswer directive
        }
    };

    $scope.getFirstUnansweredIndex = function(){
        //for(var i = 0; i < $scope.quizSession.answers.length; i++){
        for(var i = 0; i < $scope.quiz.questions.length; i++){
            var question = $scope.quiz.questions[i];
            if(!$scope.quizSession.answers[question.id]){
                return i;
            }
        }
        // return last if all were answered
        return $scope.quiz.questions.length - 1;
    };

    $scope.getNextUnansweredQuestionIndex = function(){
        var i = $scope.currentQuestionIndex();
        //for(var i = 0; i < $scope.quizSession.answers.length; i++){
        for(i = i+1; i < $scope.quiz.questions.length; i++){
            var question = $scope.quiz.questions[i];
            if(!$scope.quizSession.answers[question.id]){
                return i;
            }
        }
        // return last if all were answered
        return $scope.quiz.questions.length - 1;
    };

    $scope.nextUnanswered = function(){
        var iNext = $scope.getNextUnansweredQuestionIndex();
        $scope.setQuestionByIndex(iNext);
    };


    // ========================================================================
    // =========================== INIT =======================================
    // ========================================================================
    $scope.setQuestionByIndex($scope.getFirstUnansweredIndex());
    $scope.updateCompletionPercent();

    if($scope.isCompleted()){
        $state.go('quizSessionResults', {id: $scope.quiz.id});
    }
    // ========================================================================
    // ========================================================================
    // ========================================================================


    // is used in
    //      assets/app/common/question/detail/answer/questionAnswer.tpl.html
    // to determine whether to show "check question" or "submit & next"
    $scope.sessionRunning = true;

    $scope.onQuestionSubmit = function(question){
        //question.session = $scope.quizSession;

        var answer = $scope.question.userAnswer;



        //delete $scope.question.answer;
        //$scope.question.inSession = true; // flag to update 
        actionHandler.ANSWER_QUESTION($scope.question, answer, $scope.quizSession)
        .then(function(result){
            $scope.result = result;

            var quizSessionAnswerEntry = {
                answer: answer, // userAnswer
                answerCorrect: result.correct,
                correctAnswer: 'TODO!!' // TODO: include correct answer?
            }; 
            $scope.quizSession.answers[question.id] = quizSessionAnswerEntry;

            $scope.updateCompletionPercent();
            $scope.nextUnanswered();

            if($scope.isCompleted()){
                $state.go('quizSessionResults', {id: $scope.quiz.id});
            }
        });
    };

    $scope.nextQuestion = function(){
        var i = $scope.currentQuestionIndex();
        var iNext = (i+1)%$scope.totalQuestions();

        $scope.setQuestionByIndex(iNext);
    };

    $scope.prevQuestion = function(){
        var i = $scope.currentQuestionIndex();
        var iPrev = (i-1 < 0)? $scope.totalQuestions()-1 : i-1;
        $scope.setQuestionByIndex(iPrev);
    };

    $scope.totalQuestions = function(){
        return $scope.quiz.questions.length;
    };

    $scope.currentQuestionIndex = function(){
        return _.indexOf($scope.quiz.questions, $scope.question);
    };
    $scope.currentQuestionNumber = function(){
        return $scope.currentQuestionIndex() + 1;
    };

    $scope.questionAnswered = function(question){
        return $scope.quizSession.answers[question.id];
    };


});
