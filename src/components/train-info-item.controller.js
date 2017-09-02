(function() {
    'use strict';

    angular.module('myApp').controller('TrainInfoItemController', TrainInfoItemController);

    TrainInfoItemController.$inject = ['$mdDialog'];

    function TrainInfoItemController($mdDialog) {

        var vm = this;

        vm.openTrainPanel = openTrainPanel;


        function openTrainPanel(ev) {
            $mdDialog.show({
                    controller: 'TrainPanelController',
                    controllerAs: 'vm',
                    templateUrl: 'src/templates/train-panel.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true
                })
                .then(function(answer) {
                    
                }, function() {
                    
                });
        }

    }
})();