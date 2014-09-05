
angular.module('app')
.directive('questionTile', function(){

    return {
        restrict: 'AE',
        replace: false, // allow to set class attributes and ng-click
        templateUrl: '/app/common/question/tile/questionTile.tpl.html'
    };
});
