(function() {
    'use strict';

    angular.module('myApp').service('xmlJSONParserService', xmlJSONParserService);

    xmlJSONParserService.$inject = [];

    function xmlJSONParserService() {
        // using the xml2json.js library for easily parsing the XML and get back the JSON object
        this.x2js = new X2JS();
        this.parseXmlToJson = parseXmlToJson;

        // ============================================================

        function parseXmlToJson(xml) {
            return this.x2js.xml_str2json(xml);
        }

    }
})();