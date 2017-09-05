(function() {
    'use strict';

    var app = angular.module('myApp');
    
    app.constant('HTTP_CONSTANTS', {
        DEFAULT_METHOD: 'GET',
        DEFAULT_RESPONSE_CONTENT: 'application/xml',
        API_URL_HOOK: 'irishrail',
        SERVICE_BASE_URL: 'http://localhost:9000/http://api.irishrail.ie/realtime/realtime.asmx'
    });
    
    app.constant('ENDPOINTS_CONSTANTS', {
        GET_STATION_BY_NAME: 'getStationDataByNameXML',
        GET_CURRENT_TRAINS: 'getCurrentTrainsXML',
        GET_ALL_STATIONS: 'getAllStationsXML',
        GET_TRAIN_MOVEMENTS: 'getTrainMovementsXML'
    });

})();