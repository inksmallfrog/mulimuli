/*
* @Author: inksmallfrog
* @Date:   2017-04-14 12:57:46
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-18 23:50:35
*/

'use strict';
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

gulp.task('minifycss', function() {
    return gulp.src('dev_public/stylesheets/*.css')    //需要操作的文件
        .pipe($.rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe($.minifyCss())   //执行压缩
        .pipe(gulp.dest('public/stylesheets'));   //输出文件夹
});
gulp.task('minifyjs', function() {
    return gulp.src(['dev_public/javascripts/*.js', '!forend_dev/javascripts/jquery*.js'])      //需要操作的文件
        .pipe($.concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest('public/javascripts'))       //输出到文件夹
        .pipe($.uglify())    //压缩
        .pipe($.rename({suffix: '.min'}))   //rename压缩后的文件名
        .on('error', function(err) {
            $.util.log($.util.colors.red('[Error]'), err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('public/javascripts'));  //输出
});
gulp.task('default',function() {
    gulp.start('minifycss','minifyjs');
});

gulp.task('sass', function(){
    return gulp.src('./dev_public/sass/*.scss')
                .pipe($.sass())
                .pipe(gulp.dest('./dev_public/stylesheets'))
                .pipe($.livereload());
});
gulp.task('developing', function(){
    gulp.start('sass');
    gulp.watch('./dev_public/sass/*.scss', ['sass']);
});