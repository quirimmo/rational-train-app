module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-ng-html2js-preprocessor'
        ],
        ngHtml2JsPreprocessor: {
            moduleName: 'templates',
            stripPrefix: 'src/'
        },
        preprocessors: {
            'src/**/*.html': ['ng-html2js']
        },
        files: [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-mocks/angular-mocks.min.js',
            './node_modules/angular-messages/angular-messages.min.js',
            './node_modules/angular-ui-router/release/angular-ui-router.min.js',
            './node_modules/angular-material/angular-material.min.js',
            './node_modules/angular-aria/angular-aria.min.js',
            './node_modules/angular-animate/angular-animate.min.js',
            './node_modules/ngmap/build/scripts/ng-map.min.js',

            './vendors/xml2json.js',
            'http://maps.google.com/maps/api/js',
            
            './tmp/partials.min.js',

            './src/app.js',
            './src/services/**/*.js',
            './src/components/**/*.js',
            './src/directives/**/*.js',
            './src/*/*.js',
            './src/config.js',

            './test/unit/**/*.spec.js',

            './src/**/*.html'
        ]
    });
};