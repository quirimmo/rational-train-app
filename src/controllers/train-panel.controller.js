(function() {
    'use strict';

    angular.module('myApp').controller('TrainPanelController', TrainPanelController);

    TrainPanelController.$inject = ['$mdDialog'];
    function TrainPanelController($mdDialog) {
        var vm = this;
        
        vm.closePanel = closePanel;

        function closePanel() {
            $mdDialog.cancel();
        }

    }
})();