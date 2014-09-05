
angular.module('app')
.directive('myPagination', function(tpl, Pagination){

    function controller($scope){
        $scope.pagination = Pagination.getOrCreate($scope.collection);
    }

    return {
        restrict: 'AE',
        replace: true,
        controller: controller,
        templateUrl: tpl.component.pagination,
        scope: {
            collection: '@myPagination'
        }
    };
});
