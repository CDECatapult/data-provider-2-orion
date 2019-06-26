function transform(data) {
  console.log("IN TRANSFORM");
  console.log(data);
  var idString = data.locname.toString().replace(/[\\"'()]/g, "");
  var idArray = idString.split(" ");
  var id = idArray[0];

  transformed = {
    id: "urn:ngsiv2:OnStreetParking:manchester:" + id,
    type: "OnStreetParking",
    address: {
      value: {
        addressCountry: "UK",
        addressLocality: "Manchester",
        streetAddress: data.locname.toString().replace(/[\\"'()]/g, "")
      },
      type: "object"
    },
    location: {
      value: {
        coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
        type: "Point"
      },
      type: "geo:json"
    },
    name: {
      value: data.title.toString().replace(/[\\"'()]/g, ""),
      type: "Text"
    },
    category: {
      value: ["public"],
      type: "Text"
    },
    allowedVehicleType: {
      value: ["car"],
      type: "Text"
    },
    requiredPermit: {
      value: ["noPermitNeeded"],
      type: "Text"
    },
    permitActiveHours: null,
    chargeType: {
      value: ["free"],
      type: "Text"
    },
    occupancyDetectionType: {
      value: ["none"],
      type: "Text"
    },
    availableSpotNumber: {
      value: parseInt(data.streams[0].current_value),
      type: "Number",
      metadata: {
        timestamp: {
          value: new Date(data.streams[0].current_time),
          type: "DateTime"
        }
      }
    },
    totalSpotNumber: {
      value: parseInt(data.streams[1].current_value),
      type: "Number",
      metadata: {
        timestamp: {
          type: "DateTime",
          value: new Date(data.streams[1].current_time)
        }
      }
    }
  };
  return transformed;
}

module.exports = transform;
