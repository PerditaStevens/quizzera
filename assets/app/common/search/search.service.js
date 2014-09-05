
angular.module('app')
.factory('Search', function(Restangular){

    return {

        // TOTAL COUNTS
        // =================
        // all return promises with object {count: int}
        //
        totalCount: {
            users: function(params){
                return Restangular
                .oneUrl('totalCount', 'users?count=true')
                .get(params);
            },
            userAttribute: function(userId, attr, params){
                return Restangular
                .oneUrl('totalCount', 'users/'+userId+'/'+attr+'?count=true')
                .get(params);
            },
            questions: function(params){
                return Restangular
                .oneUrl('totalCount', 'questions?count=true')
                .get(params);
            },
            quizzes: function(params){
                return Restangular
                .oneUrl('totalCount', 'quizzes?count=true')
                .get(params);
            },
            tags: function(params){
                return Restangular
                .oneUrl('totalCount', 'tags?count=true')
                .get(params);
            }
        },


        // SEARCH
        // =================
        // all return promises with data
        // 
        questions: function(params){
            //return Restangular.all('questions').getList(params).$object;
            return Restangular.all('questions').getList(params);
        },
        quizzes: function(params){
            //return Restangular.all('quizzes').getList(params).$object;
            return Restangular.all('quizzes').getList(params);
        },
        users: function(params){
            //return Restangular.all('users').getList(params).$object;
            return Restangular.all('users').getList(params);
        },
        userAttribute: function(userId, attr, params){
            //return Restangular.one('users', userId).getList(attr, params).$object;
            return Restangular.one('users', userId).getList(attr, params);
        },

        tags: function(params){
            return Restangular.all('tags').getList(params);
        },

    };
});
