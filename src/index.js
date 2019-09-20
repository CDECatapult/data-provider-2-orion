const getAndPublishAll = require("./server");
const got = require("got");
const parkingIDs = require("../data/parkingFeedIDs.json");
const bicycleIDs = require("../data/bicycleShareFeedIDs.json");
const weatherObservedIDs = require("../data/weatherObservedFeedIDs.json");
const weatherForecastIDs = require("../data/weatherForecastFeedIDs.json");
const airQualityIDs = require("../data/airQualityFeedIDs.json");
const transformParking = require("./transformParking");
const transformBicycleShare = require("./transformBicycleShare");
const transformWeatherObserved = require("./transformWeatherObserved");
const transformWeatherForecast = require("./transformWeatherForecast");
const transformAirQuality = require("./transformAirQuality");
const env = require("./env");

const orion = got.extend({
  baseUrl: env.CONTEXT_BROKER_URL,
  json: true
});

const bt = got.extend({
  baseUrl: env.BT_DATAHUB_URL,
  json: true,
  headers: {
    "x-api-key": env.BT_DATAHUB_API_KEY
  }
});

const idm = got.extend({
  baseUrl: env.IDM_URL,
  form: true,
  json: true,
  headers: {
    Authorization: `Basic ${env.IDM_APP_AUTH_TOKEN}`
  }
});

// This is grouping each feed id with the corresponding transform function
let dataFeedsTransformMap = [];

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

for (let weatherObservedID of weatherObservedIDs) {
  dataFeedsTransformMap.push({
    id: weatherObservedID,
    transform: transformWeatherObserved,
    fiwareService: "manchester"
  });
}

for (let weatherForecastID of weatherForecastIDs) {
  dataFeedsTransformMap.push({
    id: weatherForecastID,
    transform: transformWeatherForecast,
    fiwareService: "manchester"
  });
}

for (let airQualityID of airQualityIDs) {
  dataFeedsTransformMap.push({
    id: airQualityID,
    transform: transformAirQuality,
    fiwareService: "manchester"
  });
}

exports.handler = async event => {
  const { published, errors } = await getAndPublishAll(
    bt,
    orion,
    dataFeedsTransformMap,
    idm,
    env.IDM_USERNAME,
    env.IDM_PASSWORD
  );

  const response = {
    statusCode: 200,
    body: `Published: ${published}, errors: ${errors}`
  };

  return response;
};
