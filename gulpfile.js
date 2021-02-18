const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('default', ['compile']);
gulp.task('compile', ['sass']);

gulp.task('watch', () => {
	gulp.watch('public/css/*', ['sass']);
});

gulp.task('sass', () => {
	return gulp
		.src('public/css/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('public/css'));
});
