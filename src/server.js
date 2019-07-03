const got = require("got");
const transform = require("./transformParking");

async function publishToBroker(data, dataBroker) {
  json_data = { actionType: "APPEND", entities: [data] };
  try {
    resp = (await dataBroker.post("/v2/op/update?options=keyValues", {
      body: json_data
    })).body;
    return resp, json_data;
  } catch (err) {
    console.log(`ERROR IN publishToBroker ${err}`);
  }
}

async function getDataFromProvider(feedID, dataProvider) {
  try {
    return (await dataProvider.get("/" + feedID)).body;
  } catch (err) {
    console.error(err);
  }
}

async function getAndPublishAll(dataProvider, dataBroker, dataSources) {
  for (let dataSource of dataSources) {
    let resp = await getAndPublishOne(dataSource, dataBroker, dataProvider);
  }
  return "Got data from all feeds";
}

async function getAndPublishOne(feedID, dataBroker, dataProvider) {
  //In milliseconds
  try {
    const data = await getDataFromProvider(feedID, dataProvider);
    const transformedData = transform(data);
    return publishToBroker(transformedData, dataBroker);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getAndPublishAll,
  getAndPublishOne
};
