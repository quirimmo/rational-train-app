(function() {
    'use strict';

    angular.module('myApp').controller('TrainInfoItemController', TrainInfoItemController);

    TrainInfoItemController.$inject = ['$mdDialog', 'trainService', 'NavigatorGeolocation', '$rootScope'];

    function TrainInfoItemController($mdDialog, trainService, NavigatorGeolocation, $rootScope) {

        // bindings
        // train: '='
        // startingStation: '='

        var vm = this;

        vm.openTrainPanel = openTrainPanel;

        function openTrainPanel(ev) {
            $rootScope.$broadcast('start-loading', {
                loadingMessage: 'Retrieving current train information'
            });
            trainService.getCurrentTrains()
                .then(onGetCurrentTrains)
                .catch(onError);

            function onGetCurrentTrains(data) {
                let trainsPositions = data.ArrayOfObjTrainPositions.objTrainPositions;
                let currentTrainPosition = trainsPositions.find(train => train.TrainCode === vm.train.Traincode);

                NavigatorGeolocation.getCurrentPosition()
                    .then(onGetCurrentPositionSuccess)
                    .catch(onError);

                function onGetCurrentPositionSuccess(position) {
                    let currentPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    openModal(currentTrainPosition, currentPosition);
                }
            }

            function onError(err) {
                throw new Error(err);
            }

            function openModal(currentTrainPosition, currentPosition) {
                $mdDialog.show({
                    controller: 'TrainPanelController',
                    controllerAs: 'vm',
                    templateUrl: 'src/templates/train-panel.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true,
                    locals: {
                        train: vm.train,
                        trainPosition: currentTrainPosition,
                        currentPosition: currentPosition,
                        startingStation: vm.startingStation
                    }
                });
                $rootScope.$broadcast('stop-loading', {})
            }

        }

    }
})();