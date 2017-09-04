(function() {
    'use strict';

    angular.module('myApp').controller('AjaxLoaderController', AjaxLoaderController);

    AjaxLoaderController.$inject = ['$rootScope'];

    function AjaxLoaderController($rootScope) {

        var vm = this;
        vm.isLoading;
        vm.loadingMessage;
        vm.$onInit = onInit;

        function onInit() {
            vm.isLoading = false;
            vm.loadingMessage = 'Loading...';
        }

        $rootScope.$on('start-loading', function(event, data) {
            vm.isLoading = true;
            vm.loadingMessage = data.loadingMessage;
        });

        $rootScope.$on('stop-loading', function(event, data) {
            vm.isLoading = false;
        });

    }

})();