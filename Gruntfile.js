module.exports = function(grunt) {

    var project = 'src/' + 'project' + '/';

    // load helpers
    var helper = {};

    var helperFiles = grunt.file.expand( {cwd: 'helpers'}, ['**/*.js'] );
    helperFiles.forEach(
        function(fileName) {
            var basename = fileName.split('.')[0];
            helper[basename] = require('./helpers/' + fileName)[basename];
        }
    );

    // testing
    // helper.dummy('http://example.com', 'null');
    // helper.url_utm('http://example.com', 'CAMPAIGN');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // add global data
        // company, logo, social links, etc.
        // data: grunt.file.readJSON('data.json'),

        ejs: {
            all: {
                options: {
                    helper: helper,
                    title: 'My Email',
                    url: function(url) {
                        return 'http://example.com/' + url;
                    },
                    getData: function(path) {
                        return grunt.file.readYAML(project + path);
                    }
                },
                cwd: 'src/',
                src: '**/*.ejs',
                dest: 'dist/',
                expand: true,
                ext: '.html',
            },
        },

        sass: {
            build: {
                files: [{
                    expand: true,
                    cwd: project,
                    src: ['*.scss'],
                    dest: project + 'styles',
                    ext: '.css'
                }]
            }
        },

        watch: {
            source: {
                files: 'src/**/*.ejs',
                tasks: 'ejs',
                options: {
                    spawn: false,
                    atBegin: true
                }
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        },

    });

    grunt.loadNpmTasks('grunt-ejs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['ejs']);

};
