module.exports = function(grunt) {

    var project = 'project/';

    var dir = {
        src: 'src/' + project,
        dist: 'dist/' + project
    };

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
                        return grunt.file.readYAML(dir.src + path);
                    }
                },
                cwd: dir.src,
                src: '**/*.ejs',
                dest: dir.dist,
                expand: true,
                ext: '.html',
            },
        },

        sass: {
            build: {
                files: [{
                    expand: true,
                    cwd: dir.src,
                    src: '*.scss',
                    dest: dir.dist + 'styles',
                    ext: '.css'
                }]
            }
        },

        juice: {
            options: {
                widthElements: ['table', 'td', 'img'], // heightElements: ['img'], // this seems to be a juice option--is it available in grunt-juice?
                applyWidthAttributes: true,
                webResources: { images: false }
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: dir.dist,
                    src: '*.html',
                    dest: dir.dist
                }]
            }
        },

        watch: {
            source: {
                files: dir.src + '**/*.ejs',
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
    grunt.loadNpmTasks('grunt-juice');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['ejs']);

};
