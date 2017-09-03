(function() {
    'use strict';
    // create a custom interceptor in order to manage globally all the requests started to irishrail web service
    // used for setting and executing default operations
    // In this way we manage and execute all the common operations on the requests performed against irishrail
    // Adding needed headers
    // Replace the hook with the right url 
    // Add the mirror service used for bypassing CORS requests

    angular.module('myApp').factory('IrishRailInterceptorFactory', IrishRailInterceptorFactory)
        .config(function($httpProvider) {
            // register the new interceptor in AngularJS
            $httpProvider.interceptors.push('IrishRailInterceptorFactory');
        });

    IrishRailInterceptorFactory.$inject = ['xmlJSONParserService', 'HTTP_CONSTANTS'];

    function IrishRailInterceptorFactory(xmlJSONParserService, HTTP_CONSTANTS) {

        // methods exposed by the service
        let factory = {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };
        return factory;

        // ============================================================


        function request(config) {
            if (config.url.includes(HTTP_CONSTANTS.API_URL_HOOK)) {
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