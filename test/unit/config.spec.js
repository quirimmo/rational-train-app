describe('MainController', function() {

    let $state, $rootScope, trainService, NavigatorGeolocation, $q, $injector, $timeout;

    beforeEach(function() {
        module('myApp');

        module(function($provide) {
            $provide.value('NavigatorGeolocation', {
                getCurrentPosition: function() {
                    return $q.resolve({
                        coords: {
                            latitude: 1,
                            longitude: 1
                        }
                    });
                }
            });
            $provide.value('trainService', {
                getAllStations: function() {
                    return $q.resolve({
                        ArrayOfObjStation: {
                            objStation: {}
                        }
                    });
                },
                orderStationsByDistance: function() {
                    return $q.resolve('a');
                }
            });
        });

        inject(function(_$state_, _$rootScope_, _NavigatorGeolocation_, _$q_, _$templateCache_, _trainService_, _$injector_, _$timeout_) {
            $state = _$state_;
            $rootScope = _$rootScope_;
            NavigatorGeolocation = _NavigatorGeolocation_;
            $q = _$q_;
            trainService = _trainService_;
            $injector = _$injector_;
            $timeout = _$timeout_;
            _$templateCache_.put('src/templates/main.html', '');
        });

    });

    describe('mainState', function() {

        it('should load the main URL', function() {
            expect($state.href('main')).toEqual('#!/main');
        });

        it('should go the main state', function() {
            $state.go('main');
            $rootScope.$digest();
            expect($state.current.name).toEqual('main');
        });

        it('should return the main URL as default if wrong url has been provided', function() {
            $state.go('nomatchedurl');
            $rootScope.$digest();
            expect($state.current.name).toEqual('main');
        });

        it('should return a promise in the resolve block', function() {
            $state.go('main');
            $rootScope.$digest();
            expect($injector.invoke($state.current.resolve.allStations)).toEqual($q.defer().promise);
        });

        it('should call the start loading and the stop loading', function() {
            spyOn($rootScope, '$broadcast').and.callThrough();
            $state.go('main');
            $rootScope.$digest();
            $timeout.flush();
            expect($rootScope.$broadcast).toHaveBeenCalledWith('start-loading', {
                loadingMessage: 'Retrieving your current position and ordering all the stations depending on your current distance'
            });
            expect($rootScope.$broadcast).toHaveBeenCalledWith('stop-loading', {});
        });

    });

});