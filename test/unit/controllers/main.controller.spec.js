describe('MainController', function() {

    let controller, $scope, $rootScope, $q, trainService;
    let startingStation = {
        StationDesc: 'Arklow'
    };
    let endingStation = {
        StationDesc: 'Shankill'
    };
    let allStationsMock = [
        startingStation,
        {
            StationDesc: 'Desc'
        },
        endingStation
    ];
    let trainsStationMocked = {
        ArrayOfObjStationData: {
            objStationData: [{

            }]
        }
    };
    let trainsMovementsMocked = [{
        ArrayOfObjTrainMovements: {
            objTrainMovements: [{

            }]
        }
    }];
    let trainServiceMock = {
        getTrainsByStation: function() {
            return $q.resolve(trainsStationMocked);
        },
        getTrainMovements: function() {
            return $q.resolve(trainsMovementsMocked);
        }
    };
    let trainsByStationMock = [{
        StationDesc: "Docklands",
        StationAlias: "",
        StationLatitude: "53.3509",
        StationLongitude: "-6.23929",
        StationCode: "DCKLS",
        StationId: "84",
        StationLatitude: "53.3509",
        StationLongitude: "-6.23929"
    }];

    beforeEach(function() {
        module('myApp');
        module('templates');

        module(function($provide) {
            $provide.value('allStations', allStationsMock);
            $provide.value('trainService', trainServiceMock);
        });

        inject(function(_$q_, _$rootScope_, _$controller_, _allStations_, _trainService_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            let $controller = _$controller_;
            trainService = _trainService_;
            controller = $controller('MainController', { $scope: $scope });
            controller.$onInit();
        });
    });

    describe('initialization', function() {

        it('should define the global needed function', function() {
            expect(controller.exchangeStations).toEqual(jasmine.any(Function));
            expect(controller.searchTrains).toEqual(jasmine.any(Function));
            expect(controller.getFilteredStations).toEqual(jasmine.any(Function));
        });

        it('should set clicked to false by default', function() {
            expect(controller.clicked).toEqual(false);
        });

        it('should set trainsList as an empty array', function() {
            expect(controller.trainsList.length).toEqual(0);
        });

        it('should set startingStation to the default one', function() {
            expect(controller.startingStation).toEqual(startingStation);
        });

        it('should set endingStation to the default one', function() {
            expect(controller.endingStation).toEqual(endingStation);
        });

    });

    describe('exchangeStations', function() {

        it('should change the selected stations', function() {
            expect(controller.startingStation).toEqual(startingStation);
            expect(controller.endingStation).toEqual(endingStation);
            controller.exchangeStations();
            expect(controller.startingStation).toEqual(endingStation);
            expect(controller.endingStation).toEqual(startingStation);
        });

    });

    describe('getFilteredStations', function() {

        it('should filter the stations depending on the text you put in the autocomplete', function() {
            expect(controller.stations).toEqual(allStationsMock);
            expect(controller.getFilteredStations('De')).toEqual([{
                StationDesc: 'Desc'
            }]);
        });

    });

    describe('searchTrains', function() {

        describe('resolved', function() {

            it('should send the $broadcast message for starting the loading with the right message', function() {
                spyOn($rootScope, '$broadcast');
                controller.searchTrains();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('start-loading', {
                    loadingMessage: 'Retrieving trains information'
                });
            });

            it('should call the trainService.getTrainsByStation method', function() {
                spyOn(trainService, 'getTrainsByStation').and.callThrough();
                controller.searchTrains();
                expect(trainServiceMock.getTrainsByStation).toHaveBeenCalled();
            });

            it('should call the trainService.getTrainMovements method', function() {
                spyOn(trainService, 'getTrainMovements');
                spyOn($q, 'all').and.returnValue($q.resolve([]));
                controller.searchTrains();
                $scope.$digest();
                expect(trainService.getTrainMovements).toHaveBeenCalled();
            });

            it('should stop the loading', function() {
                spyOn($q, 'all').and.returnValue($q.resolve([]));
                controller.searchTrains();
                spyOn($rootScope, '$broadcast').and.callThrough();
                $scope.$digest();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('stop-loading', {});
            });

            it('should set clicked to true', function() {
                spyOn($q, 'all').and.returnValue($q.resolve([]));
                expect(controller.clicked).toEqual(false);
                controller.searchTrains();
                $scope.$digest();
                expect(controller.clicked).toEqual(true);
            });

            it('should set up correctly the trainsList', function() {
                spyOn($q, 'all').and.returnValue($q.resolve([]));
                expect(controller.trainsList).toEqual([]);
                controller.searchTrains();
                $scope.$digest();
                // here I should expect the list populated
                // but need to pass all the objects correctly step by step 
                // through the mocking objects
                expect(controller.trainsList).toEqual([]);
            });

        });

        describe('rejected', function() {

            it('should set clicked to true if the request fails', function() {
                spyOn(trainService, 'getTrainsByStation').and.returnValue($q.reject());
                controller.searchTrains();
                expect($scope.$digest).toThrow();
                expect(controller.clicked).toEqual(true);
            });

            it('should stop the loading if the request fails', function() {
                spyOn(trainService, 'getTrainsByStation').and.returnValue($q.reject());
                controller.searchTrains();
                spyOn($rootScope, '$broadcast').and.callThrough();
                expect($scope.$digest).toThrow();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('stop-loading', {});
            });

        });

    });

});