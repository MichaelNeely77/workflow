const gulp = require('gulp');
const sass = require('gulp-sass');
const browsersync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const reload = browsersync.reload;
const { watch, series } = require('gulp');
const clean = require('gulp-clean');


const SOURCEPATHS = {
    
    sassSource : 'src/scss/*.scss',
    htmlSource : 'src/*.html'
}

const APPPATH = {
    root : 'app/',
    css : 'app/css',
    js : 'app/js'
}
// Works
// gulp.task('sass', function() {
//     return gulp.src(SOURCEPATHS.sassSource)
//         .pipe(autoprefixer())
//         .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
//         .pipe(gulp.dest(APPPATH.css))
// });

function cleanFiles(){
    return gulp.src(APPPATH.root + '/*.html', {read: false, force:true})
        .pipe(clean());
}

function compileSass() {
    return gulp.src(SOURCEPATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(APPPATH.css))
}

function copyFiles() {
    return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
}


// Works
// gulp.task('serve', function() {
//     browsersync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
//         server: {
//             baseDir : APPPATH.root
//         }
//     })
// });

// Works
function browserSync(done) {
    browsersync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
        server: {
            baseDir : APPPATH.root
        }
    });
    done();
};


/* DEPRECATED - REFERENCE ONLY */
// gulp.task('watch', ['serve', 'sass'], function() {
//     gulp.watch([SOURCEPATHS.sassSource], ['sass'])
// });


// gulp.task('default', gulp.series('sass', 'serve')); //Works

function watchTask(done) {
    watch(
        [SOURCEPATHS.sassSource], 
        compileSass
    ),
    watch(
        [SOURCEPATHS.htmlSource],
        copyFiles,
        done()
    )};
    

exports.compileSass = compileSass;
exports.copyFiles = copyFiles;
exports.watchTask = watchTask;
exports.browserSync = browserSync;
exports.cleanFiles = cleanFiles;
exports.default = series(watchTask, browserSync, compileSass, cleanFiles, copyFiles);
