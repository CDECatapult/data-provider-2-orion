const { cleanEnv, str, email, url } = require("envalid");

const env = cleanEnv(process.env, {
  PROVIDER_API_KEY: str(),
  BT_URL: url(),
  CONTEXT_BROKER_URL: url(),
  IDM_URL: url(),
  AUTHORIZATION_BEARER: str(),
  IDM_USERNAME: email(),
  IDM_PASSWORD: str()
});

module.exports = env;
