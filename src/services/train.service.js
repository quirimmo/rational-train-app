(function() {
    'use strict';

    angular.module('myApp').service('trainService', trainService);

    trainService.$inject = ['$http', 'ENDPOINTS_CONSTANTS', 'distanceService', '$q', 'HTTP_CONSTANTS'];

    function trainService($http, ENDPOINTS_CONSTANTS, distanceService, $q, HTTP_CONSTANTS) {

        this.getAllStations = getAllStations;
        this.getTrainsByStation = getTrainsByStation;
        this.getCurrentTrains = getCurrentTrains;
        this.getTrainMovements = getTrainMovements;
        this.orderStationsByName = orderStationsByName;
        this.orderStationsByDistance = orderStationsByDistance;


        // ============================================================

        function getAllStations() {
            let request = {
                url: `${HTTP_CONSTANTS.API_URL_HOOK}/${ENDPOINTS_CONSTANTS.GET_ALL_STATIONS}`
            };
            return $http(request);
        }

        function getTrainsByStation(startingStation) {
            let request = {
                url: `${HTTP_CONSTANTS.API_URL_HOOK}/${ENDPOINTS_CONSTANTS.GET_STATION_BY_NAME}`,
                params: {
                    StationDesc: startingStation
                }
            };
            return $http(request);
        }

        function getTrainMovements(trainCode, trainDate) {
            let request = {
                url: `${HTTP_CONSTANTS.API_URL_HOOK}/${ENDPOINTS_CONSTANTS.GET_TRAIN_MOVEMENTS}`,
                params: {
                    TrainId: trainCode,
                    TrainDate: trainDate
                }
            };
            return $http(request);
        }

        function getCurrentTrains() {
            let request = {
                url: `${HTTP_CONSTANTS.API_URL_HOOK}/${ENDPOINTS_CONSTANTS.GET_CURRENT_TRAINS}`
            };
            return $http(request);
        }

        function orderStationsByName(stations) {
            return stations.sort(sortByStationDesc);

            function sortByStationDesc(a, b) {
                return a.StationDesc.localeCompare(b.StationDesc);
            }
        }

        // need of an async function because we want to order all the elements of an array
        // depending on a value which is asynchronous 
        //  
        async function orderStationsByDistance(stations, currentPosition) {
            // we need to slice the array in slices of 100 elements each one
            // the google maps api doesn't accept more than 104 requests every 6 seconds, so we need to split them and start requests through a timeout 
            // to prevent google to block us for flooding 
            const size = 100;
            const TIMEOUT_GOOGLE_APIS_REQUESTS = 6 * 1000;
            let subStationsGroups = [];
            let finalOrderedStations = [];
            let deferred = $q.defer();
            // create slices
            for (let i = 0; i < stations.length; i += size) {
                subStationsGroups.push(stations.slice(i, i + size));
            }
            // perform the first requests without timeout
            finalOrderedStations.push(await performDistanceCalculation(subStationsGroups[0]));
            // loop over all the other slices of stations
            for (let i = 1; i < subStationsGroups.length; i++) {
                setTimeout(timeoutDistanceCalculationRequests.bind(null, i), TIMEOUT_GOOGLE_APIS_REQUESTS);
            }
            return deferred.promise;

            async function timeoutDistanceCalculationRequests(i) {
                await finalOrderedStations.push(await performDistanceCalculation(subStationsGroups[i]));
                // resolving the promise only at the last slice so the config block of the angular ui router state gets loaded only when all the data has been loaded
                if (i === subStationsGroups.length - 1) {
                    finalOrderedStations = [].concat.apply([], finalOrderedStations);
                    finalOrderedStations.sort(sortByDistance);
                    finalOrderedStations = finalOrderedStations.map(x => x[1]);
                    deferred.resolve(finalOrderedStations);
                }
            }

            async function performDistanceCalculation(subStation) {
                return await $q.all(
                    subStation.map(async x => {
                        return [await distanceService.calculateDistance(x.StationLatitude, x.StationLongitude, currentPosition.latitude, currentPosition.longitude), x];
                    })
                );
            }

            function sortByDistance(a, b) {
                // in the sort we need to consider that in the train stations list, there are few elements with lat and long undefined
                if (!a[0][0].distance) {
                    return 1;
                }
                if (!b[0][0].distance) {
                    return -1;
                }
                return a[0][0].distance.value - b[0][0].distance.value;
            }
        }

    }
})();