const test = require("ava");
const nock = require("nock");
const mock = require("mock-require");
const got = require("got");
const { cleanEnv, str } = require("envalid");
mock("parking.json", ["feed1", "feed2", "feed3"]);

const transformParking = require("./src/transformParking");
const transformBicycleShare = require("./src/transformBicycleShare");
const transformAirQuality = require("./src/transformAirQuality");
const getAndPublishAll = require("./src/server");
const parkingInput = require("./data/testInputParking.json");
const parkingOutput = require("./data/testOutputParkingKeyValue.json");
const bicycleInput = require("./data/testInputBicycleShare.json");
const bicycleOutput = require("./data/testOutputBicycleShare.json");
const airQualityInput = require("./data/testInputAirQuality.json");
const airQualityOutput = require("./data/testOutputAirQuality.json");

test.afterEach.always(() => nock.cleanAll());
nock.disableNetConnect();

test.serial("Get all data points for Parking data from BT", async t => {
  const env = cleanEnv(process.env, {
    PROVIDER_API_KEY: str(),
    BT_URL: str(),
    ORION_URL: str()
  });
  const api_key = env.PROVIDER_API_KEY;
  const bt_url = env.BT_URL;
  const orion_url = env.ORION_URL;
  let btMock = nock("https://api.rp.bt.com");
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/sensors/feeds/${feedID}`).reply(200, parkingInput);
  });
  let orionMock = nock(orion_url)
    .post("/v2/op/update?options=keyValues", body => {
      t.deepEqual(body, parkingOutput);
      return true;
    })
    .times(feedIDs.length)
    .reply(201, {});

  console.log(`TEST ALL: ${orion_url}`);

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
  var dataFeedsTransformMap = [];

  for (let feedID of feedIDs) {
    dataFeedsTransformMap.push({ id: feedID, transform: transformParking });
  }
  var resp = await getAndPublishAll(bt, orion, dataFeedsTransformMap);
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});

test.serial("Get all data points for Bicycle Share data from BT", async t => {
  const env = cleanEnv(process.env, {
    PROVIDER_API_KEY: str(),
    BT_URL: str(),
    ORION_URL: str()
  });
  const api_key = env.PROVIDER_API_KEY;
  const bt_url = env.BT_URL;
  const orion_url = env.ORION_URL;
  let btMock = nock("https://api.rp.bt.com");
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/sensors/feeds/${feedID}`).reply(200, bicycleInput);
  });
  let orionMock = nock(orion_url)
    .post("/v2/op/update?options=keyValues", body => {
      t.deepEqual(body, bicycleOutput);
      return true;
    })
    .times(feedIDs.length)
    .reply(201, {});

  console.log(`TEST ALL: ${orion_url}`);

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
  var dataFeedsTransformMap = [];

  for (let feedID of feedIDs) {
    dataFeedsTransformMap.push({
      id: feedID,
      transform: transformBicycleShare
    });
  }
  var resp = await getAndPublishAll(bt, orion, dataFeedsTransformMap);
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});

test.serial("Get all data points for Air Quality data from BT", async t => {
  const env = cleanEnv(process.env, {
    PROVIDER_API_KEY: str(),
    BT_URL: str(),
    ORION_URL: str()
  });
  const api_key = env.PROVIDER_API_KEY;
  const bt_url = env.BT_URL;
  const orion_url = env.ORION_URL;
  let btMock = nock("https://api.rp.bt.com");
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/sensors/feeds/${feedID}`).reply(200, airQualityInput);
  });
  let orionMock = nock(orion_url)
    .post("/v2/op/update?options=keyValues", body => {
      t.deepEqual(body, airQualityOutput);
      return true;
    })
    .times(feedIDs.length)
    .reply(201, {});

  console.log(`TEST ALL: ${orion_url}`);

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

  var dataFeedsTransformMap = [];

  for (let feedID of feedIDs) {
    dataFeedsTransformMap.push({ id: feedID, transform: transformAirQuality });
  }
  var resp = await getAndPublishAll(bt, orion, dataFeedsTransformMap);
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});
