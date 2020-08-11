/*eslint-disable */
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const csso = require('gulp-csso');
const twig = require('gulp-twig');
const sourcemaps = require('gulp-sourcemaps');

function bsT(done) {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    port: 3000,
  });
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function stylesT() {
  return gulp.src([
      'src/css/style.css',
    ])
    .pipe(concat('style.css'))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
    .pipe(autoprefixer(['last 4 versions']))
    .pipe(csso({
      comments: false,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

function twigT() {
  return gulp.src('src/index.twig').pipe(twig()).pipe(gulp.dest('dist'));
}

function scriptsT() {
  return gulp.src([
      'src/js/index.js',
    ])
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }));
}

function codeT() {
  return gulp.src('dist/**/*.html').pipe(browserSync.reload({ stream: true }));
}

function assetsT() {
  return gulp.src([
    'src/assets/**/*.*',
  ]).pipe(gulp.dest('dist/assets/'));
}

function watchFiles() {
  gulp.watch('src/**/*.css', stylesT);
  gulp.watch('src/**/*.js', gulp.series(scriptsT, browserSyncReload));
  gulp.watch('src/**/*.twig',
    gulp.series(gulp.parallel(codeT, twigT), browserSyncReload));
}

const build = gulp.parallel(stylesT, scriptsT, assetsT, twigT);
const watch = gulp.parallel(watchFiles, bsT);

exports.build = build;
exports.watch = watch;
exports.default = gulp.series(build, watch);
