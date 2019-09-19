function transform(data) {
  console.log("IN TRANSFORM AIR QUALITY");
  var idString = data.title
    .toString()
    .replace(/[\\"'()]/g, "")
    .replace("&", "")
    .replace("/", "")
    .replace("+", "")
    .replace(".", "");
  var idArray = idString.split(" ");
  var id = idArray[idArray.length - 1];

  let transformed = {
    id: "urn:ngsiv2:AirQualityObserved:manchester:" + id,
    type: "AirQualityObserved",
    address: {
      value: {
        addressCountry: "UK",
        addressLocality: "Manchester",
        streetAddress: data.locname.toString().replace(/[\\"'()]/g, "")
      },
      type: "object"
    },
    name: {
      value: data.title.toString().replace(/[\\"'()]/g, ""),
      type: "Text"
    },
    location: {
      value: {
        coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
        type: "Point"
      },
      type: "geo:json"
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
        measurand = NO2;
        break;
      case '"Ozone in air"':
        measurand = "O3";
        break;
      case '"Nitrogen oxides in air"':
        measurand = "NO";
        break;
      default:
        measurand = "NotCurrentlySupported";
    }

    var timestamp = new Date(stream.current_time).toISOString();

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
  return transformed;
}

module.exports = transform;
