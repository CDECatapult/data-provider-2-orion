const got = require("got");
const transform = require("./transformParking");

async function publishToBroker(data, dataBroker) {
  json_data = { actionType: "APPEND", entities: [data] };
  try {
    return (await dataBroker.post("/v2/op/update?options=keyValues", json_data))
      .body;
  } catch (err) {
    console.log(dataBroker.url);
    console.log(err);
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
