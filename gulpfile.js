const gulp = require('gulp');
const sass = require('gulp-sass');
const browsersync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const reload = browsersync.reload;
const { watch, series, parallel } = require('gulp');
const browserify = require('gulp-browserify');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');


const SOURCEPATHS = {
    
    sassSource : 'src/scss/*.scss',
    htmlSource : 'src/*.html',
    jsSource : 'src/js/*.js',
    imgSource : 'src/img/**'
}

const APPPATH = {
    root : 'app/',
    css : 'app/css',
    js : 'app/js',
    img : 'app/img'
    
}
// Works
// gulp.task('sass', function() {
//     return gulp.src(SOURCEPATHS.sassSource)
//         .pipe(autoprefixer())
//         .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
//         .pipe(gulp.dest(APPPATH.css))
// });

function cleanFiles(){
    return gulp.src(APPPATH.root + '/*.html', {read:false})
    .pipe(clean({force:true}));
}

function cleanScripts(done){
    return gulp.src(APPPATH.root + '/*.js', {read:false})
    .pipe(clean({force:true}))
    done();
}

function scripts() {
    return gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('js/main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(APPPATH.root))
}

function compileSass() {
    const bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    const sassFiles =  gulp.src(SOURCEPATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

        return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(APPPATH.css))
}

function images () {
    return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img))
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
        parallel(copyFiles, cleanFiles)
    ),
    watch(
        [SOURCEPATHS.jsSource],
        parallel(scripts, cleanScripts),
        done()
    )};


    

exports.compileSass = compileSass;
exports.copyFiles = copyFiles;
exports.watchTask = watchTask;
exports.browserSync = browserSync;
exports.cleanFiles = cleanFiles;
exports.scripts = scripts;
exports.cleanScripts = cleanScripts;
exports.images = images;
exports.default = series(watchTask, browserSync, compileSass, images, parallel(scripts, cleanScripts), parallel(copyFiles, cleanFiles));
