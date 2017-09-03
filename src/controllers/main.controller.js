(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('MainController', MainController);

    MainController.$inject = ['allStations', 'trainService', '$rootScope'];

    function MainController(allStations, trainService, $rootScope) {

        var vm = this;

        const DEFAULT_STARTING_STATION = 'Arklow';
        const DEFAULT_ENDING_STATION = 'Shankill';
        vm.stations = allStations;
        vm.startingStation;
        vm.startingStationSearchText;
        vm.endingStation;
        vm.endingStationSearchText;
        vm.trainsList;
        vm.clicked;

        vm.exchangeStations = exchangeStations;
        vm.searchTrains = searchTrains;
        vm.getFilteredStations = getFilteredStations;
        vm.$onInit = onInit;

        // ============================================================

        function onInit() {
            vm.trainsList = [];
            vm.clicked = false;
            // set default stations as the chosen ones by default
            vm.startingStation = vm.stations.find(station => station.StationDesc === DEFAULT_STARTING_STATION);
            vm.endingStation = vm.stations.find(station => station.StationDesc === DEFAULT_ENDING_STATION);
        }

        function exchangeStations() {
            let ref = vm.startingStation;
            vm.startingStation = vm.endingStation;
            vm.endingStation = ref;
        }

        function searchTrains() {
            $rootScope.$broadcast('start-loading', {
                loadingMessage: 'Retrieving trains'
            });
            trainService.getTrainsByStation(vm.startingStation.StationDesc)
                .then(onGetTrainsByStation)
                .catch(onGetTrainsByStationError);
            
            function onGetTrainsByStationError(err) {
                $rootScope.$broadcast('stop-loading', {});
                throw new Error(err);
            }

            function onGetTrainsByStation(data) {
                vm.clicked = true;
                // need to create an array because when the train is only one, the api returns a single object instead of an array with one element
                vm.trainsList = data.ArrayOfObjStationData.objStationData ? [].concat(data.ArrayOfObjStationData.objStationData) : [];
                $rootScope.$broadcast('stop-loading', {});
            }

        }

        function getFilteredStations(queryStation) {
            return vm.stations.filter(filterStationByName);

            function filterStationByName(station) {
                return station.StationDesc.toLowerCase().indexOf(queryStation.toLowerCase()) > -1;
            }
        }

    }
})();