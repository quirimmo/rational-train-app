(function() {
    'use strict';

    angular.module('myApp').component('trainInfoItem', {
        templateUrl: 'src/components/train-info-item.html',
        controller: 'TrainInfoItemController',
        controllerAs: 'vm',
        bindings: {
            train: '='
        }
    });

})();