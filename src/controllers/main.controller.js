(function() {
    'use strict';

    angular
        .module('myApp')
        .controller('MainController', MainController);

    MainController.$inject = ['trainService'];
    function MainController(trainService) {
        var vm = this;
        
        vm.getTrainsByStation = getTrainsByStation;

        activate();

        
        ////////////////

        function activate() { }

        function getTrainsByStation() {
            trainService.getTrainsByStation();
        }

    }
})();