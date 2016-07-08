var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    ejs = require('gulp-ejs');

var project = 'project/';

var data = {}; // placeholder data
data.json = JSON.parse(fs.readFileSync('./libs/core/data.json'));
data.yaml = yaml.safeLoad(fs.readFileSync('./src/project/data.yml', 'utf-8'));

gulp.task('ejs', function() {
    return gulp.src('src/' + project + '/**/*.ejs')
        .pipe(
            ejs(
                {
                    json: data.json,
                    yaml: data.yaml
                },
                {ext:'.html'}
            ).on('error', gutil.log))
        .pipe(gulp.dest('dist/' + project))
});

gulp.task('watch', function() {
    gulp.watch(['src/' + project + '/**/*.ejs'], ['ejs']);
});

gulp.task('default', ['ejs', 'watch']);
