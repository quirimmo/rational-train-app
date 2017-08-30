describe('Base Protractor Tests', function() {

    beforeAll(function() {
        browser.get('/');
    });

    it('should pass', function() {
        expect(2).toEqual(2);
    });

});