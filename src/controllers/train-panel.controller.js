(function() {
    'use strict';

    angular.module('myApp').controller('TrainPanelController', TrainPanelController);

    TrainPanelController.$inject = ['$interval', '$mdDialog', 'train', 'trainPosition', 'currentPosition', 'startingStation', 'trainService', 'NavigatorGeolocation', 'NgMap', 'distanceService'];

    function TrainPanelController($interval, $mdDialog, train, trainPosition, currentPosition, startingStation, trainService, NavigatorGeolocation, NgMap, distanceService) {
        var vm = this;

        const UPDATE_TRAIN_POSITION_TIMEOUT = 30 * 1000;

        vm.train = train;
        vm.trainPosition = trainPosition;
        vm.currentPosition = currentPosition;
        vm.distanceToTheStation;
        vm.timeToTheStation;
        vm.timestampArrivingToTheStation;
        vm.timestampTrainDepartureFromTheStation;
        let updateTrainPositionInterval = undefined;

        vm.closePanel = closePanel;
        vm.getTrainPosition = getTrainPosition;
        vm.getCurrentPosition = getCurrentPosition;
        vm.getStationPosition = getStationPosition;
        vm.isLate = isLate;
        vm.isTrainPositionDefined = isTrainPositionDefined;
        
        init();

        function init() {
            // if the train is running, start the real time tracking
            if (vm.isTrainPositionDefined() && isTrainRunning()) {
                // my idea was to create a real time tracking of the train, 
                // but it looks like irishtrail doesn't update the values of latitude and longitude constantly but just after a while 
                updateTrainPositionInterval = $interval(updateTrainPosition, UPDATE_TRAIN_POSITION_TIMEOUT);
            }
            distanceService.calculateDistance(vm.currentPosition.latitude, vm.currentPosition.longitude, startingStation.StationLatitude, startingStation.StationLongitude)
                .then(onCalculateDistanceSuccess)
                .catch(onError);

            function onCalculateDistanceSuccess(data) {
                vm.distanceToTheStation = data[0].distance.text;
                vm.timeToTheStation = data[0].duration.text;
                let calculatedDistance = distanceService.calculateTimeDuration(data[0].duration.value / 60, vm.train.Expdepart);
                vm.timestampTrainDepartureFromTheStation = calculatedDistance.originTimeDate;
                vm.timestampArrivingToTheStation = calculatedDistance.arrivingTimeDate;
            }
        }

        function closePanel() {
            if (updateTrainPositionInterval) {
                $interval.cancel(updateTrainPositionInterval);
            }
            $mdDialog.cancel();
        }

        function updateTrainPosition() {
            trainService.getCurrentTrains()
                .then(onGetCurrentTrainsSuccess)
                .catch(onError);

            function onGetCurrentTrainsSuccess(data) {
                let trainsPositions = data.ArrayOfObjTrainPositions.objTrainPositions;
                let currentTrainPosition = trainsPositions.find(getTrainByCode);
                vm.trainPosition = currentTrainPosition;
                NavigatorGeolocation.getCurrentPosition()
                    .then(onGetCurrentPositionSuccess)
                    .catch(onError);

                function onGetCurrentPositionSuccess(position) {
                    vm.currentPosition.latitude = position.coords.latitude;
                    vm.currentPosition.longitude = position.coords.longitude;
                }

                function getTrainByCode(train) {
                    return train.TrainCode === vm.train.Traincode;
                }
            }
        }

        function onError(err) {
            throw new Error(err);
        }

        function isTrainRunning() {
            return vm.trainPosition.TrainStatus === 'R';
        }

        function isTrainPositionDefined() {
            return angular.isDefined(vm.trainPosition);
        }

        function isLate() {
            return (+vm.timestampTrainDepartureFromTheStation - +vm.timestampArrivingToTheStation) < 0;
        }

        function getTrainPosition() {
            return [+vm.trainPosition.TrainLatitude, +vm.trainPosition.TrainLongitude];
        }

        function getCurrentPosition() {
            return [+vm.currentPosition.latitude, +vm.currentPosition.longitude];
        }

        function getStationPosition() {
            return [+startingStation.StationLatitude, +startingStation.StationLongitude];
        }

    }
})();