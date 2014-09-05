
angular.module('app')
.controller('tagsCtrl', function($scope, Search, Pagination) {
    $scope.tags = [];

    $scope.tagSearch = {
        text: '',
        handle: function(){
            updateTags();
        }
    };


    // pagination
    // ===============
    var pg = Pagination.getOrCreate('tags');
    pg.limit = 12;
    pg.onChange(updateTags);

    function updateTags(){
        var params = {
            page: pg.page,
            limit: pg.limit,
            search: $scope.tagSearch.text
        };
        pg.updateTotalCount(Search.totalCount.tags(params));
        Search.tags(params).then(function(tags){
            $scope.tags = tags;
        });
    }
    updateTags();

});
