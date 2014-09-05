
angular.module('app')
.directive("navbar", function($location, $rootScope, $compile) {

    function getHash(href){
        var parser = document.createElement('a'),
            hash;
        parser.href = href;
        hash = parser.hash.replace('#', '');
        return hash? hash : '/';
    }

    function markActiveLink(nav,  $scope){
        var currentPath = $location.path();
        $(nav).find('li')
        .removeClass('active')
        .each(function(i, li){
            var href = $(li).find('a').prop('href');
            var hash = getHash(href);
            if(currentPath === hash){
                $(li).addClass('active');
                $compile($(li))($scope);
            }
        });
    }

    return {
        restrict: "EA",
        transclude: true,
        template: '<div ng-transclude></div>',
        link: function($scope, navEl){
            markActiveLink(navEl, $scope);
            $rootScope.$on('$locationChangeSuccess', function(){
                markActiveLink(navEl, $scope);
            });
        },
    };
});
