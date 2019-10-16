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

function transform(data, city) {
  var idString = data.locname
    .toString()
    .replace(/[\\"'()]/g, "")
    .replace("&", "")
    .replace("/", "")
    .replace("+", "")
    .replace(".", "")
    .replace(";", "");
  var idArray = idString.split(" ");
  var id = idArray.join("");
  var streetAddress = data.locname
    .toString()
    .replace(/[\\"'()]/g, "")
    .replace("&", "")
    .replace("/", "")
    .replace("+", "")
    .replace(".", "")
    .replace(";", "");
  var type = getType(streetAddress);

  let transformed = {
    id: `urn:ngsiv2:${type}:${city}:${id}`,
    type: type,
    address: {
      value: {
        addressCountry: "UK",
        addressLocality: city,
        streetAddress: streetAddress
      },
      type: "object"
    },
    name: data.title.toString().replace(/[\\"'()]/g, ""),

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
    },
    location: {
      value: {
        coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
        type: "Point"
      }
    }
  };
  if (type == "OnStreetParking") {
    transformed.permitActiveHours = {};
  }
  return transformed;
}

module.exports = transform;
