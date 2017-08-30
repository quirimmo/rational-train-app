(function() {
    'use strict';

    angular.module('myApp').service('trainService', ['$http', trainService]);

    function trainService($http) {
        this.getTrainsByStation = getTrainsByStation;

        ////////////////

        function getTrainsByStation() {

            let request = {
                method: 'GET',
                url: 'http://localhost:9000/http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=Bayside',
                headers: {
                    'Content-Type': 'application/xml'
                }
            };
            $http(request).then(function(data) {
                console.log(data);
            });

        }

    }
})();