const gulp = require('gulp');
const adjuster = require('..');
const rename = require('gulp-rename');

gulp.task('default', function () {
  return gulp.src('test2.css')
    .pipe(adjuster({
      prepend: '/addd/good',
      prependRelative: 'test',
      append: '?@MD5&fallback',
      root: 'test'
    }))
    .pipe(rename(function (path) {
      path.basename += '-vert';
    }))
    .pipe(gulp.dest('./'));
});
