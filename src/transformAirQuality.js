function transform(data) {
  console.log("IN TRANSFORM AIR QUALITY");
  var idString = data.title.toString().replace(/[\\"'()]/g, "");
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
    var measurand = stream.tags[0];
    if (measurand == "period" || measurand == "quality") {
      continue;
    }
    var value = stream.current_value;
    var unitCode = "";
    if (stream.unit_symbol == "μg/m3") {
      unitCode = "GQ";
    } else if (stream.unit_symbol == "ppb") {
      unitCode = "61";
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
