import babel from 'gulp-babel';
import gulp from 'gulp';
import indexr from './lib';
import path from 'path';
import watch from 'gulp-watch';
import chalk from 'chalk';

const watchGlobs = ['lib/**/*', 'bin/bin.js'];
const watchConfig = { ignored: '**/cliflags.js' };

const runIndexr = () => indexr(path.resolve(__dirname, './lib'), {
  modules: '**/modules/',
  submodules: '*/cliflags.js',
  outputFilename: 'cliflags.js',
  directImport: true,
});

const babelTransform = () => gulp.src(watchGlobs)
  .pipe(babel())
  .pipe(gulp.dest('dist'));

gulp.task('indexr', () => runIndexr());

gulp.task('watch', ['indexr'], () => watch(watchGlobs, watchConfig, () => {
  runIndexr()
    .then(babelTransform)
    .catch((err) => {
      console.log(chalk.red(err));
    });
}));

gulp.task('compile', () => gulp.src(['lib/**/*', 'bin/bin.js'])
  .pipe(babel())
  .pipe(gulp.dest('dist')));

gulp.task('default', ['watch']);
