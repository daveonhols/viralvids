
const Twitter = require("twitter");
const Secrets = require("../../secrets/secret.js");

const client = new Twitter({
  consumer_key: Secrets.getSecret("consumer_key"),
  consumer_secret: Secrets.getSecret("consumer_secret"),
  access_token_key: Secrets.getSecret("access_token_key"),
  access_token_secret: Secrets.getSecret("access_token_secret")
});

exports.client = client;
