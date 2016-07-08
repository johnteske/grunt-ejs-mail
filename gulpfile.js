var gulp = require('gulp'),
    ejs = require('gulp-ejs');

var project = 'project/';

gulp.task('ejs', function() {
    return gulp.src('src/' + project + '/**/*.ejs')
        .pipe(ejs({}, {ext:'.html'}))
        .pipe(gulp.dest('dist/' + project))
});

gulp.task('watch', function() {
    gulp.watch(['src/' + project + '/**/*.ejs'], ['ejs']);
});

gulp.task('default', ['ejs', 'watch']);
