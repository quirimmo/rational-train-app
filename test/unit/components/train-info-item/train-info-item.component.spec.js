describe('trainInfoItem', function() {

    let controller, $rootScope, $scope, $q, trainService, NavigatorGeolocation, $mdDialog;
    let trainBinding = {
        Traincode: 'code1'
    };
    let startingStationBinding = {
        StationDesc: 'desc1'
    };
    let currentTrainsMocked = {
        ArrayOfObjTrainPositions: {
            objTrainPositions: [{
                TrainCode: 'code1'
            }]
        }
    };
    let position = {
        coords: {
            latitude: '10',
            longitude: '10'
        }
    };

    beforeEach(module('myApp'));
    beforeEach(module('templates'));

    beforeEach(module(function($provide) {
        $provide.value('trainService', {
            getCurrentTrains: function() {
                return $q.resolve(currentTrainsMocked);
            }
        });
        $provide.value('NavigatorGeolocation', {
            getCurrentPosition: function() {
                return $q.resolve(position);
            }
        });
        $provide.value('$mdDialog', {
            show: function() {}
        });
    }));

    beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _trainService_, _NavigatorGeolocation_, _$mdDialog_) {
        let $componentController = _$componentController_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $q = _$q_;
        trainService = _trainService_;
        NavigatorGeolocation = _NavigatorGeolocation_;
        $mdDialog = _$mdDialog_;
        controller = $componentController('trainInfoItem', null, {
            train: trainBinding,
            startingStation: startingStationBinding
        });
    }));

    describe('init', function() {

        it('should init the bindings', function() {
            expect(controller.train).toEqual(trainBinding);
            expect(controller.startingStation).toEqual(startingStationBinding);
        });

    });

    describe('openTrainPanel', function() {

        it('should start the loading', function() {
            spyOn($rootScope, '$broadcast').and.callThrough();
            controller.openTrainPanel();
            $scope.$digest();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('start-loading', {
                loadingMessage: 'Retrieving current train information'
            });
        });

        it('should call the trainService.getCurrentTrains method', function() {
            spyOn(trainService, 'getCurrentTrains').and.callThrough();
            controller.openTrainPanel();
            $scope.$digest();
            expect(trainService.getCurrentTrains).toHaveBeenCalled();
        });

        it('should call the NavigatorGeolocation.getCurrentPosition method', function() {
            spyOn(NavigatorGeolocation, 'getCurrentPosition').and.callThrough();
            controller.openTrainPanel();
            $scope.$digest();
            expect(NavigatorGeolocation.getCurrentPosition).toHaveBeenCalled();
        });

        it('should call the $mdDialog.show method with the right parameters', function() {
            spyOn($mdDialog, 'show').and.callThrough();
            let eventMock = 'test';
            controller.openTrainPanel(eventMock);
            $scope.$digest();
            expect($mdDialog.show).toHaveBeenCalledWith({
                controller: 'TrainPanelController',
                controllerAs: 'vm',
                templateUrl: 'src/templates/train-panel.html',
                parent: angular.element(document.body),
                targetEvent: eventMock,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    train: controller.train,
                    trainPosition: {
                        TrainCode: 'code1'
                    },
                    currentPosition: position.coords,
                    startingStation: controller.startingStation
                }
            });
        });

        it('should stop the loading and throw an error if the promise has been rejected', function() {
            spyOn($rootScope, '$broadcast').and.callThrough();
            spyOn(trainService, 'getCurrentTrains').and.returnValue($q.reject());
            controller.openTrainPanel();
            expect($scope.$digest).toThrow();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('stop-loading', {});
        });

    });

});