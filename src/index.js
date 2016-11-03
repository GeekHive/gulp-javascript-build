const babel = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const console = require('console');
const gutil = require('gulp-util');
const path = require('path');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');
const yargs = require('yargs').argv;

class JSBuild {
    constructor(src, dest, gulp) {
        this._src = src;
        this._dest = dest;
        this._verbose = yargs.verbose;
        this._gulp = gulp;

        this._bundler = browserify(this._src,
        {
            debug: true
        })
        .transform(babel.configure({
            presets: ['es2015']
        }));

        this.build = this.build.bind(this);
        this.watch = this.watch.bind(this);
    }

    build() {
        return this._bundler
            .bundle()
            .on('error',
                function (err) {
                    console.error(err);
                    this.emit('end');
                })
            .pipe(source(path.basename(this._dest)))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(this._verbose ? gutil.noop() : uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(this._gulp.dest(path.dirname(this._dest)));
    }

    watch() {
        this._bundler = watchify(this._bundler);
        this._bundler.on('update', () => {
            console.log('-> bundling...');
            this.build();
        });

        this.build();
    }
}

module.exports = JSBuild;