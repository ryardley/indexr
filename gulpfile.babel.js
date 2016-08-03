import gulp from 'gulp';
import babel from 'gulp-babel';
import watch from 'gulp-watch';

gulp.task('default', () => watch(['lib/index.js', 'bin/bin.js'], { ignoreInitial: false })
  .pipe(babel())
  .pipe(gulp.dest('dist')));

