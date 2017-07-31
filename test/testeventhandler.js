"use strict";

const expect = require("chai").expect;

const urlCounter = require("./../code/helpers/urlcounter.js").OCounter;
const eventHandler = require("./../code/tweetsource/eventhandler.js").handleTweetEvent;
const store = require("./../datastore/arraystore.js");

it("Add with store", function() {


  const storage = [];

  const storage_provider = store.getArrayStorageProvider(storage);
  const counter = new urlCounter([], storage_provider);

  eventHandler(counter, "tweet_1", "9001", "david", [{ expanded_url: "http://exp.url.com/one" }]);
  expect(storage.length).to.equal(1);
  expect(storage[0].value.length).to.equal(1);
  expect(storage[0].key.url).to.equal("http://exp.url.com/one");
  expect(storage[0].value[0].tweet.text).to.equal("tweet_1");

  eventHandler(counter, "tweet_2", "9002", "david", [{ expanded_url: "http://exp.url.com/one" }]);
  expect(storage.length).to.equal(1);
  expect(storage[0].value.length).to.equal(2);
  expect(storage[0].key.url).to.equal("http://exp.url.com/one");
  expect(storage[0].value[0].tweet.text).to.equal("tweet_1");
  expect(storage[0].value[1].tweet.text).to.equal("tweet_2");

  eventHandler(counter, "tweet_3", "9003", "david", [{ expanded_url: "http://exp.url.com/two" }]);
  expect(storage.length).to.equal(2);
  expect(storage[0].value.length).to.equal(1);
  expect(storage[0].key.url).to.equal("http://exp.url.com/two");
  expect(storage[0].value[0].tweet.text).to.equal("tweet_3");
  expect(storage[1].value.length).to.equal(2);
  expect(storage[1].key.url).to.equal("http://exp.url.com/one");
  expect(storage[1].value[0].tweet.text).to.equal("tweet_1");
  expect(storage[1].value[1].tweet.text).to.equal("tweet_2");

  eventHandler(counter, "tweet_1", "9001", "david", [{ expanded_url: null }]);
  expect(storage.length).to.equal(2);
  expect(storage[0].value.length).to.equal(1);
  expect(storage[0].key.url).to.equal("http://exp.url.com/two");
  expect(storage[0].value[0].tweet.text).to.equal("tweet_3");
  expect(storage[1].value.length).to.equal(2);
  expect(storage[1].key.url).to.equal("http://exp.url.com/one");
  expect(storage[1].value[0].tweet.text).to.equal("tweet_1");
  expect(storage[1].value[1].tweet.text).to.equal("tweet_2");

})

