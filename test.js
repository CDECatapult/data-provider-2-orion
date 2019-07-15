const test = require("ava");
const nock = require("nock");
const mock = require("mock-require");
const got = require("got");
mock("parking.json", ["feed1", "feed2", "feed3"]);
const api_key = "testkey";
const bt_url = "http://bt";
const orion_url = "http://orion";
const idm_url = "http://idm";
const AUTHORIZATION_BEARER = "jgfewiuhfoizjm";
const user = "a@b.com";
const password = "1234";

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
const idm = got.extend({
  baseUrl: idm_url,
  form: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${AUTHORIZATION_BEARER}`
  }
});

test.serial("Get all data points for Parking data from BT", async t => {
  let idmMock = nock(idm_url)
    .post("/oauth2/token", "grant_type=password&user=a%40b.com&password=1234")
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });
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
  var resp = await getAndPublishAll(
    bt,
    orion,
    dataFeedsTransformMap,
    idm,
    user,
    password
  );
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.is(idmMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});

test.serial("Get all data points for Bicycle Share data from BT", async t => {
  let idmMock = nock(idm_url)
    .post("/oauth2/token", "grant_type=password&user=a%40b.com&password=1234")
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });
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
  var resp = await getAndPublishAll(
    bt,
    orion,
    dataFeedsTransformMap,
    idm,
    user,
    password
  );
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.is(idmMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});

test.serial("Get all data points for Air Quality data from BT", async t => {
  let idmMock = nock(idm_url)
    .post("/oauth2/token", "grant_type=password&user=a%40b.com&password=1234")
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });
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
  var resp = await getAndPublishAll(
    bt,
    orion,
    dataFeedsTransformMap,
    idm,
    user,
    password
  );
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.is(idmMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});
