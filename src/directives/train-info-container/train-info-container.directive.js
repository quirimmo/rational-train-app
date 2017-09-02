(function() {
    'use strict';

    angular.module('myApp').directive('trainInfoContainer', TrainInfoContainer);

    TrainInfoContainer.$inject = [];

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

        function link(scope, element, attrs, $ctrl) {
            scope.flexValue = attrs.flexValue;
        }
    }
})();