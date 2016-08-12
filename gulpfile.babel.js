import gulp from 'gulp';
import babel from 'gulp-babel';
import watch from 'gulp-watch';

gulp.task('watch', () => watch(['lib/**/*', 'bin/bin.js'], { ignoreInitial: false })
  .pipe(babel())
  .pipe(gulp.dest('dist')));

gulp.task('compile', () => gulp.src(['lib/**/*', 'bin/bin.js'])
  .pipe(babel())
  .pipe(gulp.dest('dist')));

gulp.task('default', ['watch']);
