module.exports = function(grunt) {

    var lib = {
        dir: 'core/'
    };
    lib.data = grunt.file.readJSON(lib.dir + 'data.json');

    var project = 'project/',
        dir = {
            partials: lib.dir + 'partials/',
            helper: lib.dir + 'helpers/',
            src: 'src/' + project,
            dist: 'dist/' + project
        };

    // load helpers
    var helper = {},
        helperFiles = grunt.file.expand( {cwd: dir.helper}, ['**/*.js'] );
    helperFiles.forEach(
        function(fileName) {
            var basename = fileName.split('.')[0];
            var helperPath = './' + dir.helper + fileName;
            helper[basename] = require(helperPath)[basename];
        }
    );

    var defaultTasks = ['ejs', 'sass', 'juice', 'replace'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ejs: {
            all: {
                options: {
                    lib: lib,
                    helper: helper,
                    // could also be loaded as helper
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
                files: [dir.src + '**/*.{ejs,yml,scss}', dir.partials + '**/*.ejs', dir.helper + '**/*.js'],
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

    grunt.loadNpmTasks('grunt-ejs');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-juice');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', defaultTasks);

};
