import babel from 'gulp-babel';
import gulp from 'gulp';
import indexr from './lib';
import path from 'path';
import watch from 'gulp-watch';
import chalk from 'chalk';

const watchGlobs = ['lib/**/*', 'bin/bin.js'];
const watchIgnore = '**/cliflags.js';

function runIndexr() {
  return indexr(path.resolve(__dirname, './lib'), {
    modules: '**/modules/',
    submodules: '*/cliflags.js',
    outputFilename: 'cliflags.js',
    directImport: true,
  });
}

function babelTransform() {
  return gulp.src(watchGlobs)
    .pipe(babel())
    .pipe(gulp.dest('dist'));
}

function watcher() {
  const watchConfig = { ignored: watchIgnore };
  return watch(watchGlobs, watchConfig, () => {
    runIndexr()
      .then(babelTransform)
      .catch((err) => {
        console.log(chalk.red(err));
      });
  });
}

gulp.task('indexr', runIndexr);
gulp.task('watch', ['compile'], watcher);
gulp.task('compile', ['indexr'], babelTransform);
gulp.task('default', ['watch']);
