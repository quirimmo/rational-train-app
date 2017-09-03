(function() {
    'use strict';

    angular.module('myApp').controller('TrainPanelController', TrainPanelController);

    TrainPanelController.$inject = ['$interval', '$mdDialog', 'train', 'trainPosition', 'currentPosition', 'startingStation', 'trainService', 'NavigatorGeolocation', 'NgMap', 'distanceService'];

    function TrainPanelController($interval, $mdDialog, train, trainPosition, currentPosition, startingStation, trainService, NavigatorGeolocation, NgMap, distanceService) {
        var vm = this;

        vm.closePanel = closePanel;
        vm.getTrainPosition = getTrainPosition;
        vm.getCurrentPosition = getCurrentPosition;
        vm.getStationPosition = getStationPosition;
        vm.train = train;
        vm.trainPosition = trainPosition;
        vm.currentPosition = currentPosition;
        let updateTrainPositionInterval = undefined;

        init();

        function init() {
            console.log(vm.train);
            console.log(vm.trainPosition);
            if (angular.isDefined(vm.trainPosition) && vm.trainPosition.TrainStatus === 'R') {
                updateTrainPositionInterval = $interval(updateTrainPosition, 30000);
            }
            distanceService.calculateDistance(vm.currentPosition.latitude, vm.currentPosition.longitude, startingStation.StationLatitude, startingStation.StationLongitude)
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                throw new Error(err);
            });
            // var origin1 = new google.maps.LatLng(+vm.currentPosition.latitude, +vm.currentPosition.longitude);
            // var destination1 = new google.maps.LatLng(+vm.trainPosition.TrainLatitude, +vm.trainPosition.TrainLongitude);
    
            // var service = new google.maps.DistanceMatrixService();
            // service.getDistanceMatrix({
            //     origins: [origin1],
            //     destinations: [destination1],
            //     travelMode: 'WALKING'
            // }, callback);
    
            // function callback(response, status) {
            //     console.log(response);
            //     if (status === 'OK') {
            //         response.rows.forEach(row => {
            //             row.elements.forEach(element => {
            //                 console.log(element.distance);
            //                 console.log(element.duration);
            //             });
            //         });
            //     }
            // }

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