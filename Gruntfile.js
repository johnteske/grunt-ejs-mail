module.exports = function(grunt) {

    var path = require('path');

    function readData(dataPath) {
        var ext = path.extname(dataPath);
        if (ext === '.json') return grunt.file.readJSON(dataPath);
        else if (ext === '.yml') return grunt.file.readYAML(dataPath);
    };

    // load libraries
    var libraries = {},
        libdirs = grunt.file.expand('libs/*/data.{json,yml}');
    libdirs.forEach(
        function(dataPath) {
            var libname = dataPath.split('/')[1],
                thislib = {};

            // add data
            thislib.data = readData(dataPath);

            // load helpers
            var helpers = {},
                helperFiles = grunt.file.expand('libs/' + libname + '/helpers/**/*.js');
            helperFiles.forEach(
                function(filePath) {
                    var basename = path.basename(filePath, '.js'),
                        helperPath = './' + filePath;
                    helpers[basename] = require(helperPath)[basename];
                }
            );
            thislib.helper = helpers;

            // add partial path, relative to project folders
            thislib.partials = '../../libs/' + libname + '/partials/';

            libraries[libname] = thislib;
        }
    );

    var project = 'project/',
        dir = {
            src: 'src/' + project,
            dist: 'dist/' + project
        };

    var defaultTasks = ['ejs', 'sass', 'juice', 'replace'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ejs: {
            all: {
                options: {
                    // libraries are dynamically added after config
                    // could also be loaded as helper?
                    getData: function(path) {
                        return readData(dir.src + path);
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

        replace: {
            dist: {
                options: {
                    silent: true,
                    patterns: [
                        { match: /\sclass=["'][\w \-]*['"]/g, replacement: '' }, // remove CSS classes
                        { match: /[\s]*<!--[\S\s]*?-->/g, replacement: '' }, // remove HTML comments // possibly end with [\n\r]*
                        { match: /^$/gm, replacement: '' }, // remove empty lines
                        // { match: 'EMAILNAME', replacement: '<%= emailName %>' }, // replace 'EMAILNAME' with GA tag
                        // { match: '!img', replacement: 'img' } // enable tracking image
                    ]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: dir.dist + '*.html',
                    dest: dir.dist
                }]
            }
        },

        watch: {
            dist: {
                files: [dir.src + '**/*.{ejs,yml,scss}', 'libs/**/{helpers,partials}/**/*.{js,ejs}'],
                tasks: defaultTasks,
                options: {
                    spawn: false,
                    atBegin: true
                }
            },
            configFiles: {
                files: ['Gruntfile.js'],
                tasks: defaultTasks,
                options: { reload: true }
            }
        },

    });

    // dynamically add libraries
    var lib_config = { ejs: { all: { options: {} } } };
    Object.keys(libraries).forEach(function(item) {
        lib_config.ejs.all.options[item] = libraries[item];
    });
    grunt.config.merge(lib_config);

    grunt.loadNpmTasks('grunt-ejs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-juice');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', defaultTasks);

};
