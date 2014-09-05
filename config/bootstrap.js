/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://links.sailsjs.org/docs/config/bootstrap
 */

var Promise = require('bluebird');
var ProgressBar = require('progress');
var barWidth = 20;

// give bootstrap more time to finish
//module.exports.bootstrapTimeout = 5000;
module.exports.bootstrapTimeout = 30000; // allow much time for dummy data creation

module.exports.bootstrap = function(cb) {
    //require('node-monkey').start();

    // NOTE: cb() must be called once done for the server to be lifted
    sails.log.info('Bootstrapping...');

    attachStackInfoToGlobal();

    // init passport
    sails.log.info('... setting up passport.');
    sails.services.passport.loadStrategies();
    setupPassportForSocketRequests();

    // setup sails.log.debug to show file and line
    var logger_debug_old = sails.log.debug;
    sails.log.debug = function(msg) {
        var fileAndLine = traceCaller(1);
        return logger_debug_old.call(this, fileAndLine + ":" + msg);
    };

    var colors = require('colors');
    // add #note() function to print info with file/line/function information
    // supplied as second parameter
    sails.log.note = function(msg, filefn) {
        if(_.isObject(msg)){
            msg = JSON.stringify(msg);
        }
        return console.log((filefn||'')+''+ msg);
    };


    // create dummy data
    if(!sails.config.useDummyData){
        sails.log.info('... skipping dummy data creation.');
        cb();
    } else {
        Promise.reduce([
            checkForEmptyDatabase,
            createDummyUsers,
            handleDummyActionRecords
        ], function(memo, fn){
            return fn();
        }, {})
        .catch(function(err){
            sails.log.warn(err);
        })
        .finally(function(){
            sails.log.info('DONE.');
            sails.log.blank();
            cb();
        })
    }

    function checkForEmptyDatabase(){
        return User.count().then(function(count){
            if(count){
                return Promise.reject('... Database not empty; not creating dummy data.');
            }
            return true;
        });
    }

    function createDummyUsers(){
        sails.log.info('... creating dummy users and their passports.');
        return Promise.resolve(require('./dummyData').users)
        .then(User.create)
        .then(function(users){
            //sails.log.info('... creating passports for dummy users.');
            return _.map(users, function(user){
                return Passport.create({
                    protocol : 'local',
                    password : 'abcd1234',
                    user     : user.id
                });
            });
        })
        .then(function(passports){
            return Promise.all(passports);
        });
    }


    function handleDummyActionRecords(){
        sails.log.info('... handling dummy ActionRecords.');
        var oldLog = sails.log.info;
        sails.log.info = function(msg){
            return oldLog.call(this, '  |  --> '+msg);
        };
        var dummyActionRecords = require('./dummyData').actionRecords;

        function createQuestions(){
            // Note:
            // handle question creation in sequence to prevent issues with Tag.findOrCreate
            // where tags are tried to be created that were already created in the meantime
            var records = dummyActionRecords.CREATE_QUESTION;
            var bar = new ProgressBar('          -> creating questions [:bar] :percent', {
                total: records.length,
                width: barWidth
            });
            return Promise.reduce(records, function(results, record){
                return ActionHandler.handle(record).then(function(res){
                    bar.tick();
                    return res;
                });
            }, {});
        }

        function createQuizzes(){
            var records = dummyActionRecords.CREATE_QUIZ;
            var bar = new ProgressBar('          -> creating quizzes   [:bar] :percent', {
                total: records.length,
                width: barWidth
            });
            return Promise.reduce(records, function(results, record){
                return ActionHandler.handle(record).then(function(res){
                    bar.tick();
                    return res;
                });
            }, {});
        }

        function applyVotes(){
            var records = dummyActionRecords.VOTES;
            var bar = new ProgressBar('          -> voting [:bar] :percent', {
                total: records.length,
                width: barWidth
            });
            return Promise.reduce(records, function(results, record){
                return ActionHandler.handle(record).then(function(res){
                    bar.tick();
                    return res;
                });
            }, {});
        }


        return Promise.resolve()
        .then(createQuestions)
        .then(createQuizzes)
        .then(applyVotes)
        .then(function(){
            sails.log.info = oldLog;
        });
    }

    // hijack the 'router:request' event to plug in passport for socket requests
    // (src: http://stackoverflow.com/a/18343226/1742095)
    function setupPassportForSocketRequests(){
        var passport = require('passport'),
        initialize = passport.initialize(),
        session = passport.session(),
        http = require('http'),
        methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

        sails.removeAllListeners('router:request');
        sails.on('router:request', function(req, res) {
            initialize(req, res, function () {
                session(req, res, function (err) {
                    if (err) {
                        return sails.config[500](500, req, res);
                    }
                    for (var i = 0; i < methods.length; i++) {
                        req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
                    }
                    sails.router.route(req, res);
                });
            });
        });
    }

    /**
     * examines the call stack and returns a string indicating 
     * the file and line number of the n'th previous ancestor call.
     * this works in chrome, and should work in nodejs as well.  
     *
     * @param n : int (default: n=1) - the number of calls to trace up the
     *   stack from the current call.  `n=0` gives you your current file/line.
     *  `n=1` gives the file/line that called you.
     */
    function traceCaller(n) {
        if( isNaN(n) || n<0) n=1;
        n+=1;
        var s = (new Error()).stack
            , a=s.indexOf('\n',5);
        while(n--) {
            a=s.indexOf('\n',a+1);
            if( a<0 ) { a=s.lastIndexOf('\n',s.length); break;}
        }
        b=s.indexOf('\n',a+1); if( b<0 ) b=s.length;
        a=Math.max(s.lastIndexOf(' ',b), s.lastIndexOf('/',b));
        b=s.lastIndexOf(':',b);
        s=s.substring(a+1,b);
        return s;
    }

    /**
     * Expose global getter properties for current line and function.
     * (src: http://stackoverflow.com/questions/14172455/get-name-and-line-of-calling-function-in-node-js)
     *
     * @example Print current function
     *  function foo(){
     *      console.log(__function)
     *  }
     *
     */
    function attachStackInfoToGlobal(){
        Object.defineProperty(global, '__stack', {
            get: function() {
                var orig = Error.prepareStackTrace;
                Error.prepareStackTrace = function(_, stack) {
                    return stack;
                };
                var err = new Error;
                Error.captureStackTrace(err, arguments.callee);
                var stack = err.stack;
                Error.prepareStackTrace = orig;
                return stack;
            }
        });

        Object.defineProperty(global, '__line', {
            get: function() {
                return __stack[1].getLineNumber();
            }
        });

        Object.defineProperty(global, '__function', {
            get: function() {
                return __stack[1].getFunctionName();
            }
        });

        Object.defineProperty(global, '__fn', {
            get: function() {
                var fn = __stack[1].getFunctionName();
                //fn = _.last(fn.split('.'));
                return  '['+fn.yellow+'] ';
            }
        });

        Object.defineProperty(global, '__file', {
            get: function() {
                return traceCaller(1);
            }
        });

        Object.defineProperty(global, '__filefn', {
            get: function() {
                var fn = __stack[1].getFunctionName() || '';
                fn = _.last(fn.split('.'));
                var file = traceCaller(1);
                var txt = '';
                txt += '['.grey;
                txt += file.green;
                txt += ' #'+fn.yellow;
                txt += '] '.grey;
                return txt + ' ';
            }
        });
    }

};
