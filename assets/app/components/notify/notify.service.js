
angular.module('app')
.factory('notifier', function(notify, $sailsPromised) {

  notify.config({
      duration: 5000,
      template:'/app/components/notify/gmail.tpl.html'
  });

  $sailsPromised.on('info', function(msg){
      notifyInfo(msg)
  })
  $sailsPromised.on('error', function(msg){
      // TODO: error!
      notifyInfo(msg)
  })

  function notifyInfo(msg){
      notify({ message: msg});
  }


  return {
      info: notifyInfo,
      error: notifyInfo,
  }

});
