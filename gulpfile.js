'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
// Minify CSS
var cleanCSS = require('gulp-clean-css'); 
var jade = require('gulp-jade');

gulp.task('jade', function(){
	return gulp.src('./src/jade/**/*.jade')
				.pipe(jade({ pretty:true }))
				.pipe(gulp.dest('./'))
				.pipe(connect.reload());
});

gulp.task('js', function(){
	gulp.src('./src/js/**/*.js')
		.pipe(gulp.dest('./assets/js/'))
		.pipe(connect.reload());
});

gulp.task('sass', function(){
	return gulp.src('./src/sass/main.sass')
		.pipe(sass())
		.pipe(autoPrefixer({
			browsers: ['last 2 versions', '> 1%', 'IE 8'],
			cascade: false
		}))
		// .pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename('style.css'))
		.pipe(gulp.dest('./assets/css'))
		.pipe(connect.reload());
});

gulp.task('connect', function() {
	connect.server({
		root: './',
		port: 8888,
		livereload: true
	});
});

gulp.task('watch', function(){
	gulp.watch('./src/jade/**/*.jade', ['jade']);
	gulp.watch('./src/jade/**/*.html', ['jade']);
	gulp.watch('./src/js/**/*.js', ['js']);
	gulp.watch('./src/sass/**/*.sass', ['sass']);
	gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['connect', 'jade', 'sass', 'js', 'watch']);