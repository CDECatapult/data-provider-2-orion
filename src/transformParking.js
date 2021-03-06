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
      addressCountry: "UK",
      addressLocality: city,
      streetAddress: streetAddress
    },
    name: data.title.toString().replace(/[\\"'()]/g, ""),
    dateObserved: new Date(data.streams[0].current_time).toISOString(),
    category: ["public"],

    allowedVehicleType: ["car"],

    requiredPermit: ["noPermitNeeded"],

    chargeType: ["free"],

    occupancyDetectionType: ["none"],

    availableSpotNumber: parseInt(data.streams[0].current_value),

    totalSpotNumber: parseInt(data.streams[1].current_value),

    location: {
      coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
      type: "Point"
    }
  };
  if (type == "OnStreetParking") {
    transformed.permitActiveHours = {};
  }
  return transformed;
}

module.exports = transform;
