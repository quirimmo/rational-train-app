describe('IrishRailInterceptorFactory', function() {

    let xmlJSONParserService, HTTP_CONSTANTS, IrishRailInterceptorFactory;

    beforeEach(function() {
        module('myApp');
        module('templates');

        module(function($provide) {
            $provide.value('xmlJSONParserService', {
                parseXmlToJson: function() {}
            });
        });


        inject(function(_HTTP_CONSTANTS_, _xmlJSONParserService_, _IrishRailInterceptorFactory_) {
            HTTP_CONSTANTS = _HTTP_CONSTANTS_;
            xmlJSONParserService = _xmlJSONParserService_;
            IrishRailInterceptorFactory = _IrishRailInterceptorFactory_;
        });

    });


    describe('init', function() {

        it('should be defined', function() {
            expect(IrishRailInterceptorFactory).toBeDefined();
        });

        it('should expose the four methods', function() {
            expect(IrishRailInterceptorFactory.request).toEqual(jasmine.any(Function));
            expect(IrishRailInterceptorFactory.requestError).toEqual(jasmine.any(Function));
            expect(IrishRailInterceptorFactory.response).toEqual(jasmine.any(Function));
            expect(IrishRailInterceptorFactory.responseError).toEqual(jasmine.any(Function));
        });

    });

    describe('request', function() {

        it('should return the unchanged requestOptions if the URL doesn\`t contain the irishrail hook', function() {
            let requestOptions = {
                url: 'blablabla',
                headers: {}
            };
            expect(IrishRailInterceptorFactory.request(requestOptions)).toEqual(requestOptions);
        });

        it('should change the requestOptions if the URL contains the irishrail hook', function() {
            let requestOptions = {
                url: HTTP_CONSTANTS.API_URL_HOOK,
                headers: {}
            };
            expect(IrishRailInterceptorFactory.request(requestOptions)).toEqual({
                url: HTTP_CONSTANTS.SERVICE_BASE_URL,
                method: HTTP_CONSTANTS.DEFAULT_METHOD,
                headers: {
                    'Content-Type': HTTP_CONSTANTS.DEFAULT_RESPONSE_CONTENT,
                    'Accept': HTTP_CONSTANTS.DEFAULT_RESPONSE_CONTENT,
                }
            });
        });

    });

    describe('response', function() {

        it('should return the unchanged response if the content is not xml', function() {
            let response = {
                config: {
                    headers: {
                        Accept: 'blablabla'
                    }
                }
            };
            expect(IrishRailInterceptorFactory.response(response)).toEqual(response);
        });

        it('should call the parseXmlToJson if the content is xml', function() {
            spyOn(xmlJSONParserService, 'parseXmlToJson').and.callThrough();
            let response = {
                data: '<xml><sample>Test</sample></xml>',
                config: {
                    headers: {
                        Accept: HTTP_CONSTANTS.DEFAULT_RESPONSE_CONTENT
                    }
                }
            };
            IrishRailInterceptorFactory.response(response);
            expect(xmlJSONParserService.parseXmlToJson).toHaveBeenCalledWith(response.data);
        });

    });


});