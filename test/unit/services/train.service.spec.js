fdescribe('trainService', function() {

    let trainService, distanceService, $http, $httpBackend, ENDPOINTS_CONSTANTS, $q;

    beforeEach(function() {
        module('myApp');
        module(function($provide) {
            $provide.value('distanceService', {

            });
        });


        inject(function(_trainService_, _$http_, _$httpBackend_, _ENDPOINTS_CONSTANTS_, _HTTP_CONSTANTS_, _$q_) {
            trainService = _trainService_;
            $http = _$http_;
            $httpBackend = _$httpBackend_;
            ENDPOINTS_CONSTANTS = _ENDPOINTS_CONSTANTS_;
            HTTP_CONSTANTS = _HTTP_CONSTANTS_;
            $q = _$q_;
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('init', function() {

        it('should be defined', function() {
            expect(trainService).toBeDefined();
        });

        it('should define the exposed methods', function() {
            expect(trainService.getAllStations).toEqual(jasmine.any(Function));
            expect(trainService.getTrainsByStation).toEqual(jasmine.any(Function));
            expect(trainService.getCurrentTrains).toEqual(jasmine.any(Function));
            expect(trainService.getTrainMovements).toEqual(jasmine.any(Function));
            expect(trainService.orderStationsByName).toEqual(jasmine.any(Function));
            expect(trainService.orderStationsByDistance).toEqual(jasmine.any(Function));
        });

    });

    describe('getAllStations', function() {

        it('should perform the $http request with the right parameters', function() {
            $httpBackend.expectGET(`${HTTP_CONSTANTS.SERVICE_BASE_URL}/${ENDPOINTS_CONSTANTS.GET_ALL_STATIONS}`);
            trainService.getAllStations();
        });

    });

    describe('getTrainsByStation', function() {

        it('should perform the $http request with the right parameters', function() {
            $httpBackend.expectGET(`${HTTP_CONSTANTS.SERVICE_BASE_URL}/${ENDPOINTS_CONSTANTS.GET_STATION_BY_NAME}?StationDesc=Italy`);
            trainService.getTrainsByStation('Italy');
        });

    });

    describe('getTrainMovements', function() {

        it('should perform the $http request with the right parameters', function() {
            $httpBackend.expectGET(`${HTTP_CONSTANTS.SERVICE_BASE_URL}/${ENDPOINTS_CONSTANTS.GET_TRAIN_MOVEMENTS}?TrainId=1&TrainDate=Today`);
            trainService.getTrainMovements('1', 'Today');
        });

    });

    describe('getCurrentTrains', function() {

        it('should perform the $http request with the right parameters', function() {
            $httpBackend.expectGET(`${HTTP_CONSTANTS.SERVICE_BASE_URL}/${ENDPOINTS_CONSTANTS.GET_CURRENT_TRAINS}`);
            trainService.getCurrentTrains();
        });

    });

    describe('orderStationsByName', function() {

        it('should return an array of the stations sorted by name', function() {
            expect(2).toBe(5);
        });

    });

});