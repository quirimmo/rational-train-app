describe('TrainPanelController', function() {

    let controller, $scope, $rootScope, $q, $controller, $interval;

    let distanceMock = [{
        distance: {
            text: '100m'
        },
        duration: {
            text: '10 min',
            value: '600'
        }
    }];

    let NavigatorGeolocationMock = {
        getCurrentPosition: function() {
            return $q.resolve({
                coords: {
                    latitude: 500,
                    longitude: 500
                }
            });
        }
    };
    let distanceServiceMock = {
        calculateDistance: function() {
            return $q.resolve(distanceMock);
        },
        calculateTimeDuration: function() {
            return {
                originTimeDate: 100,
                arrivingTimeDate: 200
            };
        }
    };
    let trainServiceMock = {
        getCurrentTrains: function() {
            return $q.resolve();
        }
    };
    let getCurrentTrainsMock = {
        ArrayOfObjTrainPositions: {
            objTrainPositions: []
        }
    };

    beforeEach(function() {
        module('myApp');
        module('templates');

        module(function($provide) {
            $provide.value('distanceService', distanceServiceMock);
            $provide.value('trainService', trainServiceMock);
            $provide.value('trainPosition', {
                TrainLatitude: 5,
                TrainLongitude: 5
            });
            $provide.value('currentPosition', {
                latitude: 0,
                longitude: 0
            });
            $provide.value('train', {
                Expdepart: 50
            });
            $provide.value('$mdDialog', {
                cancel: function() {}
            });
            $provide.value('startingStation', {
                StationLatitude: 10,
                StationLongitude: 10
            });
            $provide.value('NgMap', {});
            $provide.value('NavigatorGeolocation', NavigatorGeolocationMock);
        });

        inject(function(_$interval_, _$q_, _$rootScope_, _$controller_, _distanceService_, _trainService_, _trainPosition_, _currentPosition_, _train_, _$mdDialog_, _startingStation_, _NgMap_, _NavigatorGeolocation_) {
            $interval = _$interval_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            distanceService = _distanceService_;
            trainService = _trainService_;
            trainPosition = _trainPosition_;
            currentPosition = _currentPosition_;
            startingStation = _startingStation_;
            NgMap = _NgMap_;
            train = _train_;
            $mdDialog = _$mdDialog_;
            NavigatorGeolocation = _NavigatorGeolocation_;
            $controller = _$controller_;
        });
    });

    describe('initialization', function() {

        it('should init all the exposed functions', function() {
            controller = $controller('TrainPanelController', { $scope: $scope });
            expect(controller.closePanel).toEqual(jasmine.any(Function));
            expect(controller.getTrainPosition).toEqual(jasmine.any(Function));
            expect(controller.getCurrentPosition).toEqual(jasmine.any(Function));
            expect(controller.getStationPosition).toEqual(jasmine.any(Function));
            expect(controller.isLate).toEqual(jasmine.any(Function));
            expect(controller.isTrainPositionDefined).toEqual(jasmine.any(Function));
        });

        it('should call the distanceService.calculateDistance method with the right parameters', function() {
            spyOn(distanceService, 'calculateDistance').and.callThrough();
            controller = $controller('TrainPanelController', { $scope: $scope });
            expect(distanceService.calculateDistance).toHaveBeenCalledWith(0, 0, 10, 10);
        });

        it('should set correctly the train departure time and the arrive to the station time', function() {
            controller = $controller('TrainPanelController', { $scope: $scope });
            $scope.$digest();
            expect(controller.timestampTrainDepartureFromTheStation).toEqual(100);
            expect(controller.timestampArrivingToTheStation).toEqual(200);
        });
        
    });

    describe('isTrainPositionDefined', function() {

        beforeEach(function() {
            controller = $controller('TrainPanelController', { $scope: $scope });
        });

        it('should return false if the train position is not defined', function() {
            delete controller.trainPosition;
            expect(controller.isTrainPositionDefined()).toEqual(false);
        });

        it('should return true if the train position is defined', function() {
            expect(controller.isTrainPositionDefined()).toEqual(true);
        });

    });

    describe('getStationPosition', function() {

        it('should return the position of the startingStation', function() {
            expect(controller.getStationPosition()).toEqual([10, 10]);
        });

    });

    describe('getCurrentPosition', function() {

        it('should return the current position', function() {
            expect(controller.getCurrentPosition()).toEqual([0, 0]);
        });

    });

    describe('getTrainPosition', function() {

        it('should return the train position', function() {
            expect(controller.getTrainPosition()).toEqual([5, 5]);
        });

    });

    describe('isLate', function() {

        it('should return true if you are not in time for getting the train', function() {
            controller.timestampTrainDepartureFromTheStation = 10;
            controller.timestampArrivingToTheStation = 20;
            expect(controller.isLate()).toEqual(true);
        });

        it('should return false if you are in time for getting the train', function() {
            controller.timestampTrainDepartureFromTheStation = 20;
            controller.timestampArrivingToTheStation = 10;
            expect(controller.isLate()).toEqual(false);
        });

    });

    describe('closePanel', function() {

        it('should call the $mdDialog.cancel method', function() {
            controller = $controller('TrainPanelController', { $scope: $scope });
            spyOn($mdDialog, 'cancel').and.callThrough();
            controller.closePanel();
            expect($mdDialog.cancel).toHaveBeenCalled();
        });

        it('should not call the $interval.cancel if the train is not running and the train position is not defined', function() {
            controller = $controller('TrainPanelController', { $scope: $scope });
            spyOn($interval, 'cancel').and.callThrough();
            controller.closePanel();
            expect($interval.cancel).not.toHaveBeenCalled();
        });

        it('should call the $interval.cancel if the train is running and the train position is defined', function() {
            trainPosition.TrainStatus = 'R';
            controller = $controller('TrainPanelController', { $scope: $scope });
            spyOn($interval, 'cancel').and.callThrough();
            controller.closePanel();
            expect($interval.cancel).toHaveBeenCalled();
        });

    });

});