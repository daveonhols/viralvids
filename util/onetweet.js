"use strict";

const client = require("./../code/client.js").client;

client.get(
  "statuses/show",
  { id: "883809397977350144" },
  function(error, tweet, response) {
    if(error) throw error;
    console.log(tweet.entities.urls);  // Tweet body.
  });