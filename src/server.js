async function getAuthToken(idm, username, password) {
  const resp = await idm.post("/oauth2/token", {
    body: { grant_type: "password", username, password }
  });
  return resp.body.access_token;
}

async function publishToBroker(data, dataBroker, oauth2, fiwareService = null) {
  const headers = {
    "x-auth-token": oauth2
  };

  if (fiwareService != null) {
    headers["Fiware-Service"] = fiwareService;
    headers["Fiware-Path"] = "/";
  }

  try {
    const resp = await dataBroker.post("/v2/op/update?options=keyValues", {
      body: { actionType: "APPEND", entities: [data] },
      headers
    });
    return resp;
  } catch (err) {
    console.log(`ERROR IN publishToBroker`, err);
  }
}

async function getDataFromProvider(feedID, dataProvider) {
  try {
    return (await dataProvider.get(feedID)).body;
  } catch (err) {
    console.error(err);
  }
}

async function getAndPublishAll(
  dataProvider,
  dataBroker,
  dataFeedTransformMap,
  idm,
  idmUser,
  idmPassword
) {
  const oauth2 = await getAuthToken(idm, idmUser, idmPassword);
  for (let dataSource of dataFeedTransformMap) {
    dataFeedID = dataSource.id;
    transform = dataSource.transform;
    fiwareService = dataSource.fiwareService;

    let resp = await getAndPublishOne(
      dataFeedID,
      dataBroker,
      dataProvider,
      transform,
      oauth2,
      fiwareService
    );
  }
  return "Got data from all feeds";
}

async function getAndPublishOne(
  feedID,
  dataBroker,
  dataProvider,
  transform,
  oauth2,
  fiwareService = null
) {
  try {
    const data = await getDataFromProvider(feedID, dataProvider);
    const transformedData = transform(data);
    return publishToBroker(transformedData, dataBroker, oauth2, fiwareService);
  } catch (err) {
    console.error(err);
  }
}

module.exports = getAndPublishAll;
