(function() {
    'use strict';

    angular.module('myApp').controller('MainController', MainController);

    MainController.$inject = ['allStations', 'trainService', '$rootScope', '$q'];

    function MainController(allStations, trainService, $rootScope, $q) {

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
                loadingMessage: 'Retrieving trains information'
            });
            trainService.getTrainsByStation(vm.startingStation.StationDesc)
                .then(onGetTrainsByStation)
                .catch(onError);

            function onGetTrainsByStation(data) {
                // need to create an array because when the train is only one, the api returns a single object instead of an array with one element
                let allTrainsList = data.ArrayOfObjStationData.objStationData ? [].concat(data.ArrayOfObjStationData.objStationData) : [];
                // here we need to filter the trains based on their movements in order to understand if it stops in the target station
                let promises = [];
                allTrainsList.forEach(setupCallForTrainMovements);
                $q.all(promises)
                    .then(onGetTrainsMovements)
                    .catch(onError);

                function setupCallForTrainMovements(train) {
                    promises.push(trainService.getTrainMovements(train.Traincode, train.Traindate));
                }

                function onGetTrainsMovements(data) {
                    // get the array of all the trains movements
                    let allTrainsMovements = data.map(el => el.ArrayOfObjTrainMovements.objTrainMovements);
                    // here add the movements to each train by Traincode 
                    allTrainsList.forEach(addMovementsToTrain);
                    // filter the trains that don't contain the target station as destination and that already passed the target destination
                    vm.trainsList = allTrainsList.filter(filterTrainsByTargetStation);
                    // filter all the movements keeping just the stations between the source and the destination
                    vm.trainsList.forEach(filterNotNeededMovements);
                    // finish the loading process displaying eventually results 
                    vm.clicked = true;
                    $rootScope.$broadcast('stop-loading', {});

                    function addMovementsToTrain(train) {
                        train.movements = allTrainsMovements.find(allTrainMovements => allTrainMovements.find(movement => movement.TrainCode === train.Traincode));
                    }

                    function filterTrainsByTargetStation(train) {
                        return isTheTargetStationPresentAndNotPassedYet(train);
                    }

                    function isTheTargetStationPresentAndNotPassedYet(train) {
                        // find if the target station is inside the list of stops, otherwise return skipping this element
                        let destinationIndex = train.movements.findIndex(movement => movement.LocationFullName === vm.endingStation.StationDesc);
                        if (destinationIndex === -1) {
                            return false;
                        }
                        // return the element only if the target station is already not passed
                        let sourceIndex = train.movements.findIndex(movement => movement.LocationFullName === vm.startingStation.StationDesc);
                        return destinationIndex > sourceIndex;
                    }

                    function filterNotNeededMovements(train) {
                        let sourceIndex = train.movements.findIndex(movement => movement.LocationFullName === vm.startingStation.StationDesc);
                        let destinationIndex = train.movements.findIndex(movement => movement.LocationFullName === vm.endingStation.StationDesc);
                        train.movements = train.movements.filter(keepOnlyRelevantStations.bind(null, sourceIndex, destinationIndex));
                    }

                    function keepOnlyRelevantStations(sourceIndex, destinationIndex, movement, index) {
                        return index >= sourceIndex && index <= destinationIndex;
                    }

                }
            }
        }

        function onError(err) {
            vm.clicked = true;
            $rootScope.$broadcast('stop-loading', {});
            throw new Error(err);
        }

        function getFilteredStations(queryStation) {
            return vm.stations.filter(filterStationByName);

            function filterStationByName(station) {
                return station.StationDesc.toLowerCase().indexOf(queryStation.toLowerCase()) > -1;
            }
        }

    }
})();