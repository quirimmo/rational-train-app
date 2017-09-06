describe('xmlJSONParserService', function() {

    let xmlJSONParserService;

    let sampleXML = `
        <persons>
            <person>
                <name>Quirino</name>
            </person>
            <person>
                <name>Tony</name>
            </person>
        </persons>
    `;
    let jsonObjectOfXml = {
        persons: {
            person: [
                {
                    name: 'Quirino'
                },
                {
                    name: 'Tony'
                }
            ]
        }
    };

    beforeEach(function() {
        module('myApp');
        module(function($provide) {});


        inject(function(_xmlJSONParserService_) {
            xmlJSONParserService = _xmlJSONParserService_;
        });

    });

    describe('init', function() {

        it('should be defined', function() {
            expect(xmlJSONParserService).toBeDefined();
        });

        it('should define the exposed methods', function() {
            expect(xmlJSONParserService.parseXmlToJson).toEqual(jasmine.any(Function));
        });

        it('should define the exposed variable', function() {
            expect(xmlJSONParserService.x2js).toEqual(jasmine.any(Object));
        });

    });

    describe('parseXmlToJson', function() {

        it('should return an object', function() {
            expect(xmlJSONParserService.parseXmlToJson()).toEqual(jasmine.any(Object));
        });

        it('should correctly parse the xml', function() {
            expect(xmlJSONParserService.parseXmlToJson(sampleXML)).toEqual(jsonObjectOfXml);
        });

        it('should return null if no xml provided', function() {
            expect(xmlJSONParserService.parseXmlToJson('')).toBeNull();
        });

    });

});