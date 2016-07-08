var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    ejs = require('gulp-ejs'),
    sass = require('gulp-sass');

var dirs = {};
var project = 'project/';

var data = {}; // placeholder data
data.json = JSON.parse(fs.readFileSync('./libs/core/data.json'));
data.yaml = yaml.safeLoad(fs.readFileSync('./src/project/data.yml', 'utf-8'));

dirs.ejs = ['src/' + project + '/**/*.ejs'];
gulp.task('ejs', function() {
    return gulp.src(dirs.ejs)
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

dirs.sass = ['src/' + project + '*.scss', 'libs/core/styles/*.scss']; // dynamically add lib files
gulp.task('sass', function() {
    return gulp.src(dirs.sass)
        .pipe(sass())
        .pipe(gulp.dest('dist/' + project + 'styles'));
});

gulp.task('watch', function() {
    gulp.watch(dirs.ejs, ['ejs']); // dynamically add lib files -- for watch only (helpers and partials)
    gulp.watch(dirs.sass, ['sass']);
});

gulp.task('default', ['ejs', 'watch']);
