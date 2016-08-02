import gulp from 'gulp';
import babel from 'gulp-babel';

gulp.task('default', () => {
  return gulp.src('lib/index.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});
