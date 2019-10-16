function transform(data, city) {
  console.log("IN TRANSFORM AIR QUALITY");
  var idString = data.locname
    .toString()
    .replace(/[\\"'()]/g, "")
    .replace("&", "")
    .replace("/", "")
    .replace("+", "")
    .replace(".", "")
    .replace(";", "");
  var idArray = idString.split(" ");
  var id = idArray[idArray.length - 1];
  var timestamp = new Date(data.streams[0].current_time).toISOString();
  let transformed = {
    id: "urn:ngsiv2:AirQualityObserved:" + city + ":" + id,
    type: "AirQualityObserved",
    address: {
      addressCountry: "UK",
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
    name: data.title.toString().replace(/[\\"'()]/g, ""),
    dateObserved: timestamp,
    location: {
      coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
      type: "Point"
    }
  };
  for (let stream of data.streams) {
    var unitCode = "";
    if (stream.unit_symbol == "μg/m3") {
      unitCode = "GQ";
    } else if (stream.unit_symbol == "ppb") {
      unitCode = "61";
    }
    var value = stream.current_value;
    var measurand = "";
    switch (stream.tags[0]) {
      case '"Nitrogen monoxide in air"':
        measurand = "NO";
        break;
      case '"Sulphur dioxide in air"':
        measurand = "SO2";
        break;
      case '"Nitrogen dioxide in air"':
        measurand = "NO2";
        break;
      case '"Ozone in air"':
        measurand = "O3";
        break;
      case '"Nitrogen oxides in air"':
        measurand = "NOXasNO2";
        break;
      case '"Particulate matter under 2.5 micro m (aerosol)"':
        measurand = "PM25";
        break;
      default:
        measurand = "NotCurrentlySupported";
    }

    if (measurand != "NotCurrentlySupported") {
      transformed[measurand] = parseFloat(value);
    }
  }
  return transformed;
}

module.exports = transform;
