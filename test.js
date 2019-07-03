const test = require("ava");
const nock = require("nock");
const mock = require("mock-require");
const got = require("got");
const { cleanEnv, str } = require("envalid");
mock("parking.json", ["feed1", "feed2", "feed3"]);
const { getAndPublishOne, getAndPublishAll } = require("./src/server");
const input = require("./data/testInputParking.json");
const output = require("./data/testOutputParkingKeyValue.json");

test.afterEach.always(() => nock.cleanAll());
//nock.disableNetConnect();

test.serial(
  "Get single Parking data point from BT and transform into correct format",
  async t => {
    let btMock = nock("https://api.rp.bt.com")
      .get("/sensors/feeds/fakeID")
      .reply(200, input);
    let orionMock = nock("http://34.244.86.232:1026")
      .post("/v2/op/update?options=keyValues", body => {
        t.deepEqual(body, output);
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
      transformed = await getAndPublishOne("fakeID", orion, bt);
    console.log(resp);
    t.is(btMock.isDone(), true);
    t.is(orionMock.isDone(), true);
    t.deepEqual(transformed, output);
  }
);

test.serial("Get all data points for Parking data from BT", async t => {
  let btMock = nock("https://api.rp.bt.com");
  let feedIDs = ["feed1", "feed2"];
  feedIDs.forEach(feedID => {
    btMock = btMock.get(`/sensors/feeds/${feedID}`).reply(200, input);
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

  var resp = await getAndPublishAll(bt, orion, ["feed1", "feed2"]);
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});

//test('Get AirQuality data from BT and transform into correct format')

//test('Get Cycling share data from BT and transform into correct format')

//test('Get Noise data from Eindhoven and transform into correct format')
