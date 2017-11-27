const babel = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const console = require('console');
const es2015 = require('babel-preset-es2015');
const gutil = require('gulp-util');
const envify = require('loose-envify/custom');
const path = require('path');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');
const yargs = require('yargs').argv;

class JSBuild {
    constructor(src, dest, gulp) {
        this._src = src;
        this._destinations =
            Array.isArray(dest)
                ? dest
                : [dest];

        this._verbose = yargs.verbose;
        this._gulp = gulp;

        this._bundler = browserify(this._src,
        {
            debug: true
        })
        .transform(babel.configure({
            presets: [es2015]
        }))
        .transform(envify({
            NODE_ENV:
                this._verbose
                    ? 'development'
                    : 'production'
        }), {global: true});

        this.build = this.build.bind(this);
        this.watch = this.watch.bind(this);
    }

    build() {
        const stream = this._bundler
            .bundle()
            .on('error',
                function (err) {
                    if (err && err.codeFrame) {
                        gutil.log(
                            `${gutil.colors.red(`Browserify error:`)}
${gutil.colors.cyan(err.filename)} [${err.loc.line},${err.loc.column}]
${err.codeFrame}
${err.message}`
                        );
                    } else {
                        gutil.log(err);
                    }
                    this.emit('end');
                })
            .pipe(source(path.basename(this._destinations[0])))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(this._verbose ? gutil.noop() : uglify())
            .pipe(sourcemaps.write('./'));

        return this._destinations
            .reduce(
                (str, dest) =>
                    str
                        .pipe(rename(path.basename(dest)))
                        .pipe(this._gulp.dest(path.dirname(dest))),
                stream);
    }

    watch() {
        this._bundler = watchify(this._bundler);
        this._bundler.on('update', () => {
            const src = gutil.colors.cyan(this._src);
            gutil.log(`Rebuilding '${src}'...`);
            this.build();
        });

        this.build();
    }
}

module.exports = JSBuild;
