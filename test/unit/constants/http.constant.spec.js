describe('http.constant', function() {

    let HTTP_CONSTANTS, ENDPOINTS_CONSTANTS;

    beforeEach(function() {
        module('myApp');

        inject(function(_HTTP_CONSTANTS_, _ENDPOINTS_CONSTANTS_) {
            HTTP_CONSTANTS = _HTTP_CONSTANTS_;
            ENDPOINTS_CONSTANTS = _ENDPOINTS_CONSTANTS_;
        });
    });

    describe('HTTP_CONSTANTS', function() {

        it('should define the default method as GET', function() {
            expect(HTTP_CONSTANTS.DEFAULT_METHOD).toEqual('GET');
        });

        it('should define the default response content as appication/xml', function() {
            expect(HTTP_CONSTANTS.DEFAULT_RESPONSE_CONTENT).toEqual('application/xml');
        });

        it('should define the default api url hook as irishrail', function() {
            expect(HTTP_CONSTANTS.API_URL_HOOK).toEqual('irishrail');
        });

        it('should define the default service base url as http://localhost:9000/http://api.irishrail.ie/realtime/realtime.asmx', function() {
            expect(HTTP_CONSTANTS.SERVICE_BASE_URL).toEqual('http://localhost:9000/http://api.irishrail.ie/realtime/realtime.asmx');
        });

    });

    describe('ENDPOINTS_CONSTANTS', function() {

        it('should define the get station by name endpoint as getStationDataByNameXML', function() {
            expect(ENDPOINTS_CONSTANTS.GET_STATION_BY_NAME).toEqual('getStationDataByNameXML');
        });

        it('should define the get current trains endpoint as getCurrentTrainsXML', function() {
            expect(ENDPOINTS_CONSTANTS.GET_CURRENT_TRAINS).toEqual('getCurrentTrainsXML');
        });

        it('should define the get all stations endpoint as getAllStationsXML', function() {
            expect(ENDPOINTS_CONSTANTS.GET_ALL_STATIONS).toEqual('getAllStationsXML');
        });

        it('should define the get train movements endpoint as getTrainMovementsXML', function() {
            expect(ENDPOINTS_CONSTANTS.GET_TRAIN_MOVEMENTS).toEqual('getTrainMovementsXML');
        });

    });

});