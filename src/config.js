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
                    controllerAs: 'vm',
                    resolve: {
                        allStations: function($rootScope, $timeout, trainService, NavigatorGeolocation) {
                            // starting the loading
                            $timeout(function() {
                                $rootScope.$broadcast('start-loading', {
                                    loadingMessage: 'Retrieving your current position and ordering all the stations depending on your current distance'
                                });
                            });
                            return NavigatorGeolocation.getCurrentPosition()
                                .then(position => {
                                    let currentPosition = {
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude
                                    };
                                    return trainService.getAllStations()
                                        .then(data => {
                                            return trainService.orderStationsByDistance(data.ArrayOfObjStation.objStation, currentPosition)
                                            .then(data => {
                                                // stopping the loading
                                                $rootScope.$broadcast('stop-loading', {});
                                                return data;
                                            });
                                        })
                                        .catch(err => {
                                            throw new Error(err);
                                        });
                                })
                                .catch(err => {
                                    throw new Error(err);
                                });
                        }
                    }
                };

                $stateProvider.state(mainState);
                $urlRouterProvider.otherwise('main');
            }
        ]);

})();