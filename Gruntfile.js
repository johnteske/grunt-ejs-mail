module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // data: grunt.file.readJSON('data.json'),

        ejs: {
            all: {
                options: {
                    title: 'My Email',
                    url: function(url) {
                        return 'http://example.com/' + url;
                    },
                },
                cwd: 'src/',
                src: '**/*.ejs', // '!partials/**/*'],
                dest: 'dist/',
                expand: true,
                ext: '.html',
                },
            },
        });

    grunt.loadNpmTasks('grunt-ejs');
    grunt.registerTask('default', ['ejs']);

};
