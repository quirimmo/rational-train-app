(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('MainController', MainController);

    MainController.$inject = ['trainService'];

    function MainController(trainService) {

        var vm = this;

        vm.startingStation = 'Arklow';
        vm.endingStation = 'Shankill';
        vm.trainsList = [];
        vm.clicked = false;

        vm.exchangeStations = exchangeStations;
        vm.searchTrains = searchTrains;
        vm.clickOnTrain = clickOnTrain;

        // ============================================================

        function exchangeStations() {
            let ref = vm.startingStation;
            vm.startingStation = vm.endingStation;
            vm.endingStation = ref;
        }

        function searchTrains() {
            
            trainService.getTrainsByStation(vm.startingStation)
                .then(data => {
                    vm.clicked = true;
                    // need to create an array because when the train is only one, the api returns a single object instead of an array with one element
                    vm.trainsList = data.ArrayOfObjStationData.objStationData ? [].concat(data.ArrayOfObjStationData.objStationData) : [];
                    console.log(vm.trainsList);
                });
        }

        function clickOnTrain() {
            console.log('clicked');
        }

    }
})();