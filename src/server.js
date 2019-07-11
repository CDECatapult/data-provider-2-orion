const got = require("got");

async function publishToBroker(data, dataBroker, fiwareService = null) {
  json_data = { actionType: "APPEND", entities: [data] };
  headers = {};
  if (fiwareService != null) {
    headers["Fiware-Service"] = fiwareService;
    headers["Fiware-Path"] = "/";
  }
  try {
    resp = (await dataBroker.post("/v2/op/update?options=keyValues", {
      body: json_data,
      headers: headers
    })).body;
    return json_data;
  } catch (err) {
    console.log(`ERROR IN publishToBroker${err}`);
  }
}

async function getDataFromProvider(feedID, dataProvider) {
  try {
    return (await dataProvider.get("/" + feedID)).body;
  } catch (err) {
    console.error(err);
  }
}

async function getAndPublishAll(
  dataProvider,
  dataBroker,
  dataFeedTransformMap
) {
  for (let dataSource of dataFeedTransformMap) {
    dataFeedID = dataSource.id;
    transform = dataSource.transform;
    fiwareService = dataSource.fiwareService;

    let resp = await getAndPublishOne(
      dataFeedID,
      dataBroker,
      dataProvider,
      transform,
      fiwareService
    );
  }
  return "Got data from all feeds";
}

async function getAndPublishOne(
  feedID,
  dataBroker,
  dataProvider,
  transform,
  fiwareService = null
) {
  //In milliseconds
  try {
    const data = await getDataFromProvider(feedID, dataProvider);
    const transformedData = transform(data);
    return publishToBroker(transformedData, dataBroker, fiwareService);
  } catch (err) {
    console.error(err);
  }
}

module.exports = getAndPublishAll;
