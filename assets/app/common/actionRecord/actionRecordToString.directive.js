
angular.module('app')
.directive('actionRecordToString', function(){

    return {
        restrict: 'AE',
        replace: true,
        templateUrl: '/app/common/actionRecord/actionRecordToString.tpl.html',
        controller: function($scope){
            var user = $scope.user;
            var record = $scope.record;

            $scope.actionTypeToString = function(){
                var actionType = record.actionType;
                switch(actionType){
                    case 'VOTE_UP':
                        return 'vote up';
                    case 'VOTE_DOWN':
                        return 'vote down';
                    case 'CREATE_QUESTION':
                    case 'CREATE_QUIZ':
                        return 'create';
                    case 'ANSWER_QUESTION':
                        return 'answer';
                }
                return '['+actionType+']';
            };
            /**
             *  Determine whether user is the actor in a given action.
             *
             *  @return {bool}
             */
            $scope.isActor = function(){
                return (user.id === (record.actor.id || record.actor));
            };

            /**
             *  Determine whether user is the target owner in a given action.
             *
             *  @return {bool}
             */
            $scope.isTargetOwner = function(){
                return (record.targetOwner && user.id === (record.targetOwner.id || record.targetOwner));
            };

            /**
             *  Determine user's role in given action.
             *  @throws {Error} if user was not involved in action
             *
             *  @return {string} [actor|target|targetOwner]
             */
            $scope.getUserRole = function(){
                if($scope.isActor(record)){
                    return 'actor';
                }
                if($scope.isTargetOwner(record)){
                    return 'targetOwner';
                }
                if(record.target && user.id === (record.target.id || record.target)){
                    return 'target';
                }
                throw new Error('User '+ user.username +' was not involved in given action: '+ record);
            };

            /**
             *  Get reward according to user's role in action
             *
             *  @return {int}
             */
            $scope.getReward = function(){
                var reward = record.rewards[$scope.getUserRole(record)];
                return reward? reward : 0;
            };

        },
        scope: {
            record: '=actionRecordToString',
            user: '='
        }
    };
});
