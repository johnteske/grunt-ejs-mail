var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    ejs = require('gulp-ejs'),
    sass = require('gulp-sass'),
    inline = require('gulp-inline-css');

var dirs = {};
var project = 'project/';

function readData(dataPath) {
    var ext = path.extname(dataPath);
    if (ext === '.json') return JSON.parse(fs.readFileSync(dataPath));
    else if (ext === '.yml') return yaml.safeLoad(fs.readFileSync(dataPath, 'utf-8'));
};

dirs.ejs = ['src/' + project + '/**/*.ejs'];
gulp.task('ejs', function() {
    return gulp.src(dirs.ejs)
        .pipe(
            ejs(
                {   // placeholder data
                    json: readData('./libs/core/data.json'),
                    yaml: readData('./src/project/data.yml')
                },
                {ext:'.html'}
            ).on('error', gutil.log))
        .pipe(gulp.dest('dist/' + project))
        .pipe(inline())
        .pipe(gulp.dest('dist/' + project));
});

dirs.sass = ['src/' + project + '*.scss', 'libs/core/styles/*.scss']; // dynamically add lib files
gulp.task('sass', function() {
    return gulp.src(dirs.sass)
        .pipe(sass())
        .pipe(gulp.dest('dist/' + project + 'styles'));
});

gulp.task('watch', function() {
    gulp.watch(dirs.sass, ['sass']);
    gulp.watch(dirs.ejs, ['ejs']); // dynamically add lib files -- for watch only (helpers and partials)
});

gulp.task('default', ['sass', 'ejs', 'watch']);
