var gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    flatten = require('gulp-flatten'),
    del = require('del'),
    yaml = require('js-yaml'),
    ejs = require('gulp-ejs'),
    sass = require('gulp-sass'),
    inline = require('gulp-inline-css');

var project = 'project/',
    dir = {
        source: 'src/' + project,
        dist: 'dist/' + project
    },
    files = {
        data: glob.sync('{libs,'+ dir.source +'}/**/*.{json,yml}'),
        sass: [dir.source + '*.scss', 'libs/*/styles/*.scss'],
        ejs: [dir.source + '/**/*.ejs']
    };

function readData(dataPath) {
    var ext = path.extname(dataPath);
    if (ext === '.json') return JSON.parse(fs.readFileSync(dataPath));
    else if (ext === '.yml') return yaml.safeLoad(fs.readFileSync(dataPath, 'utf-8'));
};

// load libraries
var libraries = {},
    libdata = glob.sync('libs/*/data.{json,yml}');
libdata.forEach(
    function(dataPath) {
        var libname = dataPath.split('/')[1],
            thislib = {};

        // add data
        thislib.data = readData(dataPath);

        // load helpers
        var helpers = {},
            helperFiles = glob.sync('libs/' + libname + '/helpers/**/*.js');
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

var ejs_options = { readData: function(path){ return readData(path) } };
for (var attrname in libraries) { ejs_options[attrname] = libraries[attrname]; }

gulp.task('sass', function() {
    return gulp.src(files.sass)
    .pipe(sass())
    .pipe(flatten())
    .pipe(gulp.dest('dist/' + project + 'styles'));
});

gulp.task('build', ['sass'], function() {
    return gulp.src(files.ejs)
    .pipe(ejs(ejs_options, {ext:'.html'})
        .on('error', gutil.log))
    .pipe(gulp.dest(dir.dist))
    .pipe(inline())
    .pipe(gulp.dest(dir.dist));
});

gulp.task('clean', function () {
  return del(['dist/**/*']);
});

gulp.task('watch', function() {
    gulp.watch([files.data, files.sass, files.ejs], ['build']); // dynamically add lib files -- for watch only (helpers and partials)
});

gulp.task('default', ['build', 'watch']);
