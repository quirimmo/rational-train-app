(function() {
    'use strict';

    var app = angular.module('myApp');
    
    app.component('trainInfoItem', {
        templateUrl: 'src/components/train-info-item/train-info-item.html',
        controller: 'TrainInfoItemController',
        controllerAs: 'vm',
        bindings: {
            train: '=',
            startingStation: '='
        }
    });

})();