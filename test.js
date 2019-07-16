const test = require("ava");
const nock = require("nock");
const mock = require("mock-require");

const parkingFeedIDs = ["feed1", "feed2", "feed3"];
const bicycleShareFeedIDs = ["feed4", "feed5", "feed6"];
//const airqualityFeedIDs = ["feed7", "feed8", "feed9"];
const env = {
  PROVIDER_API_KEY: "testkey",
  BT_URL: "http://bt",
  ORION_URL: "http://orion",
  AUTHORIZATION_URL: "http://idm",
  AUTHORIZATION_BEARER: "jgfewiuhfoizjm",
  IDM_EMAIL: "a@b.com",
  IDM_PASSWORD: "1234"
};

const parkingInput = require("./data/test/testInputParking.json");
const parkingOutput = require("./data/test/testOutputParkingKeyValue.json");
const bicycleInput = require("./data/test/testInputBicycleShare.json");
const bicycleOutput = require("./data/test/testOutputBicycleShare.json");
//const airQualityInput = require("./data/test/testInputAirQuality.json");
//const airQualityOutput = require("./data/test/testOutputAirQuality.json");

test.afterEach.always(() => {
  nock.cleanAll();
  mock.stopAll();
});

nock.disableNetConnect();

test.serial("Get all data points for Parking data from BT", async t => {
  mock("./data/parkingFeedIDs.json", parkingFeedIDs);
  mock("./data/bicycleShareFeedIDs.json", []);
  mock("./src/env", env);

  const { handler } = mock.reRequire("./src");

  let idmMock = nock(env.AUTHORIZATION_URL)
    .post("/oauth2/token", "grant_type=password&username=a@b.com&password=1234")
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });
  let btMock = nock(env.BT_URL);
  parkingFeedIDs.forEach(feedID => {
    btMock = btMock.get(`/${feedID}`).reply(200, parkingInput);
  });
  let orionMock = nock(env.ORION_URL)
    .post("/v2/op/update?options=keyValues", body => {
      t.deepEqual(body, parkingOutput);
      return true;
    })
    .times(parkingFeedIDs.length)
    .reply(201, {});

  await handler();

  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.is(idmMock.isDone(), true);
});

test.serial("Get all data points for Bicycle Share data from BT", async t => {
  mock("./data/parkingFeedIDs.json", []);
  mock("./data/bicycleShareFeedIDs.json", bicycleShareFeedIDs);
  mock("./src/env", env);

  const { handler } = mock.reRequire("./src");

  let idmMock = nock(env.AUTHORIZATION_URL)
    .post("/oauth2/token", "grant_type=password&username=a@b.com&password=1234")
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });
  let btMock = nock(env.BT_URL);
  bicycleShareFeedIDs.forEach(feedID => {
    btMock = btMock.get(`/${feedID}`).reply(200, bicycleInput);
  });
  let orionMock = nock(env.ORION_URL)
    .post("/v2/op/update?options=keyValues", body => {
      t.deepEqual(body, bicycleOutput);
      return true;
    })
    .times(bicycleShareFeedIDs.length)
    .reply(201, {});

  await handler();
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.is(idmMock.isDone(), true);
});
/*
test.serial("Get all data points for Air Quality data from BT", async t => {
  let idmMock = nock(env.IDM_URL)
    .post("/oauth2/token", "grant_type=password&user=a%40b.com&password=1234")
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });
  let btMock = nock(env.BT_URL);
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/${feedID}`).reply(200, airQualityInput);
  });
  let orionMock = nock(env.ORION_URL)
    .post("/v2/op/update?options=keyValues", body => {
      t.deepEqual(body, airQualityOutput);
      return true;
    })
    .times(feedIDs.length)
    .reply(201, {});

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
});*/
