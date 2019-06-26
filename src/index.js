const getAndPublishAll = require("./server");
const got = require("got");
const { cleanEnv, str } = require("envalid");
const parking = require("../data/parking.json");

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

// 5 minutes in milliseconds
let timer = 300000;
setInterval(getAndPublishAll(bt, parking), timer);
