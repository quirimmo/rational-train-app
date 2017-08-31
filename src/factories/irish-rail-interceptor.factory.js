(function() {
    'use strict';

    angular.module('myApp')
        .factory('IrishRailInterceptorFactory', IrishRailInterceptorFactory)
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('IrishRailInterceptorFactory');
        });

    IrishRailInterceptorFactory.$inject = ['xmlJSONParserService', 'HTTP_CONSTANTS'];

    function IrishRailInterceptorFactory(xmlJSONParserService, HTTP_CONSTANTS) {

        let factory = {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };
        return factory;

        // ============================================================


        function request(config) {
            if (config.url.includes('irishrail')) {
                // config.method = 'GET';
                // config.headers['Content-Type'] = 'application/xml';
                // config.headers['Accept'] = 'application/xml';
                // config.url = config.url.replace('irishrail', 'http://localhost:9000/http://api.irishrail.ie/realtime/realtime.asmx');
                config.method = HTTP_CONSTANTS.DEFAULT_METHOD;
                config.headers['Content-Type'] = HTTP_CONSTANTS.DEFAULT_RESPONSE_CONTENT;
                config.headers['Accept'] = HTTP_CONSTANTS.DEFAULT_RESPONSE_CONTENT;
                config.url = config.url.replace(HTTP_CONSTANTS.API_URL_HOOK, HTTP_CONSTANTS.SERVICE_BASE_URL);
            }
            return config;
        }

        function requestError(config) {
            return config;
        }

        function response(res) {
            if (res.config.headers.Accept !== HTTP_CONSTANTS.DEFAULT_RESPONSE_CONTENT) {
                return res;
            }
            return xmlJSONParserService.parseXmlToJson(res.data);
        }

        function responseError(res) {
            return res;
        }

    }
})();