(function() {
    'use strict';

    angular.module('myApp').service('xmlJSONParserService', xmlJSONParserService);

    xmlJSONParserService.$inject = ['$window'];

    function xmlJSONParserService($window) {
        this.x2js = new X2JS();
        this.parseXmlToJson = parseXmlToJson;

        // ============================================================

        function parseXmlToJson(xml) {
            return this.x2js.xml_str2json(xml);
        }

    }
})();