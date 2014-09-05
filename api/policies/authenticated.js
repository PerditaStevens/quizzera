module.exports = function(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }else{
      if(req.isSocket || req.wantsJSON){
          return res.json({status: 403, message: 'Not Authorized' });
          //return res.json({message: 'Not Authorized' });
      } else {
          return res.send(403, { message: 'Not Authorized' });
      }
    //return res.forbidden('You are not permitted to perform this action.');
  }
};
