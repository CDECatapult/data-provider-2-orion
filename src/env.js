const { cleanEnv, str, email, url } = require("envalid");

const env = cleanEnv(process.env, {
  PROVIDER_API_KEY: str(),
  BT_URL: url(),
  ORION_URL: url(),
  AUTHORIZATION_URL: url(),
  AUTHORIZATION_BEARER: str(),
  IDM_EMAIL: email(),
  IDM_PASSWORD: str()
});

module.exports = env;
