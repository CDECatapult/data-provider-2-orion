const test = require("ava");
const nock = require("nock");
const mock = require("mock-require");
const got = require("got");
mock("parking.json", ["feed1", "feed2", "feed3"]);
const api_key = "testkey";
const bt_url = "http://bt";
const orion_url = "http://orion";

const transformParking = require("./src/transformParking");
const transformBicycleShare = require("./src/transformBicycleShare");
const transformAirQuality = require("./src/transformAirQuality");
const getAndPublishAll = require("./src/server");
const parkingInput = require("./data/test/testInputParking.json");
const parkingOutput = require("./data/test/testOutputParkingKeyValue.json");
const bicycleInput = require("./data/test/testInputBicycleShare.json");
const bicycleOutput = require("./data/test/testOutputBicycleShare.json");
const airQualityInput = require("./data/test/testInputAirQuality.json");
const airQualityOutput = require("./data/test/testOutputAirQuality.json");

test.afterEach.always(() => nock.cleanAll());
nock.disableNetConnect();

test.serial("Get all data points for Parking data from BT", async t => {
  let btMock = nock(bt_url);
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/${feedID}`).reply(200, parkingInput);
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
  let btMock = nock(bt_url);
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/${feedID}`).reply(200, bicycleInput);
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
  let btMock = nock(bt_url);
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/${feedID}`).reply(200, airQualityInput);
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
