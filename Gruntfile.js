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
                widthElements: ['table', 'td', 'img'],
                applyWidthAttributes: true,
                // heightElements: ['img'],
                // applyHeightAttributes: true,
                    // also useful for tables and other elements?
                    // any exclusions for images that should be allowed to collapse?
                webResources: {
                    strict: true,
                    images: false,
                    scripts: false,
                    // preserveImportant: true,
                    // cssmin: true // test if this causes any rendering issues first
                }
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
                tasks: ['ejs', 'sass', 'juice'],
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
