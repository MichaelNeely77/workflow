const gulp = require('gulp');
const sass = require('gulp-sass');
const  browsersync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const reload = browsersync.reload;
const { series } = require('gulp');
const { watch } = require('gulp');

const SOURCEPATHS = {
    
    sassSource : 'src/scss/*.scss'
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


function compileSass() {
    return gulp.src(SOURCEPATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(APPPATH.css))
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
        series(browserSync, compileSass),
        done()
    )};
    



exports.compileSass = compileSass;
exports.watchTask = watchTask;
exports.browserSync = browserSync;
exports.default = series(watchTask, browserSync, compileSass);
