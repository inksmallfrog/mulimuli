/*
* @Author: inksmallfrog
* @Date:   2017-04-14 12:57:46
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-14 13:47:13
*/

'use strict';
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jslint = require('gulp-jslint'),
    gutil = require('gulp-util');

 gulp.task('minifycss', function() {
        return gulp.src('forend_dev/css/*.css')    //需要操作的文件
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(minifycss())   //执行压缩
            .pipe(gulp.dest('public/stylesheets'));   //输出文件夹
    });
    //压缩，合并 js
    gulp.task('minifyjs', function() {
        return gulp.src(['forend_dev/js/*.js', '!forend_dev/js/jquery*.js'])      //需要操作的文件
            .pipe(concat('main.js'))    //合并所有js到main.js
            .pipe(gulp.dest('public/javascripts'))       //输出到文件夹
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(uglify())    //压缩
            .on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
                this.emit('end');
            })
            .pipe(gulp.dest('public/javascripts'));  //输出
    });
　　//默认命令，在cmd中输入gulp后，执行的就是这个任务(压缩js需要在检查js之后操作)
    gulp.task('default',function() {
        gulp.start('minifycss','minifyjs');
　　});