describe('distanceService', function() {

    let distanceService, $window;

    let mockedGoogle = {
        maps: {
            LatLng: function() {},
            DistanceMatrixService: function() {
                this.getDistanceMatrix = function() {};
            }
        }
    };

    beforeEach(function() {
        module('myApp');

        module(function($provide) {});


        inject(function(_distanceService_, _$window_) {
            distanceService = _distanceService_;
            $window = _$window_;
            $window.google = mockedGoogle;
        });

    });


    describe('init', function() {

        it('should be defined', function() {
            expect(distanceService).toBeDefined();
        });

        it('should define the exposed methods', function() {
            expect(distanceService.calculateDistance).toEqual(jasmine.any(Function));
            expect(distanceService.calculateTimeDuration).toEqual(jasmine.any(Function));
        });

    });

    describe('calculateDistance', function() {

        it('should call two times the LatLng method', function() {
            spyOn($window.google.maps, 'LatLng');
            distanceService.calculateDistance(10, 10, 20, 20);
            expect($window.google.maps.LatLng.calls.count()).toBe(2);
        });

        it('should call the LatLng method the first time with the expected parameters', function() {
            spyOn($window.google.maps, 'LatLng');
            distanceService.calculateDistance(10, 10, 20, 20);
            expect($window.google.maps.LatLng.calls.argsFor(0)).toEqual([10, 10]);
        });

        it('should call the LatLng method the second time with the expected parameters', function() {
            spyOn($window.google.maps, 'LatLng');
            distanceService.calculateDistance(10, 10, 20, 20);
            expect($window.google.maps.LatLng.calls.argsFor(1)).toEqual([20, 20]);
        });

        it('should call the DistanceMatrixService', function() {
            spyOn($window.google.maps, 'DistanceMatrixService').and.callThrough();
            distanceService.calculateDistance(10, 10, 20, 20);
            expect($window.google.maps.DistanceMatrixService).toHaveBeenCalled();
        });

        it('should call the getDistanceMatrix', function() {
            spyOn($window.google.maps, 'LatLng').and.returnValue();
            spyOn($window.google.maps, 'DistanceMatrixService').and.returnValue({
                getDistanceMatrix: function() {}
            });
            spyOn($window.google.maps.DistanceMatrixService(), 'getDistanceMatrix').and.callThrough();
            distanceService.calculateDistance(10, 10, 20, 20);
            expect($window.google.maps.DistanceMatrixService().getDistanceMatrix).toHaveBeenCalled();
        });

    });

    describe('calculateTimeDuration', function() {

        it('should return an object', function() {
            let returned = distanceService.calculateTimeDuration(2000, '20:00');
            expect(returned).toEqual(jasmine.any(Object));
        });

        it('should return the right values', function() {
            let returned = distanceService.calculateTimeDuration(20, '20:00');
            let originDate = new Date();
            originDate.setMinutes(originDate.getMinutes() + 20);
            let currentDate = new Date();
            currentDate.setHours(20);
            currentDate.setMinutes(00);
            expect(returned).toEqual({
                arrivingTimeDate: originDate, 
                originTimeDate:  currentDate
            });
        });

    });

});