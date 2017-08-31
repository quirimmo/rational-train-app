(function() {

    'use strict';


    // List of all the modules
    // ============================================================

    const gulp = require('gulp');
    const inject = require('gulp-inject');
    const gls = require('gulp-live-server');
    const KarmaServer = require('karma').Server;
    const protractor = require("gulp-protractor").protractor;
    const concat = require('gulp-concat');
    const minify = require('gulp-minify');
    const spawn = require('child_process').spawn;


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
        DIST_APP: './tmp',
        ROOT_APP: '/',
        KARMA_CONFIG_FILE: './karma.conf.js',
        PROTRACTOR_CONFIG_FILE: './protractor.conf.js',
        E2E_TESTS: './test/e2e/**/*.spec.js',
        ANGULAR_SOURCE_ORDER: [
            'src/app.js',
            'src/*/*.js',
            'src/config.js'
        ]
    };


    // List of all the available tasks
    // ============================================================

    gulp.task('inject-dependencies', injectDependencies);
    gulp.task('serve', ['inject-dependencies', 'start-mirror-proxy'], serve);
    gulp.task('serve-no-watch', ['inject-dependencies', 'start-mirror-proxy'], serveNoWatch);
    gulp.task('unit-test', unitTest);
    gulp.task('unit-test-watch', unitTestWatch);
    gulp.task('protractor-test', ['serve-no-watch'], runProtractorTests);
    gulp.task('publish', publishApp);
    gulp.task('start-mirror-proxy', startMirrorProxy);


    // Private functions
    // ============================================================

    function injectDependencies() {
        let target = gulp.src(PATHS.MAIN_INDEX);
        let nodeSources = gulp.src(PATHS.NODE_MODULES_COMPONENTS, { read: false });
        let angularSources = gulp.src(PATHS.ANGULAR_SOURCE_ORDER);
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

    function publishApp() {
        return gulp.src(PATHS.NODE_MODULES_COMPONENTS.concat(PATHS.SOURCE_JS_FILES))
            .pipe(concat('all.js'))
            .pipe(minify({
                ext: {
                    min: '.min.js'
                }
            }))
            .pipe(gulp.dest(PATHS.DIST_APP));
    }

    function startMirrorProxy() {
        spawn('node', ['proxy.js'], { shell: true , detached: true });
    }

})();