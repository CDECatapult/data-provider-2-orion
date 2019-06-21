const test = require("ava");
const nock = require("nock");
const main = require("./src/server");

test.afterEach.always(() => nock.cleanAll())


let output = [{"id":"urn:ngsiv2:OnStreetParking:manchester:Stockport","type":"OnStreetParking","address":{"type":"StructuredValue","value":{"value":{"addressCountry":"UK","addressLocality":"Manchester","streetAddress":"Stockport Exchange NCP Car Park"},"type":"object"},"metadata":{}},"allowedVehicleType":{"type":"StructuredValue","value":{"value":["car"],"type":"Text"},"metadata":{}},"availableSpotNumber":{"type":"StructuredValue","value":{"value":927,"type":"Number","metadata":{"timestamp":{"value":"2019-06-14T16:15:07.000Z","type":"DateTime"}}},"metadata":{}},"category":{"type":"StructuredValue","value":{"value":["public"],"type":"Text"},"metadata":{}},"chargeType":{"type":"StructuredValue","value":{"value":["free"],"type":"Text"},"metadata":{}},"location":{"type":"StructuredValue","value":{"value":{"coordinates":[-2.161386,53.40526],"type":"Point"},"type":"geo:json"},"metadata":{}},"name":{"type":"StructuredValue","value":{"value":"Manchester Parking Data - Stockport Exchange NCP Car Park","type":"Text"},"metadata":{}},"occupancyDetectionType":{"type":"StructuredValue","value":{"value":["none"],"type":"Text"},"metadata":{}},"permitActiveHours":{"type":"None","value":null,"metadata":{}},"requiredPermit":{"type":"StructuredValue","value":{"value":["noPermitNeeded"],"type":"Text"},"metadata":{}},"totalSpotNumber":{"type":"StructuredValue","value":{"value":1000,"type":"Number","metadata":{"type":"DateTime","value":"2019-06-14T16:15:07.000Z"}},"metadata":{}}},{"id":"urn:ngsiv2:OnStreetParking:manchester:Sale","type":"OnStreetParking","address":{"type":"StructuredValue","value":{"value":{"addressCountry":"UK","addressLocality":"Manchester","streetAddress":"Sale Water Park Metrolink Car Park"},"type":"object"},"metadata":{}},"allowedVehicleType":{"type":"StructuredValue","value":{"value":["car"],"type":"Text"},"metadata":{}},"availableSpotNumber":{"type":"StructuredValue","value":{"value":316,"type":"Number","metadata":{"timestamp":{"value":"2019-06-14T16:15:11.000Z","type":"DateTime"}}},"metadata":{}},"category":{"type":"StructuredValue","value":{"value":["public"],"type":"Text"},"metadata":{}},"chargeType":{"type":"StructuredValue","value":{"value":["free"],"type":"Text"},"metadata":{}},"location":{"type":"StructuredValue","value":{"value":{"coordinates":[-2.2913713,53.428795],"type":"Point"},"type":"geo:json"},"metadata":{}},"name":{"type":"StructuredValue","value":{"value":"Manchester Parking Data - Sale Water Park Metrolink Car Park","type":"Text"},"metadata":{}},"occupancyDetectionType":{"type":"StructuredValue","value":{"value":["none"],"type":"Text"},"metadata":{}},"permitActiveHours":{"type":"None","value":null,"metadata":{}},"requiredPermit":{"type":"StructuredValue","value":{"value":["noPermitNeeded"],"type":"Text"},"metadata":{}},"totalSpotNumber":{"type":"StructuredValue","value":{"value":316,"type":"Number","metadata":{"type":"DateTime","value":"2019-06-14T16:15:11.000Z"}},"metadata":{}}}]



test.cb('Get Parking data from BT and transform into correct format', t => {
    const bt = nock('http://api.rp.bt.com/sensors/feeds')
                .get("/b669e529-f894-49ee-b73a-9877cbd87067")
                .reply(200, output[0]);
    const intervalID = main();
    
    setTimeout(()=> {
        t.is(bt.isDone(), true);
        clearInterval(intervalID)}, 10);
    t.end();
})

//test('Get AirQuality data from BT and transform into correct format')

//test('Get Cycling share data from BT and transform into correct format')

//test('Get Noise data from Eindhoven and transform into correct format')

