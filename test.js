const test = require("ava");
const nock = require("nock");
const getAndPublishOne = require("./src/server");

test.afterEach.always(() => nock.cleanAll());

let input = {
  id: "b669e529-f894-49ee-b73a-9877cbd87067",
  creator: "dukeak",
  updated: "Wed, 01 May 2019 16:16:38 GMT",
  title: "Manchester Parking Data - Stockport Exchange (Surface)",
  url: "/feeds/b669e529-f894-49ee-b73a-9877cbd87067",
  private: "false",
  description:
    "Manchester Parking Data for the CityVerve project. Details for parking location: Stockport Exchange (Surface). Contains Transport for Greater Manchester data. Contains OS data ? Crown copyright and database right 2016.",
  tags: ["CityVerve", "Manchester", "car", "vehicle"],
  locname: "Stockport Exchange (Surface)",
  lon: -2.161386,
  lat: 53.40526,
  ele: 0.0,
  streams: [
    {
      id: 0,
      tags: ['"parking bays"'],
      current_time: "Fri, 14 Jun 2019 16:15:11 GMT",
      current_value: "927",
      unit_text: "Number of free bays"
    },
    {
      id: 1,
      tags: ['"parking bays"'],
      current_time: "Fri, 14 Jun 2019 16:15:11 GMT",
      current_value: "1000",
      unit_text: "Total number of bays"
    },
    {
      id: 2,
      tags: ["parking"],
      current_time: "Fri, 14 Jun 2019 16:15:11 GMT",
      current_value: "Closed",
      unit_text: "Status"
    }
  ]
};

let output = {
  id: "urn:ngsiv2:OnStreetParking:manchester:Stockport",
  type: "OnStreetParking",
  address: {
    value: {
      addressCountry: "UK",
      addressLocality: "Manchester",
      streetAddress: "Stockport Exchange Surface"
    },
    type: "object"
  },
  location: {
    value: { coordinates: [-2.161386, 53.40526], type: "Point" },
    type: "geo:json"
  },
  allowedVehicleType: {
    value: ["car"],
    type: "Text"
  },
  availableSpotNumber: {
    value: 927,
    type: "Number",
    metadata: {
      timestamp: { value: new Date("2019-06-14T17:15:11"), type: "DateTime" }
    }
  },
  category: {
    value: ["public"],
    type: "Text"
  },
  chargeType: {
    value: ["free"],
    type: "Text"
  },
  name: {
    value: "Manchester Parking Data - Stockport Exchange Surface",
    type: "Text"
  },
  occupancyDetectionType: {
    value: ["none"],
    type: "Text"
  },
  permitActiveHours: null,
  requiredPermit: {
    value: ["noPermitNeeded"],
    type: "Text"
  },
  totalSpotNumber: {
    value: 1000,
    type: "Number",
    metadata: {
      timestamp: { type: "DateTime", value: new Date("2019-06-14T17:15:11") }
    }
  }
};

test("Get Parking data from BT and transform into correct format", async t => {
  const bt = nock("http://api.rp.bt.com/sensors/feeds")
    .get("/b669e529-f894-49ee-b73a-9877cbd87067")
    .reply(200, input);
  let d = await getAndPublishOne("b669e529-f894-49ee-b73a-9877cbd87067");
  t.is(bt.isDone(), true);
  t.deepEqual(d, output);
});

//test('Get AirQuality data from BT and transform into correct format')

//test('Get Cycling share data from BT and transform into correct format')

//test('Get Noise data from Eindhoven and transform into correct format')
