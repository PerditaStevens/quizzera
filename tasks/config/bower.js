/**
 * Install bower components.
 *
 * ---------------------------------------------------------------
 *
 * Installs bower components and copies the required files into the assets folder structure.
 *
 */

module.exports = function(grunt) {

    grunt.config.set('bower', {
        install: {
            options: {
                targetDir: './assets/vendor',
                layout: 'byComponent',
                install: true,
                verbose: true,
                cleanup: true,
                //cleanTargetDir: false,
                //cleanBowerDir: true,
                bowerOptions: {}
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
};
