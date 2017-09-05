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
    const htmlMinify = require('gulp-htmlmin');
    const ngHtml2Js = require("gulp-ng-html2js");
    const clean = require('gulp-clean');
    const runSequence = require('run-sequence');
    const cleanCSS = require('gulp-clean-css');


    // List of all the static paths 
    // ============================================================

    const PATHS = {
        NODE_MODULES_COMPONENTS: [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-messages/angular-messages.min.js',
            './node_modules/angular-aria/angular-aria.min.js',
            './node_modules/angular-animate/angular-animate.min.js',
            './node_modules/angular-material/angular-material.min.js',
            './node_modules/angular-ui-router/release/angular-ui-router.min.js',
            './node_modules/ngmap/build/scripts/ng-map.min.js'
        ],
        MAIN_INDEX: './src/index.html',
        SOURCE_FILES: './src/**/*.*',
        SOURCE_JS_FILES: './src/**/*.js',
        APP_STYLES: './src/**/*.css',
        EXTERNAL_STYLES: [
            './node_modules/angular-material/angular-material.min.css'
        ],
        TMP_APP: './tmp',
        DIST_APP: './dist',
        SRC_PREFIX: 'src/',
        ROOT_APP: '/',
        KARMA_CONFIG_FILE: `${__dirname}/karma.conf.js`,
        PROTRACTOR_CONFIG_FILE: './protractor.conf.js',
        E2E_TESTS: './test/e2e/**/*.spec.js',
        ANGULAR_SOURCE_ORDER: [
            'src/app.js',
            'src/services/**/*.js',
            'src/components/**/*.js',
            'src/directives/**/*.js',
            'src/*/*.js',
            'src/config.js'
        ],
        PARTIALS: 'partials.min.js',
        PARTIALS_HTML_SOURCES: [
            'src/**/*.html',
            '!src/index.html'
        ],
        VENDORS_FILES: 'vendors/*.js',
        VENDORS_PREFIX: 'vendors/',
        ALL_IMAGES: [
            './src/assets/images/*.*'
        ],
        IMAGES_PATH: 'src/assets/images'
    };


    // List of all the available tasks
    // ============================================================

    gulp.task('inject-dependencies', injectDependencies);
    gulp.task('serve', ['clean-tmp'], serve);
    gulp.task('serve-no-watch', ['clean-tmp'], serveNoWatch);
    gulp.task('serve-dist', ['start-mirror-proxy'], serveDist);
    gulp.task('unit-test', unitTest);
    gulp.task('unit-test-travis', ['compile-templates'], unitTest);
    gulp.task('unit-test-watch', unitTestWatch);
    gulp.task('protractor-test', ['serve-no-watch'], runProtractorTests);
    gulp.task('publish', ['clean-dist'], publish);
    gulp.task('build-js-source-files', buildJSSourceFiles);
    gulp.task('start-mirror-proxy', startMirrorProxy);
    gulp.task('compile-templates', compileTemplates.bind(null, PATHS.TMP_APP));
    gulp.task('compile-templates-dist', compileTemplates.bind(null, PATHS.DIST_APP));
    gulp.task('clean-tmp', cleanFolder.bind(null, PATHS.TMP_APP));
    gulp.task('clean-dist', cleanFolder.bind(null, PATHS.DIST_APP));
    gulp.task('copy-vendors', copyVendors);
    gulp.task('publish-node-modules', publishNodeModules);
    gulp.task('publish-styles', publishStyles);
    gulp.task('publish-images', publishImages);
    // set the default task as serve so with the gulp command it will execute directly the serve
    gulp.task('default', ['serve']);

    // Private functions
    // ============================================================

    function injectDependencies() {
        let target = gulp.src(PATHS.MAIN_INDEX);
        let nodeSources = gulp.src(PATHS.NODE_MODULES_COMPONENTS, { read: false });
        let angularSources = gulp.src(PATHS.ANGULAR_SOURCE_ORDER);
        // get all the styles concatenating them and leaving our style file at the end, so we can override all the external rules from our styles
        let allStyles = [].concat(PATHS.EXTERNAL_STYLES, PATHS.APP_STYLES);
        let cssSources = gulp.src(allStyles, { read: false });
        let templatesSources = gulp.src(`${PATHS.TMP_APP}/${PATHS.PARTIALS}`, { read: false });

        return target
            .pipe(inject(templatesSources, { name: 'templates', ignorePath: 'tmp/' }))
            .pipe(inject(cssSources))
            .pipe(inject(nodeSources, { name: 'node' }))
            .pipe(inject(angularSources, { name: 'angular' }))
            .pipe(gulp.dest(PATHS.TMP_APP));
    }

    function serve(done) {
        runSequence(
            'compile-templates', [
                'inject-dependencies',
                'start-mirror-proxy',
            ], afterSequence);

        function afterSequence() {
            let server = gls.static([PATHS.ROOT_APP, PATHS.TMP_APP]);
            server.start();
            gulp.watch(PATHS.SOURCE_FILES, function(file) {
                server.notify.apply(server, [file]);
            });
            done();
        }
    }

    let serverNoWatch;

    function serveNoWatch(done) {
        runSequence(
            'compile-templates', [
                'inject-dependencies',
                'start-mirror-proxy',
            ], afterSequence);

        function afterSequence() {
            serverNoWatch = gls.static([PATHS.ROOT_APP, PATHS.TMP_APP]);
            serverNoWatch.start();
            done();
        }
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

    function startMirrorProxy() {
        spawn('node', ['proxy.js'], { shell: true, detached: true });
    }

    function compileTemplates(destinationPath) {
        return gulp.src(PATHS.PARTIALS_HTML_SOURCES)
            .pipe(htmlMinify({ removeComments: true, collapseWhitespace: true }))
            .pipe(ngHtml2Js({ moduleName: 'partials', prefix: PATHS.SRC_PREFIX }))
            .pipe(concat('partials.js'))
            .pipe(minify({ ext: { min: '.min.js' }, noSource: true }))
            .pipe(gulp.dest(destinationPath));
    }

    function cleanFolder(folderToClean) {
        return gulp.src(folderToClean, { read: false })
            .pipe(clean());
    }

    function serveDist() {
        let server = gls.static(PATHS.DIST_APP, 8000);
        server.start();
    }


    function publish(done) {
        runSequence(
            'compile-templates-dist', [
                'build-js-source-files',
                'copy-vendors',
                'publish-node-modules',
                'publish-styles',
                'publish-images'
            ], afterSequence);

        function afterSequence() {
            // after getting everything ready, inject every thing needed inside the mail
            let target = gulp.src('src/index.html');

            return target
                .pipe(inject(gulp.src('dist/node-components.js', { read: false }), { name: 'node', ignorePath: 'dist/', addRootSlash: false }))
                .pipe(inject(gulp.src('dist/global-styles.css', { read: false }), { ignorePath: 'dist/', addRootSlash: false }))
                .pipe(inject(gulp.src('dist/partials.min.js', { read: false }), { name: 'templates', ignorePath: 'dist/', addRootSlash: false }))
                .pipe(inject(gulp.src('dist/all.min.js', { read: false }), { name: 'all', ignorePath: 'dist/', addRootSlash: false }))
                .pipe(gulp.dest(PATHS.DIST_APP));

        }
    }

    function buildJSSourceFiles() {
        return gulp.src(PATHS.SOURCE_JS_FILES)
            .pipe(concat('all.js'))
            .pipe(minify({ ext: { min: '.min.js' }, noSource: true }))
            .pipe(gulp.dest(PATHS.DIST_APP));
    }

    function copyVendors() {
        return gulp.src(PATHS.VENDORS_FILES)
            .pipe(gulp.dest(`${PATHS.DIST_APP}/${PATHS.VENDORS_PREFIX}`));
    }

    function publishNodeModules() {
        return gulp.src(PATHS.NODE_MODULES_COMPONENTS)
            .pipe(concat('node-components.js'))
            .pipe(gulp.dest(PATHS.DIST_APP));
    }

    function publishStyles() {
        let stylesSource = gulp.src(PATHS.EXTERNAL_STYLES.concat(PATHS.APP_STYLES));

        return stylesSource
            .pipe(concat("global-styles.css"))
            .pipe(cleanCSS())
            .pipe(gulp.dest(PATHS.DIST_APP));
    }

    function publishImages() {
        let imagesSource = gulp.src(PATHS.ALL_IMAGES);

        return imagesSource
            .pipe(gulp.dest(`${PATHS.DIST_APP}/${PATHS.IMAGES_PATH}`));
    }

})();