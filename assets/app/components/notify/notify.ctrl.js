


// TODO: combine with notifier Factory?
// 
angular.module('app')
.controller('notifyCtrl', function($scope, $timeout, notify, $sails) {
  $scope.messages = [];

  notify.config({
      duration: 5000,
      template:'/app/components/notify/gmail.tpl.html'
  });

  $scope.$watch('messages', function(msg){
      _.each($scope.messages, function(msg, i){
              notify({ message: msg});
              //$scope.messages = [];
      });
  });

  $sails.on('info', function(msg){
      notify({ message: msg});
  })
  $sails.on('error', function(errMsg){
      notify({ message: errMsg});
  })
});
