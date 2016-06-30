module.exports = function(grunt) {

    var project = 'project';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // add global data
        // company, logo, social links, etc.
        // data: grunt.file.readJSON('data.json'),

        ejs: {
            all: {
                options: {
                    title: 'My Email',
                    url: function(url) {
                        return 'http://example.com/' + url;
                    },
                    getData: function(path) {
                        return grunt.file.readYAML('src/' + project + '/' + path);
                    }
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
