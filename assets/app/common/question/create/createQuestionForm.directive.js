

angular.module('app')
.directive('createQuestionForm', function(tpl, Search, notifier, actionHandler, $state, $stateParams){ //, $route){


    function validateQuestion(question){
        var ans = question.answer;

        // client-side validation
        // TODO: provide a angular service for validation

        if(!question.title){
            notifier.info('You have to provide a question title.');
            return false;
        }
        if(!question.description){
            notifier.info('You have to provide a description text.');
            return false;
        }

        switch(question.questionType){
            case 'MULTIPLE_CHOICE':
                if(ans.options.length < 2 || !_.every(_.pluck(ans.options, 'length'))){
                notifier.info('You need to provide at least 2 options.');
                return false;
            }
            if(_.isUndefined(ans.correctOption)){
                notifier.info('You need to select a correct option.');
                return false;
            }
            break;
            case 'TRUE_OR_FALSE':
                if(_.isUndefined(ans.isTrue)){
                notifier.info('You have to selct whether the question is true of false.');
                return false;
            }
        }
        return true;
    }


    function ctrl($scope){
        $scope.question = {
            questionType: '',
            answer: {}
        };
        var questionData = {};

        $scope.resetQuestion = function(){

            $scope.question = {
                questionType: '',
                answer: {}
            };
            var questionType = $scope.tabs[$scope.tabs.activeTab].questionType;
            $scope.question.questionType = questionType;
            $scope.question.answer = questionData[questionType];

            // questiondata from outer scope (see above)
            questionData = {
                MULTIPLE_CHOICE: {
                    options: [
                        '',
                        ''
                    ],
                    correctOption: undefined
                },
                TRUE_OR_FALSE: {
                    isTrue: undefined
                }
            };

        };

        $scope.tabs = [
            {
                //'type': 'multiple-choice',
                'questionType': 'MULTIPLE_CHOICE',
                'title': 'Multiple Choice',
                template: '/app/common/question/create/multiple-choice.tpl.html'
            },
            {
                'questionType': 'TRUE_OR_FALSE',
                'title': 'True/False',
                template: '/app/common/question/create/true-or-false.tpl.html'
            }
        ];
        $scope.tabs.activeTab = 1;

        // initially RESET QUESTION!!!
        // =================================
        $scope.resetQuestion();


        $scope.$watch('tabs.activeTab', function(currentTab){
            var questionType = $scope.tabs[currentTab].questionType;
            $scope.question.questionType = questionType;
            $scope.question.answer = questionData[questionType];
        });

        $scope.loadTags = function(searchText){
            return Search.tags({
                search: searchText
            });
        };

        $scope.addQuestion = function(){

            var isValid = validateQuestion($scope.question);

            if(isValid){
                actionHandler.CREATE_QUESTION($scope.question).then(function(result){
                    if($scope.onCreate){
                        $scope.onCreate($scope.question);
                        //resetQuestion();
                        $scope.resetQuestion();
                    }
                    else{
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    }

                });
            }

        };

        // ============================================================================
        // TODO: refactor
        // ============================================================================
        // ============================================================================
        $scope.addMultipleChoiceOption = function(){
            $scope.question.answer.options.push('');
        };

        $scope.removeMultipleChoiceOption = function(index){
            $scope.question.answer.options.splice(index, 1);
        };

        $scope.addMultipleChoiceOptionOnKey = function($event){
            function switchToNextInputField(current){
                var inputs = $('.new-question__type--multiple-choice input[type=text]');
                var currentInputIndex = inputs.index($event.target);
                var nextInput = inputs[currentInputIndex + 1];
                if(nextInput){
                    nextInput.focus();
                    nextInput.select();
                    return true;
                }
                return false;
            }
            if($event.keyCode === 13){   // return key

                var target = $event.target;
                var didSwitch = switchToNextInputField(target);

                // if not switched, additional input field must be created
                if(!didSwitch){
                    $scope.addMultipleChoiceOption();
                    // let angular do it's magic and immediately resume with switching to tab
                    setTimeout(function(){
                        switchToNextInputField(target);
                    }, 0);
                } 
                // don't submit on enter in this case!!
                $event.preventDefault();
                return false;
            }
        };

        // ============================================================================
        // ============================================================================
        // ============================================================================
    }


    return {
        restrict: 'AE',
        replace: true,
        templateUrl: '/app/common/question/create/createQuestionForm.tpl.html',
        controller: ctrl,
        scope: {
            onCreate: '='
        }
    };
});
