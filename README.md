# Warning: this project as been deprecated

This tool has been deprecated internally but remains for posterity.  Project dependencies such as [watchify][watchify] are no longer actively maintained and we have received security alerts stemming from dependencies of dependencies that can not be addressed.  We actively encourage you to use another tool and will not provide support or accept liability if you use this.

# GeekHive Gulp JavaScript Build

A simplified, standardized, gulp-compatible build script to bundle a source file using Browserify, Babel, and Uglify.

## Installation

Using NPM

```
npm install geekhive/gulp-javascript-build --save-dev
```

Using yarn

```
yarn add geekhive/gulp-javascript-build --dev
```

## Usage

Require `@geekhive/gulp-javascript-build` to access the build class.

```
const JSBuild = require('@geekhive/gulp-javascript-build');
```

### `new JSBuild(src, dest, gulp)`

Create a new `JSBuild` object by passing it source and destination paths for the file to bundle as well as a reference to `gulp`.

```
const js = new JSBuild(
  `${__dirname}/assets/js/site.js`,
  `${__dirname}/assets/js/site.min.js`,
  gulp);
```

The `dest` argument may also be an array of destinations.

```
const js = new JSBuild(
    `${__dirname}/assets/js/site.js`,
    [
        `${__dirname}/assets/js/site.min.js`,
        `${__dirname}/assets/example/alternative.js`
    ],
    gulp);
```

### `JSBuild#build()`

The `JSBuild#build` method can be passed directly to gulp as a build task:

```
gulp.task('build:js', js.build);
```

Calling `js.build` will bundle the source script using Browserify, Babel and Uglify and output the result to the destination location.

### `JSBuild#watch()`

The `JSBuild#watch` method can be passed directly to gulp as a watch task:

```
gulp.task('watch:js', js.watch);
```

Calling `js.watch` will start watching the source script and dependencies for changes and will rebuild the bundle when changes are made.

[watchify]: https://www.npmjs.com/package/watchify
