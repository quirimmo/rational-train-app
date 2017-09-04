describe('ajaxLoader', function() {

    let controller, $rootScope;

    beforeEach(module('myApp'));
    beforeEach(inject(function(_$componentController_, _$rootScope_) {
        let $componentController = _$componentController_;
        $rootScope = _$rootScope_;
        controller = $componentController('ajaxLoader', null, {});
        controller.$onInit();
    }));

    describe('init', function() {

        it('should init the isLoading to false', function() {
            expect(controller.isLoading).toEqual(false);
        });

        it('should init the loadingMessage to Loading...', function() {
            expect(controller.loadingMessage).toEqual('Loading...');
        });

    });

    describe('startLoading', function() {

        it('should set isLoading to true', function() {
            $rootScope.$broadcast('start-loading', {});
            expect(controller.isLoading).toEqual(true);
        });

        it('should set loadingMessage to the provided value', function() {
            $rootScope.$broadcast('start-loading', {
                loadingMessage: 'Test loading message'
            });
            expect(controller.loadingMessage).toEqual('Test loading message');
        });

    });

});