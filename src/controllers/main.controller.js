(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('MainController', MainController);

    MainController.$inject = ['trainService'];

    function MainController(trainService) {

        var vm = this;

        vm.getTrainsByStation = getTrainsByStation;

        // ============================================================

        
        function getTrainsByStation() {
            trainService.getTrainsByStation();
        }

    }
})();