
angular.module('app')
.directive('questionSummary', function(actionHandler, notifier, $popover){


    return {
        restrict: 'EA',
        replace: true,
        link: function($scope){

            $scope.tagData = {
                tagInput: false,
                tag: ''
            };

            $scope.addTag = function(question){

                // hide and clear input field
                var tag = $scope.tagData.tag;
                $scope.tagData.tagInput = !$scope.tagData.tagInput;
                $scope.tagData.tag = '';

                actionHandler.ADD_TAG('question', question.id, tag).then(function(res){
                    question.tags.push({text: tag});
                });
            };

            $scope.voteUp = function(question){
                actionHandler.VOTE_UP('question', question.id).then(function(res){
                    if(res.success){
                        question.stats.votes++;
                    } else {
                        _.each(res.messages, function(msg){
                            notifier.info(msg);
                        });
                    }
                });
            };

            $scope.voteDown = function(question){
                actionHandler.VOTE_DOWN('question', question.id).then(function(res){
                    if(res.success){
                        question.stats.votes--;
                    } else {
                        _.each(res.messages, function(msg){
                            notifier.info(msg);
                        });
                    }
                });
            };


            $scope.flagData = {
                type: 'SPAM',
                reason: ''
            };

            $scope.flag = function(question){
                var data = _.clone($scope.flagData);
                data.reason = data.reason || 'No reason given.';
                console.log('FLAG', data);
                actionHandler.FLAG('question', question.id, data).then(function(res){
                    if(res.success){
                        // TODO: visual indicator for flags (or only in backend)?
                        notifier.info('Flag submitted.');

                        // TODO: get from server:
                        question.flags.push(data);
                    } else {
                        // TODO: notify user?
                        _.each(res.messages, function(msg){
                            notifier.info(msg);
                        });
                        notifier.info('Flagging failed.');
                    }
                });
            };

        },
        templateUrl: '/app/common/question/summary/questionSummary.tpl.html'
    };
});

