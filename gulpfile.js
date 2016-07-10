var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    ejs = require('gulp-ejs'),
    sass = require('gulp-sass'),
    inline = require('gulp-inline-css');

var project = 'project/',
    dir = {
        source: 'src/' + project,
        dist: 'dist/' + project
    },
    files = {};

files.data = [dir.source + '*.json', dir.source + '*.yml', 'libs/core/data.json'];

function readData(dataPath) {
    var ext = path.extname(dataPath);
    if (ext === '.json') return JSON.parse(fs.readFileSync(dataPath));
    else if (ext === '.yml') return yaml.safeLoad(fs.readFileSync(dataPath, 'utf-8'));
};

files.sass = [dir.source + '*.scss', 'libs/core/styles/*.scss']; // dynamically add lib files
gulp.task('sass', function() {
    return gulp.src(files.sass)
    .pipe(sass())
    .pipe(gulp.dest('dist/' + project + 'styles'));
});

files.ejs = [dir.source + '/**/*.ejs'];
gulp.task('build', ['sass'], function() {
    return gulp.src(files.ejs)
    .pipe(ejs(
        {   // placeholder data
            readData: function(path){ return readData(path) }, // requires full path
            json: readData('./libs/core/data.json')
        },
        {ext:'.html'}
    ).on('error', gutil.log))
    .pipe(gulp.dest(dir.dist))
    .pipe(inline())
    .pipe(gulp.dest(dir.dist));
});

gulp.task('watch', function() {
    gulp.watch([files.data, files.sass, files.ejs], ['build']); // dynamically add lib files -- for watch only (helpers and partials)
});

gulp.task('default', ['build', 'watch']);
