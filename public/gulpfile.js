var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename')

gulp.task('scripts', function() {
	gulp.src(['js/lib/director.js', 'js/lib/underscore-min.js', 'js/lib/zepto.min.js'])
		.pipe(concat('lib.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/js'))
});

gulp.task('compress', function() {
	gulp.src('js/book/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
})
gulp.task('default', ['scripts', 'compress']);
