function transform(data) {
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

  let transformed = {
    id: "urn:ngsiv2:AirQualityObserved:manchester:" + id,
    type: "AirQualityObserved",
    address: {
      value: {
        addressCountry: "UK",
        addressLocality: "Manchester",
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
      type: "object"
    },
    name: {
      value: data.title.toString().replace(/[\\"'()]/g, ""),
      type: "Text"
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

    var timestamp = new Date(stream.current_time).toISOString();
    if (measurand != "NotCurrentlySupported") {
      transformed[measurand] = {
        value: value,
        metadata: {
          unitCode: {
            value: unitCode
          },
          timestamp: {
            value: timestamp,
            type: "DateTime"
          }
        }
      };
    }
  }
  return transformed;
}

module.exports = transform;
