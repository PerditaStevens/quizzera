
angular.module('app')
.controller('usersCtrl', function($scope, Search, Pagination) {
    $scope.users = [];
    $scope.userSearch = {
        text: '',
        tags: [],
        handle: function(){
            updateUsers();
        }
    };

    // pagination
    // ===============
    var pg = Pagination.getOrCreate('users');
    pg.limit = 12;
    pg.onChange(updateUsers);

    function updateUsers(){
        var params = {
            page: pg.page,
            limit: pg.limit,
            search: $scope.userSearch.text
        };
        pg.updateTotalCount(Search.totalCount.users(params));
        Search.users(params).then(function(users){
            $scope.users = users;
        });
    }
    updateUsers();


})
.directive('userInfoTile', function(tpl){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: '/app/users/userInfoTile.tpl.html',
        scope: {
            user: '=userInfoTile',
            highlightText: '='
        }
    };
});

