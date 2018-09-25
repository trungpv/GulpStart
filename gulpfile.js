var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');

var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');

var cache = require('gulp-cache');
var del = require('del');

var runSequence = require('run-sequence');

gulp.task('sass',function(){
    return gulp.src('app/scss/**/*.scss') //get source files with gulp.src
    .pipe(sass()) // using sass
    .pipe(gulp.dest('app/css')) //Ouputs files in the destination folder
    .pipe(browserSync.reload({
        stream:true
    }))
});

gulp.task('browserSync',function(){
    browserSync.init({
        server:{
            baseDir:'app'
        }
    });
});

gulp.task('watch',['browserSync','sass'],function(){
    gulp.watch('app/scss/**/*.scss',['sass']);
    //Reload the browsers if HTML or JS files change
    gulp.watch('app/*.html',browserSync.reload);
    gulp.watch('app/*js',browserSync.reload);
});

gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js',uglify())) // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.css',cssnano())) // Minifies only if it's a css file
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced:true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts',()=>{
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist',() =>{
    return del.sync('dist/**/*')
});

gulp.task('cache:clear', (callback) =>{
    cache.clearAll(callback)
}
);

gulp.task('build',function(callback){
    runSequence('clean:dist',['sass','useref','fonts','images'],callback)
})

gulp.task('default',function(callback){
    runSequence(['sass','browserSync','watch'],callback)
})