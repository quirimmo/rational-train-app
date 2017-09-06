describe('trainInfoContainer', function() {

    let $compile, $scope, compiledElement, isolatedScope;
    
    beforeEach(function() {
        module('myApp');
        
        inject(function(_$compile_, _$rootScope_, _$templateCache_) {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();
            _$templateCache_.put('src/directives/train-info-container/train-info-container.html', '<div>hello world</div>');
        });
        
        let element = angular.element('<div train-info-container flex-value="10" label-title="my title" label-value="my value"></div>');
        compiledElement = $compile(element)($scope);
        $scope.$apply();
        isolatedScope = compiledElement.isolateScope();

    });

    describe('init', function() {

        it('should init the labelTitle parameter', function() {
            expect(isolatedScope.labelTitle).toEqual('my title');
        });

        it('should init the labelValue parameter', function() {
            expect(isolatedScope.labelValue).toEqual('my value');
        });

        it('should init the flexValue parameter', function() {
            expect(isolatedScope.flexValue).toEqual('10');
        });

    });
    

});

