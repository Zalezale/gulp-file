var gulp = require("gulp"); //创建 gulp模块
var uglify = require("gulp-uglify"); //创建js混淆压缩 模块
var minify_css = require("gulp-minify-css"); //创建 css混淆压缩模块
var gulp_concat = require('gulp-concat'); //创建 文件合并模块
var connect = require('gulp-connect'); //保存自动刷新插件
var htmlmin = require('gulp-htmlmin') //压缩html,压缩页面javascript.css去除页面空格,注释等
var revappend = require('gulp-rev-append') //给页面引用添加版本号,清除页面引用缓存
var domSrc = require('gulp-dom-src') //获取指定html界面script或者link标签集合
var cheerio = require('gulp-cheerio') //用于操作html界面
gulp.task('minihtml', ['minicss', 'minijs', ], function() {
	var options = {
		removeComments: true, //清除HTML注释
		collapseWhitespace: true, //压缩HTML
		collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		minifyJS: true, //压缩页面JS
		minifyCSS: true //压缩页面CSS
	};

	gulp.src('*.html')
		.pipe(cheerio(function($) {
			$('script').remove();
			$('link').remove();
			$('body').append('<script src="js/min.js"></script>');
			$('head').append('<link rel="stylesheet" href="css/min.css">');
		}))
		.pipe(revappend())
		.pipe(htmlmin(options))
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload())
})
gulp.task('minicss', function() {
	gulp.src('./css/*.css')
		.pipe(gulp_concat('min.css'))
		.pipe(minify_css())
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload())
})
gulp.task('minijs', function() {
	gulp.src('./js/*.js')
		.pipe(gulp_concat('min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload())
})
gulp.task('connect', function() {
	connect.server({
		livereload: true,
		port: 8888
	})
})
gulp.task('watch', function() {
	gulp.watch('*.html', ['minihtml'])
	gulp.watch('./js/*.js', ['minijs'])
	gulp.watch('./css/*.css', ['minicss'])
})
gulp.task('default', ['minihtml', 'watch', 'connect'], function() {
	console.log('finish')
})