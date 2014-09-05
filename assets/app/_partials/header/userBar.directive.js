
angular.module('app')
.directive('userBar', function($location){
    return {
        restrict: 'AE',
        replace: true,
        link: function($scope){
            $scope.gotoUserProfile = function(userId){
                $location.path('/user/'+userId);
            };
        },
        templateUrl: '/app/_partials/header/userBar.tpl.html'
    };
});
