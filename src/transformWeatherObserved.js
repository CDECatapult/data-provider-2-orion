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
  var id = idArray[0];

  let transformed = {
    id: "urn:ngsiv2:WeatherObserved:" + city + ":" + id,
    type: "WeatherObserved",
    address: {
      addressCountry: "UK",
      addressLocality: city,
      streetAddress: data.locname
        .toString()
        .replace(/[\\"'()]/g, "")
        .replace("&", "")
        .replace("/", "")
        .replace("+", "")
        .replace(".", "")
        .replace(";", "")
    },
    name: data.title.toString().replace(/[\\"'()]/g, ""),
    dateObserved: new Date(data.streams[0].current_time).toISOString(),
    location: {
      coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
      type: "Point"
    }
  };
  for (let stream of data.streams) {
    var value = stream.current_value;
    var attribute = "";
    if (stream.tags.length == 0) {
      continue;
    }
    switch (stream.tags[0]) {
      case "visibility":
        // Classification of visibility taken from https://www.timeanddate.com/weather/glossary.html
        try {
          visibilityInMetres = parseInt(stream.current_value);
        } catch (e) {
          break;
        }
        visibilityClassification = "";
        if (visibilityInMetres < 1000) {
          visibilityClassification = "veryPoor";
        } else if (visibilityInMetres < 5000) {
          visibilityClassification = "poor";
        } else if (visibilityInMetres < 10000) {
          visibilityClassification = "moderate";
        } else {
          visibilityClassification = "good";
        }
        value = visibilityClassification;
        attribute = "visibility";
        break;
      case "pressure":
        if (stream.tags.length > 1 && stream.tags[1] == "tendency") {
          attribute = "pressureTendency";
          if (stream.current_value == "S") {
            value = "steady";
          } else if (stream.current_value == "F") {
            value = "falling";
          } else if (stream.current_value == "R") {
            value = "rising";
          }
        } else {
          value = parseFloat(stream.current_value);
          attribute = "atmosphericPressure";
        }
        measurand = "SO2";
        break;
      case "dewpoint":
        attribute = "dewPoint";
        value = parseFloat(stream.current_value);
        break;
      case "humidity":
        attribute = "humidity";
        value = parseFloat(stream.current_value);
        break;
      case "wind":
        if (stream.tags.length < 3 && stream.tags[1] == "speed") {
          attribute = "windSpeed";
          value = parseFloat(stream.current_value);
        } else if (stream.tags.length < 3 && stream.tags[1] == "direction") {
          attribute = "windDirection";
          windCompassMap = {
            N: 0,
            NNE: 22.5,
            NE: 45,
            ENE: 67.5,
            E: 90,
            ESE: 112.5,
            SE: 135,
            SSE: 157.5,
            S: 180,
            SSW: 202.5,
            SW: 225,
            WSW: 247.5,
            W: 270,
            WNW: 292.5,
            NW: 315,
            NNW: 337.5
          };
          value = windCompassMap[stream.current_value];
        }
        break;
      case "temperature":
        attribute = "temperature";
        value = parseFloat(stream.current_value);
        break;
      default:
        attribute = "NotCurrentlySupported";
    }

    if (attribute != "NotCurrentlySupported" && attribute != "") {
      transformed[attribute] = value;
    }
  }
  return transformed;
}

module.exports = transform;
