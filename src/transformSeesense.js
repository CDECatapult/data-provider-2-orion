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
  var country = city == "antwerp" ? "Belgium" : "UK";
  let transformed = {
    id: "urn:ngsiv2:TrafficFlowObserved:" + city + ":" + id,
    type: "TrafficFlowObserved",
    address: {
      addressCountry: country,
      addressLocality: city,
      streetAddress: data.locname
        .toString()
        .replace(/[\\"'()]/g, "")
        .replace(/[\\"'()]/g, "")
        .replace("&", "")
        .replace("/", "")
        .replace("+", "")
        .replace(".", "")
        .replace(";", "")
    },
    dateObserved: new Date(data.streams[0].current_time).toISOString(),
    laneId: 1,
    name: data.title.toString().replace(/[\\"'()]/g, ""),
    vehicleType: "bicycle",
    type: "TrafficFlowObserved",
    location: {
      coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
      type: "Point"
    }
  };
  for (let stream of data.streams) {
    var value = stream.current_value ? parseFloat(stream.current_value) : 0;
    var attribute = "";
    switch (stream.tags[0]) {
      case "speed":
        attribute = "averageVehicleSpeed";
        break;
      case '"cycle count"':
        attribute = "intensity";
        break;
      default:
        attribute = "NotCurrentlySupported";
    }

    var timestamp = new Date(stream.current_time).toISOString();
    if (attribute != "NotCurrentlySupported") {
      transformed[attribute] = parseFloat(value);
    }
  }
  return transformed;
}

module.exports = transform;
