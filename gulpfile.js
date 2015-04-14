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
 
gulp.task('templates', function() {
  gulp.src('src/templates/*.hbs')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Bookmarkr.templates',
      noRedeclare: true, // Avoid duplicate declarations 
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./bookmarkr/js/'));
});



gulp.task('clean', function() {
  return gulp.src(['bookmarkr/*', '!bookmarkr/manifest.json'], {read: false})
    .pipe(clean());
});

gulp.task('sass', function() {
  return gulp.src('./src/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./bookmarkr/css/'))
});

gulp.task('vendor-css', function() {
  return gulp.src(['./vendor/css/vendor.css'])
    .pipe(gulp.dest('./bookmarkr/css/'));
});

gulp.task('vendor-js', function() {
  return gulp.src(['./vendor/js/*.js', './src/js/hbs_helpers.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./bookmarkr/js/'));
})


gulp.task('browserify-background', function() {
  var args = {
    entries: ['./src/js/background.js'],
    debug: true
  };
  return browserify(args)
    .transform(babelify)
    .bundle()
    .pipe(source('background.js'))
    .pipe(gulp.dest('./bookmarkr/js/'));
});

gulp.task('browserify-popup', function() {
  var args = {
    entries: ['./src/js/popup.js'],
    debug: true
  };
  return browserify(args)
    .transform(babelify)
    .bundle()
    .pipe(source('popup.js'))
    .pipe(gulp.dest('./bookmarkr/js/'));
});

gulp.task('views', function() {
  return gulp.src(['./src/views/*.html'])
    .pipe(gulp.dest('./bookmarkr/'));
});

gulp.task('watch', function() {
   gulp.watch('./src/css/*.scss', ['styles']);
   gulp.watch('./src/js/*.js', ['scripts']);
   gulp.watch('./src/views/*.html', ['views']);
   gulp.watch('./src/templates/*.hbs', ['templates']);
});

gulp.task('scripts', ['browserify-background', 'browserify-popup', 'vendor-js']);
gulp.task('styles', ['vendor-css','sass']);

// gulp.task('default', ['clean', 'templates', 'views', 'styles', 'scripts']);
gulp.task('default', ['templates', 'views', 'styles', 'scripts']);
