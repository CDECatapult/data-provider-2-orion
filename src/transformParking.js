function getType(location) {
  var offStreet = [
    "ASDA",
    "Sainburys",
    "Sainsbury",
    "Marks & Spencer",
    "Tesco",
    "Car Park",
    "Grand Arcade",
    "Matalan",
    "Centre",
    "Arndale",
    "GMEX",
    "Arena"
  ];
  for (let os of offStreet) {
    if (location.indexOf(os) > 0) {
      return "OffStreetParking";
    }
  }
  return "OnStreetParking";
}

function transform(data) {
  var idString = data.locname.toString().replace(/[\\"'()]/g, "");
  var idArray = idString.split(" ");
  var id = idArray[0];
  var streetAddress = data.locname.toString().replace(/[\\"'()]/g, "");
  var type = getType(streetAddress);

  let transformed = {
    id: `urn:ngsiv2:${type}:manchester:${id}`,
    type: type,
    address: {
      value: {
        addressCountry: "UK",
        addressLocality: "Manchester",
        streetAddress: streetAddress
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
    permitActiveHours: {
      value: ["noPermitNeeded"],
      type: "None"
    },
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
          value: new Date(data.streams[0].current_time).toISOString(),
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
          value: new Date(data.streams[1].current_time).toISOString()
        }
      }
    }
  };
  return transformed;
}

module.exports = transform;
