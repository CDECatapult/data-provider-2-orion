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

async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}

async function getAndPublishAll(dataProvider, dataSources) {
  const start = async () => {
    await asyncForEach(dataSources, async feedID => {
      var resp = await getAndPublishOne(feedID, dataProvider);
      console.log("Got data for " + feedID);
    });
  };
  start();
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
