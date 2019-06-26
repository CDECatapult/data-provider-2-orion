const got = require("got");
const transform = require("./transform");

function publishToBroker(body) {
  //console.log(body);
  return body;
}

async function getDataFromProvider(feedID, dataProvider) {
  try {
    return (await dataProvider.get("/" + feedID)).body;
  } catch (err) {
    console.error(err);
  }
}

async function getAndPublishAll(dataProvider, dataSources) {
  for (let dataSource of dataSources) {
    let resp = await getAndPublishOne(dataSource, dataProvider);
  }
  return "Got data from all feeds";
}

async function getAndPublishOne(feedID, dataProvider) {
  //In milliseconds
  //console.log("Getting data for " + feedID);
  try {
    const data = await getDataFromProvider(feedID, dataProvider);
    const transformedData = transform(data);
    return publishToBroker(transformedData);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getAndPublishAll: getAndPublishAll,
  getAndPublishOne: getAndPublishOne
};
