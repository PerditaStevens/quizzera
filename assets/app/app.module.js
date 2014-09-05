
// this file should be small and it will serve mainly as a namespace.

angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'restangular',
    'ngCookies',
    'ngSails',
    'ngSanitize',
    'ngAnimate',
    'mgcrea.ngStrap',
    'cgNotify',
    'ngTagsInput',
    'truncate',
    'ngStorage',
    'angularMoment',
    'underscore',           // to explicitly inject underscore as a dependency
    'angular-underscore',    // have access to underscore function/filters in templates
    'ui.utils',     // TODO: only include what is used!
])

.run(function($rootScope, $window) {
    $rootScope.$on('$routeChangeSuccess', function(){
        $window.scrollTo(0,0);    //scroll to top of page after each route change
    });

})

.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
    //$urlRouterProvider.when('/quizzes/:id', '/quizzes/:id/questions');

    $stateProvider

     .state('home', {
         url: '/',
         templateUrl : '/app/home/home.html',
         controller  : 'homeCtrl'
     })

     .state('tags', {
         url: '/tags',
         templateUrl : '/app/tags/tags.html',
         controller  : 'tagsCtrl'
     })

     .state('questions', {
         url: '/questions',
         templateUrl : '/app/questions/questions.html',
         controller  : 'questionsCtrl'
     })

     .state('question', {
         url: '/question/:id',
        templateUrl : '/app/questions/detail/questionDetail.html',
        controller  : 'questionDetailCtrl',
        resolve: {
            question: function($stateParams, Restangular){

                //return Restangular.one('questions', $route.current.params.id)
                return Restangular.one('questions', $stateParams.id)
                .get({populate: 'author'})
                .then(function(question){
                    return question.plain();
                });
            },
        }
     })

     .state('quizzes', {
         url: '/quizzes',
         templateUrl : '/app/quizzes/quizzes.html',
         controller  : 'quizzesCtrl'
     })

     .state('quizCreation', {
         url: '/quizzes/create',
         templateUrl : '/app/quizzes/create/quizCreate.html',
         controller  : 'quizCreateCtrl',
     })

     .state('quiz', {
         //abstract: true,
         url: '/quizzes/:id',
         templateUrl : '/app/quizzes/detail/quizDetail.html',
         controller  : 'quizDetailCtrl',
         resolve: {
             quiz: function($stateParams, Restangular){
                 return Restangular.one('quizzes', $stateParams.id).get({
                     populate: 'author,questions'
                 }).then(function(quiz){
                     quiz.questions = quiz.getList('questions').$object;
                     return quiz;
                 });
             },
         },
     })

     .state('quizSession', {
         url: '/quizzes/:id/session',
         templateUrl : '/app/quizzes/session/quizSession.html',
         controller  : 'quizSessionCtrl',
         resolve: {
             quiz: function($stateParams, Restangular){
                 return Restangular.one('quizzes', $stateParams.id).get()
                 .then(function(quiz){
                     return quiz.getList('questions').then(function(questions){
                         quiz.questions = questions;
                         return quiz;
                     });
                 });
             },
             quizSession: function($stateParams, Restangular, Session, notifier){
                 // first create session (if not exists)
                 // then fetch session
                 return Restangular.all('action').customGET('START_QUIZ/'+$stateParams.id)
                 .then(function(res){
                     if(res.success){
                         notifier.info('Starting new Quiz.');
                     } else {
                         notifier.info('Resuming Quiz.');
                     }
                     return Restangular.all('quiz-sessions').getList({
                         quiz: $stateParams.id,
                         user: Session.user.id
                     })
                     .then(function(quizSession){
                         return quizSession[0];
                     });
                 });

             }
         }
     })

     // TODO: overhead, doing the same as quizSessionResults state?
     .state('quizSessionResults', {
         url: '/quizzes/:id/session/results',
         templateUrl: '/app/quizzes/session/quizSessionResults.html',
         controller  : 'quizSessionResultsCtrl',
         resolve: {
             quiz: function($stateParams, Restangular){
                 return Restangular.one('quizzes', $stateParams.id).get()
                 .then(function(quiz){
                     return quiz.getList('questions').then(function(questions){
                         quiz.questions = questions;
                         return quiz;
                     });
                 });
             },
             quizSession: function($stateParams, Restangular, Session, notifier){
                 // first create session (if not exists)
                 // then fetch session
                 return Restangular.all('action').customGET('START_QUIZ/'+$stateParams.id)
                 .then(function(res){
                     if(res.success){
                         notifier.info('Starting new Quiz.');
                     } else {
                         notifier.info('Resuming Quiz.');
                     }
                     return Restangular.all('quiz-sessions').getList({
                         quiz: $stateParams.id,
                         user: Session.user.id
                     })
                     .then(function(quizSession){
                         return quizSession[0];
                     });
                 });

             }
         }
     })


     .state('users', {
         url: '/users',
         templateUrl : '/app/users/users.html',
         controller  : 'usersCtrl'
     })

     .state('user', {
         url: '/user/:id',
         templateUrl : '/app/users/profile/user-profile.html',
         controller  : 'userProfileCtrl',
         resolve: {
             user: function($stateParams, Restangular){
                 return Restangular.one('users', $stateParams.id).get({
                     // to fill stats
                     //  > "questions created"
                     //  > "quizzes created"
                     //  (TODO: slight overkill...)
                     populate: 'questions,quizzes'
                 }).then(function(user){
                     return user;
                 });
             },
             stream: function($stateParams, Restangular){
                 return Restangular.one('users', $stateParams.id).getList('stream')
                 .then(function(stream){
                     return stream;
                 });
             },
             quizSessions: function($stateParams, Restangular){
                 return Restangular.all('quiz-sessions').getList({
                     user: $stateParams.id
                 })
                 .then(function(quizSessions){
                     return quizSessions;
                 });
             },
         }
     });

})
.controller('scotchController', function($scope) {
    
    $scope.message = 'test';
   
    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];
    
})


