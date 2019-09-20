const test = require("ava");
const nock = require("nock");
const mock = require("mock-require");
const equal = require("deep-equal");

const parkingFeedIDs = ["feed1", "feed2", "feed3"];
const bicycleShareFeedIDs = ["feed4", "feed5", "feed6"];
const weatherObservedFeedIDs = ["feed7", "feed8", "feed9"];
const weatherForecastFeedIDs = ["feed10", "feed11", "feed12"];
const airQualityFeedIDs = ["feed13", "feed14"];
const env = {
  BT_DATAHUB_API_KEY: "testkey",
  BT_DATAHUB_URL: "http://bt",
  CONTEXT_BROKER_URL: "http://orion",
  IDM_URL: "http://idm",
  IDM_APP_AUTH_TOKEN: "jgfewiuhfoizjm",
  IDM_USERNAME: "a@b.com",
  IDM_PASSWORD: "1234"
};

const parkingInput = require("./data/test/testInputParking.json");
const parkingOutput = require("./data/test/testOutputParkingKeyValue.json");
const bicycleInput = require("./data/test/testInputBicycleShare.json");
const bicycleOutput = require("./data/test/testOutputBicycleShare.json");
const weatherObservedInput = require("./data/test/testInputWeatherObserved.json");
const weatherObservedOutput = require("./data/test/testOutputWeatherObserved.json");
const weatherForecastInput = require("./data/test/testInputWeatherForecast.json");
const weatherForecastOutput = require("./data/test/testOutputWeatherForecast.json");
const airQualityInput1 = require("./data/test/testInputAirQuality1.json");
const airQualityOutput1 = require("./data/test/testOutputAirQuality1.json");
const airQualityInput2 = require("./data/test/testInputAirQuality2.json");
const airQualityOutput2 = require("./data/test/testOutputAirQuality2.json");

test.afterEach.always(() => {
  nock.cleanAll();
  mock.stopAll();
});

nock.disableNetConnect();

