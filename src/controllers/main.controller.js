(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('MainController', MainController);

    MainController.$inject = ['allStations', 'trainService'];

    function MainController(allStations, trainService) {

        var vm = this;

        console.log(allStations);
        vm.stations = allStations;
        // vm.startingStation = 'Arklow';
        // vm.endingStation = 'Shankill';
        vm.startingStationSearchText;
        vm.endingStationSearchText;
        vm.trainsList = [];
        vm.clicked = false;

        vm.exchangeStations = exchangeStations;
        vm.searchTrains = searchTrains;
        vm.getFilteredStations = getFilteredStations;

        // ============================================================

        function exchangeStations() {
            let ref = vm.startingStation;
            vm.startingStation = vm.endingStation;
            vm.endingStation = ref;
        }

        function searchTrains() {
            trainService.getTrainsByStation(vm.startingStation.StationDesc)
                .then(data => {
                    vm.clicked = true;
                    // need to create an array because when the train is only one, the api returns a single object instead of an array with one element
                    vm.trainsList = data.ArrayOfObjStationData.objStationData ? [].concat(data.ArrayOfObjStationData.objStationData) : [];
                    console.log(vm.trainsList);
                });
        }

        function getFilteredStations(queryStation) {
            return vm.stations.filter(filterStationByName);

            function filterStationByName(station) {
                return station.StationDesc.toLowerCase().indexOf(queryStation.toLowerCase()) > -1;
            }
        }

    }
})();