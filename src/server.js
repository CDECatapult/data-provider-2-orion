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
  console.log(`Getting data from provider (feedId = ${feedID})...`);
  const data = await getDataFromProvider(feedID, dataProvider);
  console.log("Got data from provider");

  console.log("Transforming data...");
  const transformedData = transform(data);
  console.log("Data transformed");

  console.log("Publishing data...");
  await publishToBroker(transformedData, dataBroker, oauth2, fiwareService);
  console.log("Data published");
}

async function getAndPublishAll(
  dataProvider,
  dataBroker,
  dataFeedTransformMap,
  idm,
  idmUser,
  idmPassword
) {
  console.log("Getting auth token from IDM...");
  const oauth2 = await getAuthToken(idm, idmUser, idmPassword);
  console.log("Got auth token from IDM");

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
      console.error(
        `Error while processing data feed ${dataFeedID} with fiwareService ${fiwareService}`,
        err
      );
      errors++;
    }
  }
  return { published, errors };
}

module.exports = getAndPublishAll;
