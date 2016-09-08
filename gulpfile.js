var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

gulp.task('clean-templates', function() {
  return gulp.src(['./findr/js/templates.js'])
    .pipe(clean());
});

gulp.task('templates', ['clean-templates'], function() {
  gulp.src('src/templates/*.hbs')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Findr.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./findr/js/'));
});

gulp.task('clean-styles', function() {
  gulp.src(['./findr/css/*'], {read: false})
    .pipe(clean());
})

gulp.task('styles', ['clean-styles'], function() {
  return gulp.src(['./vendor/css/*.css', './src/css/*.scss'])
    .pipe(sass())
    .pipe(concat('popup.css'))
    .pipe(gulp.dest('./findr/css/'));
});


gulp.task('clean-vendor-js', function() {
  gulp.src(['./findr/js/vendor.js'], {read: false})
    .pipe(clean());
});

gulp.task('vendor-js', ['clean-vendor-js'], function() {
  return gulp.src(['./vendor/js/*.js', './src/js/hbs_helpers.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./findr/js/'));
})

gulp.task('clean-background-js', function() {
  return gulp.src(['./findr/js/background.js'])
    .pipe(clean());
});

gulp.task('browserify-background', ['clean-background-js'], function() {
  var args = {
    entries: ['./src/js/background.js'],
    debug: true
  };
  return browserify(args)
    .transform(babelify)
    .bundle()
    .pipe(source('background.js'))
    .pipe(gulp.dest('./findr/js/'));
});

gulp.task('clean-popup-js', function() {
  return gulp.src(['./findr/js/popup.js'])
    .pipe(clean());
});

gulp.task('browserify-popup', ['clean-popup-js'], function() {
  var args = {
    entries: ['./src/js/popup.js'],
    debug: true
  };
  return browserify(args)
    .transform(babelify)
    .bundle()
    .pipe(source('popup.js'))
    .pipe(gulp.dest('./findr/js/'));
});

gulp.task('clean-views', function() {
  return gulp.src(['./findr/*.html'])
    .pipe(clean());
})

gulp.task('views', ['clean-views'], function() {
  return gulp.src(['./src/views/*.html'])
    .pipe(gulp.dest('./findr/'));
});

gulp.task('watch', function() {
   gulp.watch('./src/css/*.scss', ['styles']);
   gulp.watch('./src/js/*.js', ['scripts']);
   gulp.watch('./src/views/*.html', ['views']);
   gulp.watch('./src/templates/*.hbs', ['templates']);
});

gulp.task('scripts', ['browserify-background', 'browserify-popup', 'vendor-js']);

gulp.task('default', ['styles', 'views', 'templates', 'scripts']);
