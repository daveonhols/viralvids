"use strict";

const client = require("./../code/client.js").client;

client.get(
  "statuses/show",
  { id: "881640952456261633"  },
  function(error, tweet, response) {
    if(error) throw error;
    console.log(tweet);  // Tweet body.
  });