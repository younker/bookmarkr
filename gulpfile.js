var gulp = require('gulp');
var browserify = require('browserify');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');

gulp.task('watch', function () {
   gulp.watch('./src/css/*.scss', ['sass']);
   gulp.watch('./src/js/*.js', ['browserify']);
});

gulp.task('sass', function() {
  return gulp.src('./src/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./build/css/'))
});

gulp.task('clean', function() {
  return gulp.src('build/*', {read: false})
    .pipe(clean());
});

gulp.task('browserify-background', function() {
  return browserify('./src/js/background.js')
    .bundle()
    .pipe(source('background.js'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('browserify-popup', function() {
  return browserify('./src/js/popup.js')
    .bundle()
    .pipe(source('popup.js'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('browserify', ['browserify-background', 'browserify-popup']);

gulp.task('default', ['clean', 'sass', 'browserify']);
