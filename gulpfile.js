var gulp = require('gulp');
var browserify = require('browserify');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');

gulp.task('clean', function() {
  return gulp.src(['bookmarkr/*', '!bookmarkr/manifest.json'], {read: false})
    .pipe(clean());
});

gulp.task('sass', function() {
  return gulp.src('./src/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./bookmarkr/css/'))
});

gulp.task('browserify-background', function() {
  return browserify('./src/js/background.js')
    .bundle()
    .pipe(source('background.js'))
    .pipe(gulp.dest('./bookmarkr/js/'));
});

gulp.task('browserify-popup', function() {
  return browserify('./src/js/popup.js')
    .bundle()
    .pipe(source('popup.js'))
    .pipe(gulp.dest('./bookmarkr/js/'));
});

gulp.task('views', function() {
  return gulp.src(['./src/views/*.html'])
    .pipe(gulp.dest('./bookmarkr/'));
});

gulp.task('watch', function() {
   gulp.watch('./src/css/*.scss', ['sass']);
   gulp.watch('./src/js/*.js', ['browserify']);
   gulp.watch('./src/views/*.html', ['views']);
});

gulp.task('browserify', ['browserify-background', 'browserify-popup']);

gulp.task('default', ['clean', 'views', 'sass', 'browserify']);
