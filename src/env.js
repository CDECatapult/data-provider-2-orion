const { cleanEnv, str, email, url } = require("envalid");

const env = cleanEnv(process.env, {
  BT_DATAHUB_API_KEY: str(),
  BT_DATAHUB_URL: url(),
  CONTEXT_BROKER_URL: url(),
  IDM_URL: url(),
  IDM_APP_AUTH_TOKEN: str(),
  IDM_USERNAME: email(),
  IDM_PASSWORD: str()
});

module.exports = env;
