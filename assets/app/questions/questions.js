
angular.module('app')
.controller('questionsCtrl', function($scope, Search, Pagination) {
    $scope.questions = [];
    $scope.questionSearch = {
        text: '',
        tags: [],
        handle: function(){
            updateQuestions();
        }
    };

    // question creation
    // =================

    $scope.show = {
        questionCreation: false
    };

    $scope.toggleQuestionCreation = function(){
        $scope.show.questionCreation = !$scope.show.questionCreation;
    };

    $scope.status = {
        open: false,
        disabled: true
    };

    $scope.openQuestionCreation = function(){
        // only open if user is logged in
        if(currentUser){
            $scope.status.open = !$scope.status.open;
        }
    };




    // pagination
    // ===============
    var pg = Pagination.getOrCreate('questions');
    pg.onChange(updateQuestions);

    function updateQuestions(){
        var params = {
            page: pg.page,
            limit: pg.limit,
            search: $scope.questionSearch.text,
            populate: 'author'
        };
        pg.updateTotalCount(Search.totalCount.questions(params));
        Search.questions(params).then(function(questions){
            $scope.questions = questions;
        })
    }
    updateQuestions();


});
