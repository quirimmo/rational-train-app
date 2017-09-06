(function() {
    'use strict';

    var app = angular.module('myApp'); 
    
    app.directive('trainInfoContainer', TrainInfoContainer);

    function TrainInfoContainer() {
        var directive = {
            replace: true,
            templateUrl: 'src/directives/train-info-container/train-info-container.html',
            link: link,
            restrict: 'A',
            scope: {
                labelTitle: '@',
                labelValue: '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.flexValue = attrs.flexValue;
        }
    }
})();