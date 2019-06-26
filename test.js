const test = require("ava");
const nock = require("nock");
const mock = require("mock-require");
const got = require("got");
const { cleanEnv, str } = require("envalid");
mock("parking.json", ["feed1", "feed2", "feed3"]);
const { getAndPublishOne, getAndPublishAll } = require("./src/server");
const input = require("./data/testInput.json");
const output = require("./data/testOutput");

test.afterEach.always(() => nock.cleanAll());

test("Get single Parking data point from BT and transform into correct format", async t => {
  const btMock = nock("https://api.rp.bt.com")
    .get("/sensors/feeds/fakeID")
    .reply(200, input);
  const env = cleanEnv(process.env, { PROVIDER_API_KEY: str(), BT_URL: str() });
  const api_key = env.PROVIDER_API_KEY;
  const bt_url = env.BT_URL;

  const bt = got.extend({
    baseUrl: bt_url,
    json: true,
    headers: {
      "x-api-key": api_key
    }
  });
  let resp = await getAndPublishOne("fakeID", bt);
  t.is(btMock.isDone(), true);
  t.deepEqual(resp, output);
});

/*test("Get all data points for Parking data from BT", async t => {
  const btMock = nock("https://api.rp.bt.com")
    .get("/sensor/feeds/feed1")
    //.get(uri => uri.includes("feeds"))
    .reply(200, input);

  /*[
    "/sensors/feeds/feed1",
    "/sensors/feeds/feed2",
    "/sensors/feeds/feed3"
  ].forEach(feedID => {
    btMock.get(feedID).reply(200, input);
  });
  const env = cleanEnv(process.env, { PROVIDER_API_KEY: str(), BT_URL: str() });
  const api_key = env.PROVIDER_API_KEY;
  const bt_url = env.BT_URL;

  const bt = got.extend({
    baseUrl: bt_url,
    json: true,
    headers: {
      "x-api-key": api_key
    }
  });

  var resp = await getAndPublishAll(bt, ["feed1"]);
  t.is(btMock.isDone(), true);
  t.deepEqual(resp, "Got data from all feeds");
});*/

//test('Get AirQuality data from BT and transform into correct format')

//test('Get Cycling share data from BT and transform into correct format')

//test('Get Noise data from Eindhoven and transform into correct format')
