const { getAndPublishOne, getAndPublishAll } = require("./server");
const got = require("got");
const { cleanEnv, str } = require("envalid");
const parkingIDs = require("../data/parkingFeedIDs.json");
const bicycleIDs = require("../data/bicycleShareFeedIDs.json");
const airQualityIDs = require("../data/airQualityFeedIDs.json");
const transformParking = require("./transformParking");
const transformBicycleShare = require("./transformBicycleShare");
const transformAirQuality = require("./transformAirQuality");

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
  json: true,
  headers: {
    "Fiware-Service": "manchester"
  }
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
  dataFeedsTransformMap.push({ id: parkingID, transform: transformParking });
}

for (let bicycleID of bicycleIDs) {
  dataFeedsTransformMap.push({
    id: bicycleID,
    transform: transformBicycleShare
  });
}

// 5 minutes in milliseconds
let timer = 300000;
setInterval(getAndPublishAll(bt, orion, dataFeedsTransformMap), timer);
