function transform(data, city) {
  var idString = data.locname
    .toString()
    .replace(/[\\"'()]/g, "")
    .replace("&", "")
    .replace("/", "")
    .replace("+", "")
    .replace(".", "")
    .replace(";", "")
    .replace("&apos;s", "");
  var idArray = idString.split(" ");
  var id = idArray.join("");
  var streetAddress = data.locname
    .toString()
    .replace(/[\\"'()]/g, "")
    .replace("&", "")
    .replace("/", "")
    .replace("+", "")
    .replace(".", "")
    .replace(";", "")
    .replace("&apos;s", "");
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
    id: `urn:ngsiv2:${type}:${city}:${id}`,
    type: type,
    status: status,
    address: {
      addressCountry: "UK",
      addressLocality: city,
      streetAddress: streetAddress
    },
    name: data.title.toString().replace(/[\\"'()]/g, ""),
    dateObserved: timestampABN,
    availableBikeNumber: availableBikeNumber,

    freeSlotNumber: freeSlotNumber,

    totalSlotNumber: totalSlotNumber,

    location: {
      coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
      type: "Point"
    }
  };
  return transformed;
}

module.exports = transform;
