(function() {
    'use strict';

    angular.module('myApp')
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
            }
        ]);

})();