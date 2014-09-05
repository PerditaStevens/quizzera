
angular.module('app')
.factory('$sailsPromised', function($sails, $q){

    function handleError (err, msg){
        msg = '[Status '+err.status+'] ' + (msg || 'Error while fething data from server');
        console.error(err);
        throw new Error(msg);
    }

    function promised$sailsConnection(method, route, data){
        var deferred = $q.defer();

        var groupName = '[backend] '+method+' '+route;
        console.groupCollapsed(groupName);
        console.log(data);
        console.groupEnd(groupName);

        if(!$sails.socket.connected){
            $sails.on('connect', function(){
                deferred.resolve($sails[method](route, data));
            });
        } else {
            deferred.resolve($sails[method](route, data));
        }
        return deferred.promise.catch(handleError);
    }

    return {
        get: function(route, data){
            return promised$sailsConnection('get', route, data);
        },
        post: function(route, data){
            return promised$sailsConnection('post', route, data);
        },
        on: function(message, callback){
            return promised$sailsConnection('on', message, callback);
        }
    };
});
