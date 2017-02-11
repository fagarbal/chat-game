const gulp       = require('gulp');
const concat     = require('gulp-concat');
const git        = require('gulp-git');
const livereload = require('gulp-livereload');
const rename     = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const tslint     = require('gulp-tslint');
const uglify     = require('gulp-uglify');
const util       = require('gulp-util');

const tsProject = typescript.createProject('tsconfig.json');

gulp.task('lint', () => {
  gulp.src('src/**/*.ts')
    .pipe(tslint({ formatter: 'verbose' }))
    .pipe(tslint.report({ emitError: true }));
});

gulp.task('build', ['lint'], () => {
  const tsResult = tsProject.src()
    .pipe(typescript(tsProject));

  return tsResult.js
    .pipe(gulp.dest('.build'));
});

gulp.task('bundle', ['build'], () => {
  return gulp.src([
    'lib/phaser.js',
    'lib/socket.io.js',
    '.build/Player.js',
    '.build/Hero.js',
    '.build/Main.js',
    '.build/Boot.js',
    '.build/Game.js',
    '.build/app.js'
  ])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(process.env.LIVERELOAD != '0' ? livereload() : util.noop());
});

gulp.task('compress', ['bundle'], () => {
  return gulp.src('public/js/bundle.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', ['bundle'], () => {
  if (process.env.LIVERELOAD != '0') livereload.listen();
  gulp.watch(['src/**/*.ts', 'tsconfig.json'], ['bundle']);
});

gulp.task('deploy', ['compress'], () => {
  git.push('origin', 'heroku', (err) => { if (err) throw err; });
});

gulp.task('default', ['bundle']);
