const test = require("ava");
const nock = require("nock");
const mock = require("mock-require");
const got = require("got");
const { cleanEnv, str } = require("envalid");
mock("parking.json", ["feed1", "feed2", "feed3"]);

const transformParking = require("./src/transformParking");
const transformBicycleShare = require("./src/transformBicycleShare");
const transformAirQuality = require("./src/transformAirQuality");
const { getAndPublishOne, getAndPublishAll } = require("./src/server");
const parkingInput = require("./data/testInputParking.json");
const parkingOutput = require("./data/testOutputParkingKeyValue.json");
const bicycleInput = require("./data/testInputBicycleShare.json");
const bicycleOutput = require("./data/testOutputBicycleShare.json");
const airQualityInput = require("./data/testInputAirQuality.json");
const airQualityOutput = require("./data/testOutputAirQuality.json");

test.afterEach.always(() => nock.cleanAll());
nock.disableNetConnect();

test.serial(
  "Get single Parking data point from BT and transform into correct format",
  async t => {
    let btMock = nock("https://api.rp.bt.com")
      .get("/sensors/feeds/fakeID")
      .reply(200, parkingInput);
    let orionMock = nock("http://34.244.86.232:1026")
      .post("/v2/op/update?options=keyValues", body => {
        t.deepEqual(body, parkingOutput);
        return true;
      })
      .reply(201, {});

    const env = cleanEnv(process.env, {
      PROVIDER_API_KEY: str(),
      BT_URL: str()
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
    let resp,
      transformed = await getAndPublishOne(
        "fakeID",
        orion,
        bt,
        transformParking
      );
    console.log(resp);
    t.is(btMock.isDone(), true);
    t.is(orionMock.isDone(), true);
    t.deepEqual(transformed, parkingOutput);
  }
);

test.serial("Get all data points for Parking data from BT", async t => {
  let btMock = nock("https://api.rp.bt.com");
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/sensors/feeds/${feedID}`).reply(200, parkingInput);
  });
  let orionMock = nock("http://34.244.86.232:1026")
    .post("/v2/op/update?options=keyValues")
    .times(feedIDs.length)
    .reply(201, {});

  const env = cleanEnv(process.env, { PROVIDER_API_KEY: str(), BT_URL: str() });
  const api_key = env.PROVIDER_API_KEY;
  const bt_url = env.BT_URL;
  const orion_url = env.ORION_URL;
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

  var resp = await getAndPublishAll(
    bt,
    orion,
    ["feed1", "feed2"],
    transformParking
  );
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});

test.serial(
  "Get single Bicycle Sharing data point from BT and transform into correct format",
  async t => {
    let btMock = nock("https://api.rp.bt.com")
      .get("/sensors/feeds/fakeID")
      .reply(200, bicycleInput);
    let orionMock = nock("http://34.244.86.232:1026")
      .post("/v2/op/update?options=keyValues", body => {
        t.deepEqual(body, bicycleOutput);
        return true;
      })
      .reply(201, {});

    const env = cleanEnv(process.env, {
      PROVIDER_API_KEY: str(),
      BT_URL: str()
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
    let resp,
      transformed = await getAndPublishOne(
        "fakeID",
        orion,
        bt,
        transformBicycleShare
      );
    console.log(resp);
    t.is(btMock.isDone(), true);
    t.is(orionMock.isDone(), true);
    t.deepEqual(transformed, bicycleOutput);
  }
);

test.serial("Get all data points for Bicycle Share data from BT", async t => {
  let btMock = nock("https://api.rp.bt.com");
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/sensors/feeds/${feedID}`).reply(200, bicycleInput);
  });
  let orionMock = nock("http://34.244.86.232:1026")
    .post("/v2/op/update?options=keyValues")
    .times(feedIDs.length)
    .reply(201, {});

  const env = cleanEnv(process.env, { PROVIDER_API_KEY: str(), BT_URL: str() });
  const api_key = env.PROVIDER_API_KEY;
  const bt_url = env.BT_URL;
  const orion_url = env.ORION_URL;
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

  var resp = await getAndPublishAll(
    bt,
    orion,
    ["feed1", "feed2"],
    transformBicycleShare
  );
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});

test.serial(
  "Get single AirQuality data point from BT and transform into correct format",
  async t => {
    nock.cleanAll();
    let btMock = nock("https://api.rp.bt.com")
      .get("/sensors/feeds/fakeID")
      .reply(200, airQualityInput);
    let orionMock = nock("http://34.244.86.232:1026")
      .post("/v2/op/update?options=keyValues", body => {
        //console.log(`BODY AS STRING`, body);
        //console.log(`output AS STRING`, airQualityOutput);
        t.deepEqual(body, airQualityOutput);
        return true;
      })
      .reply(201, {});

    const env = cleanEnv(process.env, {
      PROVIDER_API_KEY: str(),
      BT_URL: str()
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
    let resp,
      transformed = await getAndPublishOne(
        "fakeID",
        orion,
        bt,
        transformAirQuality
      );
    //console.log(transformed);
    t.is(btMock.isDone(), true);
    t.is(orionMock.isDone(), true);
  }
);

test.serial("Get all data points for Air Quality data from BT", async t => {
  let btMock = nock("https://api.rp.bt.com");
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/sensors/feeds/${feedID}`).reply(200, airQualityInput);
  });
  let orionMock = nock("http://34.244.86.232:1026")
    .post("/v2/op/update?options=keyValues")
    .times(feedIDs.length)
    .reply(201, {});

  const env = cleanEnv(process.env, { PROVIDER_API_KEY: str(), BT_URL: str() });
  const api_key = env.PROVIDER_API_KEY;
  const bt_url = env.BT_URL;
  const orion_url = env.ORION_URL;
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

  var resp = await getAndPublishAll(
    bt,
    orion,
    ["feed1", "feed2"],
    transformAirQuality
  );
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});
