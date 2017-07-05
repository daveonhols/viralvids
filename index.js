const moment = require("moment");

const UrlCounter = require("./code/objcounter.js").OCounter;
const mongo = require("./db/mongo.js");
const client = require("./code/client.js").client;
const handleTweetEvent = require("./code/eventhandler.js").handleTweetEvent;

function initStream(docs, storage_provider) {
  const count_tweets = new UrlCounter(docs, storage_provider);
  const stream = client.stream("statuses/filter", { track: "youtube London", language: "en" });

  stream.on("data", (event) => {
    if (!event) {
      return;
    }

    handleTweetEvent(
      count_tweets,
      event.text,
      event.id_str,
      event.user.name,
      event.entities.urls,
      moment());

    console.log(count_tweets.max());
  });

  stream.on("error", (error) => {
    console.log(error);
    throw error;
  });
}

mongo.getDb()
  .then(db => db.collection("start"))
  .then(col => col.find({}, { _id: 0 }).toArray())
  .then(docs => initStream(docs, mongo.getMongoStorageProvider()));