.controller('appCtrl', function($scope, USER_ROLES, authService, $rootScope, AUTH_EVENTS, Session, $sailsPromised) {
    $scope.currentUser = Session.user;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = authService.isAuthorized;

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
        $scope.currentUser = Session.user;
    });

    // keep the user up to date
    // TODO: implement with socket subscriptions
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        Session.refresh().then(function(user){
            $scope.currentUser = user;
        });
    });

    //$sailsPromised.on('users/'+currentUser.id)
    $sailsPromised.on('omg', function(msg){
        console.log('[socket test] socket:omg', msg);
    });

    $sailsPromised.on('user', function(data){
        console.log('[socket test] socket:user', data);
        //if(data.id === $scope.currentUser.id){
            //$scope.currentUser.stats.reputation += 99;
        //}
    });

    // =============================================================================
    // ============================= LOGIN HANDLING ================================
    // =============================================================================
    $scope.credentials = {
        identifier: '',
        password: ''
    };
    $scope.login = function (credentials) {
        authService.login(credentials).then(function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };


    // =============================================================================
    // ============================= @@@ DEV @@@====================================
    // ==>>>>>>>>>>>>>>>>>>>>>>>>>>>> auto login <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<==
    // =============================================================================
//    $scope.login({
//        identifier: 'tsterker',
//        password: 'abcd1234'
//    });

})

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

.service('Session', function ($cookieStore, Restangular, $rootScope) {
  this.create = function (sessionId, user, userRole) {
    this.id = sessionId;
    this.user = user;
    this.userRole = userRole;
  };

  this.destroy = function () {
    this.id = null;
    this.user = null;
    this.userRole = null;
  };

  var self = this;
  this.refresh =  function(){
      if(!self.user){
          return {then: function(){}};
      }
      return Restangular.one('users', self.user.id).get().then(function(user){
          self.user = user;
          return user;
      });
  };


    // upon initialization, read cookie form server,
    // save the login status, then discard the cookie.
    // (src: http://www.frederiknakstad.com/2013/01/21/authentication-in-single-page-applications-with-angular-js/)
    var userCookie = $cookieStore.get('user') || {};
    this.create(userCookie.sessionId, userCookie.user, userCookie.role);

  return this;
})

.factory('authService', function($sailsPromised, Session){

    return {
        login: function (credentials) {
            return $sailsPromised
            .post('/auth/socketLogin', credentials)
            .then(function (res) {
                Session.create(res.id, res.user, res.role);
            });
        },
        isAuthenticated: function () {
            return !!Session.user;
        },
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (this.isAuthenticated() &&
                    authorizedRoles.indexOf(Session.userRole) !== -1);
        }
    };

})



.factory('tpl', function(){
    var rootPath = '/app/components/';
    var path = {
        root: rootPath,
        quiz: rootPath+'quiz/tpl/',
        question: rootPath+'question/tpl/',
        user: rootPath+'user/tpl/',
        header: '/app/header/tpl/',
        pagination: rootPath+'pagination/'
    };
    var templatePaths = angular.extend({}, path);
    return angular.extend(templatePaths, {
        header: {
            loginStatus: {
                loggedIn: path.header + 'loggedIn.tpl.html',
                loggedOut: path.header + 'loggedOut.tpl.html',
            }
        },
        component: {
            pagination: path.pagination+'pagination.tpl.html',
            modal: path.root+'modal/modal.tpl.html'
        },
        search: {
            mixed: path.root+'search/mixedSearch.tpl.html'
        },
        User: {
            infoTile:   path.user+'userInfoTile.tpl.html',
            stats:   path.user+'userStats.tpl.html',
            page:   path.user+'userPage.tpl.html',
            profile:   path.user+'userProfile.tpl.html',
        },
        Quiz: {
            summary: path.quiz+'quizSummary.tpl.html',
            create:  path.quiz+'quizCreate.tpl.html',
            createx:  '/app/quiz/create/quizCreate.tpl.html',
            createQuestion:  '/app/quiz/create/quizCreateQuestion.tpl.html',
            createQuestionTrueOrFalse:  '/app/quiz/create/question/true-or-false.tpl.html',
            createQuestionMultipleChoice:  '/app/quiz/create/question/multiple-choice.tpl.html'
        },
        Question: {
            answerView:        path.question+'questionAnswerView.tpl.html',
            summary:        path.question+'questionSummary.tpl.html',
            detail:         path.question+'questionDetailModal.tpl.html',
            create:         path.question+'questionCreate.modal.tpl.html',
            type: {
                create: {
                    multipleChoice: path.question+'/type/create/multiple-choice.tpl.html',
                    trueOrFalse:    path.question+'/type/create/true-or-false.tpl.html'
                },
                answer: {
                    multipleChoice: path.question+'/type/answer/multiple-choice.tpl.html',
                    trueOrFalse:    path.question+'/type/answer/true-or-false.tpl.html'
                }
            }
        }
    });
});
