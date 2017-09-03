module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        files: [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/angular/angular.min.js',
            './node_modules/angular-ui-router/release/angular-ui-router.min.js',
            './node_modules/angular-aria/angular-aria.min.js',
            './node_modules/angular-animate/angular-animate.min.js',
            './node_modules/angular-material/angular-material.min.js',
            './node_modules/ngmap/build/scripts/ng-map.min.js',
            './node_modules/angular-mocks/angular-mocks.js',

            './vendors/xml2json.js',
            'http://maps.google.com/maps/api/js',
            
            'src/app.js',
            // 'src/services/**/*.js',
            // 'src/components/**/*.js',
            // 'src/directives/**/*.js',
            // 'src/*/*.js',
            'src/config.js',
            // 'src/**/*.js',

            'test/unit/**/*.spec.js'
        ]
    });
};