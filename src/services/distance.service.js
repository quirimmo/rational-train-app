(function() {
    'use strict';

    angular.module('myApp').service('distanceService', distanceService);

    distanceService.$inject = ['$q'];

    function distanceService($q) {

        this.calculateDistance = calculateDistance;

        // ============================================================


        function calculateDistance(originLatitude, originLongitude, destinationLatitude, destinationLongitude) {
            let deferred = $q.defer(); 

            var origin1 = new google.maps.LatLng(+originLatitude, +originLongitude);
            var destination1 = new google.maps.LatLng(+destinationLatitude, +destinationLongitude);
    
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [origin1],
                destinations: [destination1],
                travelMode: 'WALKING'
            }, callback);
    
            function callback(response, status) {
                if (status === 'OK') {
                    let data = [];
                    response.rows.forEach(row => {
                        row.elements.forEach(element => {
                            data.push({
                                distance: element.distance,
                                duration: element.duration
                            });
                        });
                    });
                    deferred.resolve(data);
                }
                else {
                    console.log(response);
                    console.log(status);
                    deferred.reject('Error calculating distance');
                }
            }

            return deferred.promise;
        }

    }
})();