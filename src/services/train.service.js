(function() {
    'use strict';

    angular.module('myApp').service('trainService', trainService);

    trainService.$inject = ['$http', 'ENDPOINTS_CONSTANTS'];

    function trainService($http, ENDPOINTS_CONSTANTS) {

        this.getTrainsByStation = getTrainsByStation;

        // ============================================================


        function getTrainsByStation(startingStation) {
            let request = {
                url: 'irishrail/' + ENDPOINTS_CONSTANTS.GET_STATION_BY_NAME,
                params: {
                    StationDesc: startingStation
                }
            };
            return $http(request);
        }

    }
})();