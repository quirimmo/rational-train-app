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

        init();

        function init() {
            console.log(vm.train);
            console.log(vm.trainPosition);
            if (angular.isDefined(vm.trainPosition) && vm.trainPosition.TrainStatus === 'R') {
                // my idea was to create a real time tracking of the train, but it looks like irishtrail doesn't update the values of latitude and longitude constantly but just after a while 
                updateTrainPositionInterval = $interval(updateTrainPosition, UPDATE_TRAIN_POSITION_TIMEOUT);
            }
            distanceService.calculateDistance(vm.currentPosition.latitude, vm.currentPosition.longitude, startingStation.StationLatitude, startingStation.StationLongitude)
            .then(data => {
                vm.distanceToTheStation = data[0].distance.text;
                vm.timeToTheStation = data[0].duration.text;

                let expDepart = vm.train.Expdepart;
                let d = new Date();
                let parts = expDepart.match(/(\d+):(\d+)/);
                let hours = parts[1];
                let minutes = parts[2];
                d.setHours(hours);
                d.setMinutes(minutes);
                
                let d2 = new Date();
                d2.setMinutes(data[0].duration.value / 60);

                vm.timestampTrainDepartureFromTheStation = d.getTime(); 
                vm.timestampArrivingToTheStation = d2.getTime();
            })
            .catch(err => {
                throw new Error(err);
            });
        }

        function closePanel() {
            if (updateTrainPositionInterval) {
                $interval.cancel(updateTrainPositionInterval);
            }
            $mdDialog.cancel();
        }

        function updateTrainPosition() {
            trainService.getCurrentTrains().then(data => {
                let trainsPositions = data.ArrayOfObjTrainPositions.objTrainPositions;
                let currentTrainPosition = trainsPositions.find(train => train.TrainCode === vm.train.Traincode);
                vm.trainPosition = currentTrainPosition;
                NavigatorGeolocation.getCurrentPosition()
                    .then(position => {
                        vm.currentPosition.latitude = position.coords.latitude;
                        vm.currentPosition.longitude = position.coords.longitude;
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            });
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