
//var liftSails = false;
var liftSails = true;

if(liftSails){

    var Sails = require('sails');
    var Promise = require('bluebird');
    // create a variable to hold the instantiated sails server
    var app;

    // Global before hook
    before(function(done) {
        this.timeout(10000);


        var rimraf = Promise.promisify(require("rimraf"));

        // remove .tmp folder for a clean start
        console.log('Removing .tmp folder...');
        rimraf('.tmp/')
        .then(function(err){
            // Lift Sails and start the server
            console.log('Lifting Sails...');
            Sails.lift({
                useDummyData: false,    // disable dummy data for a clean start
                log: {
                    level: 'error'
                },

            }, function(err, sails) {
                app = sails;
                done(err, sails);
            });
        });
    });

    // Global after hook
    after(function(done) {
        app.lower(done);
    });

}
