'use strict';

const express = require("express");
const url = require('url');
const request = require('request');
const b64 = require("base-64")
const urlencode = require('urlencode');

const Secrets = require("../secrets/secret.js");

const key = Secrets.getSecret("consumer_key");
const secret = Secrets.getSecret("consumer_secret");

const rawHeader = urlencode(key) + ":" + urlencode(secret);
const authHeader = b64.encode(rawHeader);

console.log("raw input = " + rawHeader);
console.log("base64 input = " + authHeader);

var options = {
  method: "post",
  body: "grant_type=client_credentials",
  url: 'https://api.twitter.com/oauth2/token',
  headers: {
    'Authorization': 'Basic ' + authHeader,
    "Content-Type" : "application/x-www-form-urlencoded;charset=UTF-8"
  }
};

function callback(error, response, body) {
  console.log(response);
  console.log(error);
  if (!error && response.statusCode == 200) {
    const info = JSON.parse(body);
    console.log(info);
  }
}

request(options, callback);

const app = express();
app.listen(3000, "0.0.0.0", () => console.log("Starting up..."));