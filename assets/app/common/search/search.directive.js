
angular.module('app')
.directive('search', function(){

    return {
        restrict: 'AE',
        replace: true,
        //template: '<input type="text" ng-model="searchText" placeholder="search">',
        templateUrl: '/app/common/search/search.tpl.html',
        link: function($scope){
            $scope.$watch('searchText', function(txt){
                $scope.onSearch(txt);
            });
        },
        scope: {
            searchText: '=',
            onSearch: "="
        }
    };
})