test.serial("Get all data points for Parking data from BT", async t => {
  mock("./data/parkingFeedIDs.json", parkingFeedIDs);
  mock("./data/bicycleShareFeedIDs.json", []);
  mock("./data/weatherObservedFeedIDs.json", []);
  mock("./data/weatherForecastFeedIDs.json", []);
  mock("./data/airQualityFeedIDs.json", []);
  mock("./src/env", env);

  const { handler } = mock.reRequire("./src");

  let idmMock = nock(env.IDM_URL, {
    reqheaders: {
      authorization: "Basic jgfewiuhfoizjm",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .post(
      "/oauth2/token",
      "grant_type=password&username=a%40b.com&password=1234"
    )
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });

  let btMock = nock(env.BT_DATAHUB_URL, {
    reqheaders: {
      "x-api-key": "testkey"
    }
  });
  parkingFeedIDs.forEach(feedID => {
    btMock = btMock.get(`/${feedID}`).reply(200, parkingInput);
  });

  let orionMock = nock(env.CONTEXT_BROKER_URL, {
    reqheaders: {
      "Fiware-Service": "manchester",
      "Fiware-Path": "/",
      "x-auth-token": "512353818ded748f8d3c472c86e5ba6adccb8106"
    }
  })
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
  mock("./data/weatherObservedFeedIDs.json", []);
  mock("./data/weatherForecastFeedIDs.json", []);
  mock("./data/airQualityFeedIDs.json", []);
  mock("./src/env", env);

  const { handler } = mock.reRequire("./src");

  let idmMock = nock(env.IDM_URL, {
    reqheaders: {
      authorization: "Basic jgfewiuhfoizjm",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .post(
      "/oauth2/token",
      "grant_type=password&username=a%40b.com&password=1234"
    )
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });

  let btMock = nock(env.BT_DATAHUB_URL, {
    reqheaders: {
      "x-api-key": "testkey"
    }
  });
  bicycleShareFeedIDs.forEach(feedID => {
    btMock = btMock.get(`/${feedID}`).reply(200, bicycleInput);
  });

  let orionMock = nock(env.CONTEXT_BROKER_URL, {
    reqheaders: {
      "Fiware-Service": "dublin",
      "Fiware-Path": "/",
      "x-auth-token": "512353818ded748f8d3c472c86e5ba6adccb8106"
    }
  })
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

test.serial(
  "Get all data points for Weather Observed data from BT",
  async t => {
    mock("./data/parkingFeedIDs.json", []);
    mock("./data/bicycleShareFeedIDs.json", []);
    mock("./data/weatherObservedFeedIDs.json", weatherObservedFeedIDs);
    mock("./data/weatherForecastFeedIDs.json", []);
    mock("./data/airQualityFeedIDs.json", []);
    mock("./src/env", env);

    const { handler } = mock.reRequire("./src");

    let idmMock = nock(env.IDM_URL, {
      reqheaders: {
        authorization: "Basic jgfewiuhfoizjm",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .post(
        "/oauth2/token",
        "grant_type=password&username=a%40b.com&password=1234"
      )
      .reply(200, {
        access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
        token_type: "Bearer",
        expires_in: 3599,
        refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
        scope: ["bearer"]
      });

    let btMock = nock(env.BT_DATAHUB_URL, {
      reqheaders: {
        "x-api-key": "testkey"
      }
    });
    weatherObservedFeedIDs.forEach(feedID => {
      btMock = btMock.get(`/${feedID}`).reply(200, weatherObservedInput);
    });

    let orionMock = nock(env.CONTEXT_BROKER_URL, {
      reqheaders: {
        "Fiware-Service": "manchester",
        "Fiware-Path": "/",
        "x-auth-token": "512353818ded748f8d3c472c86e5ba6adccb8106"
      }
    })
      .post("/v2/op/update?options=keyValues", body => {
        t.deepEqual(body, weatherObservedOutput);
        return true;
      })
      .times(weatherObservedFeedIDs.length)
      .reply(201, {});

    await handler();
    t.is(btMock.isDone(), true);
    t.is(orionMock.isDone(), true);
    t.is(idmMock.isDone(), true);
  }
);

test.serial(
  "Get all data points for Weather Forecast data from BT",
  async t => {
    mock("./data/parkingFeedIDs.json", []);
    mock("./data/bicycleShareFeedIDs.json", []);
    mock("./data/weatherObservedFeedIDs.json", []);
    mock("./data/weatherForecastFeedIDs.json", weatherForecastFeedIDs);
    mock("./data/airQualityFeedIDs.json", []);
    mock("./src/env", env);

    const { handler } = mock.reRequire("./src");

    let idmMock = nock(env.IDM_URL, {
      reqheaders: {
        authorization: "Basic jgfewiuhfoizjm",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .post(
        "/oauth2/token",
        "grant_type=password&username=a%40b.com&password=1234"
      )
      .reply(200, {
        access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
        token_type: "Bearer",
        expires_in: 3599,
        refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
        scope: ["bearer"]
      });

    let btMock = nock(env.BT_DATAHUB_URL, {
      reqheaders: {
        "x-api-key": "testkey"
      }
    });
    weatherForecastFeedIDs.forEach(feedID => {
      btMock = btMock.get(`/${feedID}`).reply(200, weatherForecastInput);
    });

    let orionMock = nock(env.CONTEXT_BROKER_URL, {
      reqheaders: {
        "Fiware-Service": "manchester",
        "Fiware-Path": "/",
        "x-auth-token": "512353818ded748f8d3c472c86e5ba6adccb8106"
      }
    })
      .post("/v2/op/update?options=keyValues", body => {
        t.deepEqual(body, weatherForecastOutput);
        return true;
      })
      .times(weatherForecastFeedIDs.length)
      .reply(201, {});

    await handler();
    t.is(btMock.isDone(), true);
    t.is(orionMock.isDone(), true);
    t.is(idmMock.isDone(), true);
  }
);

test.serial("Get all data points for AirQuality data from BT", async t => {
  mock("./data/parkingFeedIDs.json", []);
  mock("./data/bicycleShareFeedIDs.json", []);
  mock("./data/weatherObservedFeedIDs.json", []);
  mock("./data/weatherForecastFeedIDs.json", []);
  mock("./data/airQualityFeedIDs.json", airQualityFeedIDs);
  mock("./src/env", env);

  const { handler } = mock.reRequire("./src");

  let idmMock = nock(env.IDM_URL, {
    reqheaders: {
      authorization: "Basic jgfewiuhfoizjm",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .post(
      "/oauth2/token",
      "grant_type=password&username=a%40b.com&password=1234"
    )
    .reply(200, {
      access_token: "512353818ded748f8d3c472c86e5ba6adccb8106",
      token_type: "Bearer",
      expires_in: 3599,
      refresh_token: "3924b6dqwe01467972d5e3ff5105706bab00f3b9",
      scope: ["bearer"]
    });

  let btMock = nock(env.BT_DATAHUB_URL, {
    reqheaders: {
      "x-api-key": "testkey"
    }
  });
  btMock = btMock.get(`/${airQualityFeedIDs[0]}`).reply(200, airQualityInput1);
  btMock = btMock.get(`/${airQualityFeedIDs[1]}`).reply(200, airQualityInput2);

  let orionMock = nock(env.CONTEXT_BROKER_URL, {
    reqheaders: {
      "Fiware-Service": "manchester",
      "Fiware-Path": "/",
      "x-auth-token": "512353818ded748f8d3c472c86e5ba6adccb8106"
    }
  })
    .post("/v2/op/update?options=keyValues", body => {
      let oneOrOther =
        equal(body, airQualityOutput1) || equal(body, airQualityOutput2);
      if (!oneOrOther) {
        //this is to see the difference in the test output
        //t.deepEqual(body, airQualityOutput1);
        t.deepEqual(body, airQualityOutput2);
      } else {
        t.true(oneOrOther);
      }
      return true;
    })
    .times(airQualityFeedIDs.length)
    .reply(201, {});

  await handler();
  t.is(btMock.isDone(), true);
  t.is(orionMock.isDone(), true);
  t.is(idmMock.isDone(), true);
});
