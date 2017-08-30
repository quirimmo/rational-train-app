(function() {
    'use strict';

    angular.module('myApp')
    .factory('sessionInjector', [function() {  
        return {
            request: function(config) {
				return config;
            },
        
            requestError: function(config) {
              	return config;
            },
        
            response: function(res) {
				console.log('getting response');
              	return res;
            },
        
            responseError: function(res) {
              	return res;
            }
		}
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
        function($stateProvider, $urlRouterProvider, $httpProvider) {

            let mainState = {
                name: 'main',
                url: '/main',
                templateUrl: 'src/templates/main.html',
                controller: 'MainController',
                controllerAs: 'vm'
            };

            $stateProvider.state(mainState);
            $urlRouterProvider.otherwise('main');

            $httpProvider.interceptors.push('sessionInjector');
        }
    ]);

})();