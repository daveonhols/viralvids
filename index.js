const moment = require("moment");
const commandLineArgs = require("command-line-args");

const UrlCounter = require("./code/objcounter.js").OCounter;
const mongo = require("./db/mongo.js");
const client = require("./code/client.js").client;
const handleTweetEvent = require("./code/eventhandler.js").handleTweetEvent;

const optionDefinitions = [
  { name: "search", alias: "s", type: String }
];

const options = commandLineArgs(optionDefinitions);

const search_key = options.search;
console.log(search_key);


function initStream(docs, storage_provider) {
  const count_tweets = new UrlCounter(docs, storage_provider);

  const stream = client.stream("statuses/filter", { track: `youtube ${search_key}`, language: "en" });

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
  .then(db => db.collection(search_key))
  .then(col => col.find({}, { _id: 0 }).toArray())
  .then(docs => initStream(docs, mongo.getMongoStorageProvider(search_key)));

