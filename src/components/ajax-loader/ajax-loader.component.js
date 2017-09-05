(function() {
    'use strict';

    var app = angular.module('myApp');
    
    app.component('ajaxLoader', {
        templateUrl: 'src/components/ajax-loader/ajax-loader.html',
        controller: 'AjaxLoaderController',
        controllerAs: 'vm',
        bindings: {
        }
    });

})();