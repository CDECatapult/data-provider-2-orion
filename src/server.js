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

  const resp = await dataBroker.post("/v2/op/update?options=keyValues", {
    body: { actionType: "APPEND", entities: [data] },
    headers
  });
  return resp;
}

async function getDataFromProvider(feedID, dataProvider) {
  const resp = await dataProvider.get(feedID);
  return resp.body;
}

async function getAndPublishOne(
  feedID,
  dataBroker,
  dataProvider,
  transform,
  oauth2,
  fiwareService = null
) {
  const data = await getDataFromProvider(feedID, dataProvider);

  const transformedData = transform(data, fiwareService);

  await publishToBroker(transformedData, dataBroker, oauth2, fiwareService);
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

  let published = 0;
  let errors = 0;

  for (const dataSource of dataFeedTransformMap) {
    const { id: dataFeedID, transform, fiwareService } = dataSource;

    try {
      await getAndPublishOne(
        dataFeedID,
        dataBroker,
        dataProvider,
        transform,
        oauth2,
        fiwareService
      );
      published++;
    } catch (err) {
      console.log(
        `Error while processing data feed ${dataFeedID} with fiwareService ${fiwareService}`,
        err
      );
      errors++;
    }
  }
  return { published, errors };
}

module.exports = getAndPublishAll;
