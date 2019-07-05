function transform(data) {
  var idString = data.locname.toString().replace(/[\\"'()]/g, "");
  var idArray = idString.split(" ");
  var id = idArray.join("");
  var streetAddress = data.locname.toString().replace(/[\\"'()]/g, "");
  var type = "BikeHireDockingStation";

  for (let stream of data.streams) {
    switch (stream.id) {
      case 3:
        var totalSlotNumber = parseInt(stream.current_value);
        var timestampTSN = new Date(stream.current_time).toISOString();
        break;
      case 4:
        var freeSlotNumber = parseInt(stream.current_value);
        var timestampFSN = new Date(stream.current_time).toISOString();
        break;
      case 5:
        var availableBikeNumber = parseInt(stream.current_value);
        var timestampABN = new Date(stream.current_time).toISOString();
        break;
      case 6:
        var status = stream.current_value;
        break;
      default:
        //Nothing to do here
        break;
    }
  }
  let transformed = {
    id: `urn:ngsiv2:${type}:dublin:${id}`,
    type: type,
    status: {
      value: status
    },
    availableBikeNumber: {
      value: availableBikeNumber,
      metadata: {
        timestamp: {
          type: "DateTime",
          value: timestampABN
        }
      }
    },
    freeSlotNumber: {
      value: freeSlotNumber,
      metadata: {
        timestamp: {
          type: "DateTime",
          value: timestampFSN
        }
      }
    },
    totalSlotNumber: {
      value: totalSlotNumber,
      metadata: {
        timestamp: {
          type: "DateTime",
          value: timestampTSN
        }
      }
    },
    location: {
      value: {
        coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
        type: "Point"
      },
      type: "geo:json"
    }
  };
  return transformed;
}

module.exports = transform;
