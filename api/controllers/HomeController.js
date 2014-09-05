/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    // Only purpose of this controler for now is,
    // that the policies need to be executed on the root
    // which only happens if a controller is attached to the route
    home: function (req, res) { 
        sails.log.note('auth:'+req.isAuthenticated(), __filefn);

        if(req.user && !_.isUndefined(req.user.id)){
            User.findOne(req.user.id)
            .populate('stats')
            .populate('quizSessions')
            .then(function(user){
                res.cookie('user', JSON.stringify({
                    user: user,
                    sessionId: req.session.id
                }));
                res.view('home');
            });
        } else {
            res.cookie('user', JSON.stringify({
                user: req.user,
                sessionId: req.session.id
            }));
            res.view('home');
        }
    }
};

