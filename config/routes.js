/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://links.sailsjs.org/docs/config/routes
 */

module.exports.routes = {
  '/': 'HomeController.home',

  // auth routes
  // ============
  //'get /currentUser': 'AuthController.user',

  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',
  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',
  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
 
  // ActionHandler
  // ============
  //'/ActionHandler/VOTE_UP': 'ActionController.VOTE_UP',

  // ========================================================================================
  // ======================================= REST ===========================================
  // ========================================================================================

  //'get /_users/:id?/:attr?': 'User._REST',

  'get /users': 'User.users',
  'get /user/:id': 'User.user',
  'get /users/:id': 'User.user',
  'get /user/:id/:attr': 'User.userAttributes',
  'get /users/:id/:attr': 'User.userAttributes',


  'get /quizzes': 'Quiz.quizzes',
  'get /quiz/:id': 'Quiz.quiz',
  'get /quizzes/:id': 'Quiz.quiz',
  'get /quizzes/:id/:attr': 'Quiz.quizAttributes',
  'get /quiz/:id/:attr': 'Quiz.quizAttributes',

  'get /quiz-sessions': 'Quiz.quizSessions',
  'get /tags': 'Tag.tags',

  // =======================================================================================
  // ================================= Action Handling =====================================
  // =======================================================================================

  'get /action/START_QUIZ/:id': 'ActionHandlerController.START_QUIZ',
  'get /action/COMPLETE_QUIZ/:id': 'ActionHandlerController.COMPLETE_QUIZ',

  // TODO: refactor to utilise RestQueryBuilder
  'get /questions/:id?/:attr?': 'Question.REST',
  'get /question/:id?/:attr?': 'Question.REST',

  //'post /quiz/create': 'QuizController.create',


  // development
  // ==========
  '/instalogin': 'AuthController.instaLogin',

  // If a request to a URL doesn't match any of the custom routes above,
  // it is matched against Sails route blueprints.  See `config/blueprints.js`
  // for configuration options and examples.

}; 

