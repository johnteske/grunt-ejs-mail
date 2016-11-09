var gulp = require('gulp'),
    util = require('gulp-util'),
    flatten = require('gulp-flatten'),
    del = require('del'),
    ejs = require('gulp-ejs'),
    sass = require('gulp-sass'),
    inline = require('gulp-inline-css'),
    plumber = require('gulp-plumber');

production = !!util.env.dist;
project = util.env.project + '/';
dir = {
        source: 'src/' + project,
        dest: 'build/' + project
    };

var files = {
        data: ['{libs/,' + dir.source + '}**/*.{json,yml}'],
        partials: ['libs/*/partials/*.ejs'],
        sass: [dir.source + '*.scss', 'libs/*/styles/*.scss'],
        ejs: [dir.source + '**/!(_)*.ejs'],
        _ejs: [dir.source + '**/_*.ejs'] // project partials
    };

var libraries = require('./libraries.js').loadLibraries();

var ejs_options = {
    production: production
};
// add library helpers and partials for access in ejs
for (var attrname in libraries) { ejs_options[attrname] = libraries[attrname]; }

var library = (util.env.library || 'core') + '/';
gulp.task('new', function() {
    return gulp.src('libs/' + library + 'templates/**/*')
    .pipe(gulp.dest(dir.source));
});

gulp.task('sass', function() {
    return gulp.src(files.sass)
    .pipe(sass())
    .pipe(flatten())
    .pipe(gulp.dest(dir.dest + 'styles'));
});

gulp.task('build', ['sass'], function() {
    return gulp.src(files.ejs)
    .pipe(plumber())
    .pipe(ejs(ejs_options, {ext:'.html'})
        .on('error', util.log))
    .pipe(gulp.dest(dir.dest))
    .pipe(inline({
        applyWidthAttributes: true,
        applyTableAttributes: true, // border, cellpadding and cellspacing
        removeHtmlSelectors: true
    }))
    .pipe(gulp.dest(dir.dest));
});

gulp.task('clean', function () {
    return del('build/**/*');
});

gulp.task('watch', function() {
    // gulp.watch(['libs/*/templates/*'], ['new']); // for developing templates
    gulp.watch([files.data, files.partials, files.sass, files.ejs, files._ejs], ['build']);
});

gulp.task('default', ['build', 'watch']);
