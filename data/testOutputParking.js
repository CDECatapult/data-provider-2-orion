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

module.exports = output;
