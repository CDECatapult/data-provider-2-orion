const getAndPublishAll = require("./server");
const got = require("got");
const { cleanEnv, str } = require("envalid");
const parkingIDs = require("../data/parkingFeedIDs.json");
const bicycleIDs = require("../data/bicycleShareFeedIDs.json");
const transformParking = require("./transformParking");
const transformBicycleShare = require("./transformBicycleShare");

const env = cleanEnv(process.env, {
  PROVIDER_API_KEY: str(),
  BT_URL: str(),
  ORION_URL: str()
});
const api_key = env.PROVIDER_API_KEY;
const bt_url = env.BT_URL;
const orion_url = env.ORION_URL;

const orion = got.extend({
  baseUrl: orion_url,
  json: true
});

const bt = got.extend({
  baseUrl: bt_url,
  json: true,
  headers: {
    "x-api-key": api_key
  }
});

// This is grouping each feed id with the corresponding transform function
var dataFeedsTransformMap = [];

for (let parkingID of parkingIDs) {
  dataFeedsTransformMap.push({
    id: parkingID,
    transform: transformParking,
    fiwareService: "manchester"
  });
}

for (let bicycleID of bicycleIDs) {
  dataFeedsTransformMap.push({
    id: bicycleID,
    transform: transformBicycleShare,
    fiwareService: "dublin"
  });
}

exports.handler = async event => {
  const status = await getAndPublishAll(bt, orion, dataFeedsTransformMap);

  const response = {
    statusCode: 200,
    body: status
  };

  return response;
};
