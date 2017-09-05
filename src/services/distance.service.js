(function() {
    'use strict';

    var app = angular.module('myApp');
    
    app.service('distanceService', ['$q', distanceService]);

    function distanceService($q) {

        const TRAVEL_MODE = 'WALKING';

        this.calculateDistance = calculateDistance;
        this.calculateTimeDuration = calculateTimeDuration;

        // ============================================================


        function calculateDistance(originLatitude, originLongitude, destinationLatitude, destinationLongitude) {
            let deferred = $q.defer(); 

            let origin1 = new google.maps.LatLng(+originLatitude, +originLongitude);
            let destination1 = new google.maps.LatLng(+destinationLatitude, +destinationLongitude);
    
            let service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [origin1],
                destinations: [destination1],
                travelMode: TRAVEL_MODE
            }, callback);

            return deferred.promise;
    
            function callback(response, status) {
                // if request went fine
                if (status === 'OK') {
                    let data = [];
                    response.rows.forEach(row => {
                        row.elements.forEach(forEveryElement);
                    });
                    deferred.resolve(data);

                    function forEveryElement(element) {
                        data.push({
                            distance: element.distance,
                            duration: element.duration
                        });
                    }
                }
                else {
                    deferred.reject(`Error calculating the distance.\nStatus: ${status}\nError: ${response}`);
                }
            }
        }

        function calculateTimeDuration(arrivingTime, destinationTime) {
            let destinationDate = new Date();
            let retrievedTime = destinationTime.match(/(\d+):(\d+)/);
            let hours = retrievedTime[1];
            let minutes = retrievedTime[2];
            destinationDate.setHours(hours);
            destinationDate.setMinutes(minutes);

            let originDate = new Date();
            originDate.setMinutes(originDate.getMinutes() + arrivingTime);

            return {
                arrivingTimeDate: originDate,
                originTimeDate: destinationDate
            }
        }

    }
})();