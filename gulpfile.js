import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import notify from 'gulp-notify';
import csso from 'gulp-csso';
import twig from 'gulp-twig';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

function bs(done) {
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

function styles() {
  return gulp.src([
      'src/sass/main.scss',
    ])
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

function twigGulp() {
  return gulp.src('src/index.twig').pipe(twig()).pipe(gulp.dest('dist'));
}

function scripts() {
  return gulp.src([
      'src/js/index.js',
    ])
    .pipe(concat('index.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }));
}

function code() {
  return gulp.src('dist/*.html').pipe(browserSync.reload({ stream: true }));
}

function assets() {
  return gulp.src([
    'src/assets/**/*.*',
  ]).pipe(gulp.dest('dist/assets/'));
}

function watchFiles() {
  gulp.watch('src/**/*.scss', styles);
  gulp.watch('src/**/*.js', gulp.series(scripts, browserSyncReload));
  gulp.watch('src/*.twig',
    gulp.series(gulp.parallel(code, twigGulp), browserSyncReload));
}

export const build = gulp.parallel(styles, scripts, assets, twigGulp);
export const watch = gulp.parallel(watchFiles, bs);

const def = gulp.series(build, watch);

export { def as default };
