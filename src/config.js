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
                            // starting the loading using timeout in order to wait that the angular view has been loaded
                            $timeout(function() {
                                $rootScope.$broadcast('start-loading', {
                                    loadingMessage: 'Retrieving your current position and ordering all the stations depending on your current distance'
                                });
                            });
                            return NavigatorGeolocation.getCurrentPosition()
                                .then(onGetCurrentPosition)
                                .catch(onError);

                            function onGetCurrentPosition(position) {
                                let currentPosition = {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                };
                                return trainService.getAllStations()
                                    .then(onGetAllStations)
                                    .catch(onError);

                                function onGetAllStations(data) {
                                    return trainService.orderStationsByDistance(data.ArrayOfObjStation.objStation, currentPosition)
                                        .then(onStationsOrdered)
                                        .catch(onError);
                                    
                                    function onStationsOrdered(data) {
                                        // stop the loading
                                        $rootScope.$broadcast('stop-loading', {});
                                        return data;
                                    }
                                }
                            }
                        }
                    }
                };

                $stateProvider.state(mainState);
                $urlRouterProvider.otherwise('main');

                function onError(err) {
                    // stop the loading and throw the error
                    $rootScope.$broadcast('stop-loading', {});
                    throw new Error(err);
                }
            }
        ]);

})();