(function() {

    'use strict';

    
    // List of all the modules
    // ============================================================
    
    const gulp = require('gulp');
    const inject = require('gulp-inject');
    const angularFileSort = require('gulp-angular-filesort');
    const runSequence = require('run-sequence');
    const gls = require('gulp-live-server');
    const KarmaServer = require('karma').Server;
    const protractor = require("gulp-protractor").protractor;


    // List of all the static paths 
    // ============================================================

    const PATHS = {
        NODE_MODULES_COMPONENTS: [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-aria/angular-aria.min.js',
            './node_modules/angular-animate/angular-animate.min.js',
            './node_modules/angular-material/angular-material.min.js',
            './node_modules/angular-ui-router/release/angular-ui-router.min.js'
        ],
        MAIN_INDEX: './src/index.html',
        SOURCE_FILES: './src/**/*.*',
        SOURCE_JS_FILES: './src/**/*.js',
        APP_STYLES: './src/**/*.css',
        EXTERNAL_STYLES: [
            './node_modules/angular-material/angular-material.min.css'
        ],
        TMP_APP: './tmp',
        ROOT_APP: '/',
        KARMA_CONFIG_FILE: './karma.conf.js',
        PROTRACTOR_CONFIG_FILE: './protractor.conf.js',
        E2E_TESTS: './test/e2e/**/*.spec.js'
    };


    // List of all the available tasks
    // ============================================================

    gulp.task('inject-dependencies', injectDependencies);
    gulp.task('serve', ['inject-dependencies'], serve);
    gulp.task('serve-no-watch', ['inject-dependencies'], serveNoWatch);
    gulp.task('unit-test', unitTest);
    gulp.task('unit-test-watch', unitTestWatch);
    gulp.task('protractor-test', ['serve-no-watch'], runProtractorTests);


    // Private functions
    // ============================================================

    function injectDependencies() {
        let target = gulp.src(PATHS.MAIN_INDEX);
        let nodeSources = gulp.src(PATHS.NODE_MODULES_COMPONENTS, { read: false });
        let angularSources = gulp.src(PATHS.SOURCE_JS_FILES).pipe(angularFileSort());
        // get all the styles concatenating them and leaving our style file at the end, so we can override all the external rules from our styles
        let allStyles = [].concat(PATHS.EXTERNAL_STYLES, PATHS.APP_STYLES);
        let cssSources = gulp.src(allStyles, { read: false });

        return target
            .pipe(inject(cssSources))
            .pipe(inject(nodeSources, { name: 'node' }))
            .pipe(inject(angularSources, { name: 'angular' }))
            .pipe(gulp.dest(PATHS.TMP_APP));
    }

    function serve() {
        let server = gls.static([PATHS.ROOT_APP, PATHS.TMP_APP]);
        server.start();
        gulp.watch(PATHS.SOURCE_FILES, function(file) {
            server.notify.apply(server, [file]);
        });
    }

    let serverNoWatch;

    function serveNoWatch() {
        serverNoWatch = gls.static([PATHS.ROOT_APP, PATHS.TMP_APP]);
        serverNoWatch.start();
    }

    function unitTest(done) {
        startKarmaServer(done);
    }

    function unitTestWatch(done) {
        startKarmaServer(done, true);
    }

    function startKarmaServer(done, watch = false) {
        new KarmaServer({
            configFile: PATHS.KARMA_CONFIG_FILE,
            singleRun: !watch,
            autoWatch: watch
        }, onKarmaFinished).start();

        function onKarmaFinished(exitCode) {
            done();
            process.exit(exitCode);
        }
    }

    function runProtractorTests() {
        return gulp.src(PATHS.E2E_TESTS)
            .pipe(protractor({
                configFile: PATHS.PROTRACTOR_CONFIG_FILE
            }))
            .on('close', function() {
                serverNoWatch.stop();
            })
            .on('error', function(e) { throw e; });
    }

})();




// 'use strict';

// const gulp = require('gulp');
// const clean = require('gulp-clean');
// const minify = require('gulp-minify');
// const gls = require('gulp-live-server');
// const protractor = require("gulp-protractor").protractor;

// const PATH = {
//     components: './src/app/components',
//     dist: './dist',
//     app: './src/app/',
//     src: './src/qprotractor.js',
//     test: './test/*.spec.js',
//     protractorConfig: './protractor.config.js'
// };
// const APP_FILES_TO_WATCH = 'src/app/**/*.*';
// const APP_COMPONENTS = [
//     './node_modules/angular/angular.min.js',
//     './node_modules/angular-ui-router/release/angular-ui-router.min.js'
// ];


// gulp.task('clean-dist', function() {
//     return gulp.src(PATH.dist, { read: false }).pipe(clean());
// });

// gulp.task('clean-app-components', function() {
//     return gulp.src(PATH.components, { read: false }).pipe(clean());
// });

// gulp.task('publish', ['clean-dist', 'copy-app-components'], function() {
//     gulp
//         .src(PATH.src)
//         .pipe(minify({
//             ext: {
//                 min: '.min.js'
//             }
//         }))
//         .pipe(gulp.dest(PATH.dist));
// });

// gulp.task('serve', ['publish'], function() {
//     let server = gls.static(PATH.app, 9000);
//     server.start();
//     gulp.watch(APP_FILES_TO_WATCH, function(file) {
//         server.notify.apply(server, [file]);
//     });
// });

// let serverNoWatch;
// gulp.task('serve-no-watch', ['publish'], function() {
//     serverNoWatch = gls.static(PATH.app, 9000);
//     serverNoWatch.start();
// });

// gulp.task('copy-app-components', ['clean-app-components'], function() {
//     gulp
//         .src(APP_COMPONENTS)
//         .pipe(gulp.dest(PATH.components));
// });

// gulp.task('protractor-test', ['serve-no-watch'], function() {
//     return gulp.src(PATH.test)
//         .pipe(protractor({
//             configFile: PATH.protractorConfig
//         }))
//         .on('close', function() {
//             console.log('exit'); 
//             serverNoWatch.stop();
//         })
//         .on('error', function(e) { throw e; });
// });